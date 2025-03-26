<template>
	<view class="container">
		<!-- 顶部标题 -->
		<view class="header">
			<u-icon name="calendar-fill" size="32" color="#2979ff"></u-icon>
			<text class="title">当前月活动日历</text>
		</view>
		
		<!-- 自定义日历 -->
		<view class="calendar-wrap">
			<!-- 星期栏 -->
			<view class="week-bar">
				<view 
					class="week-item" 
					v-for="(item, index) in weekList" 
					:key="index"
				>
					{{item}}
				</view>
			</view>
			
			<!-- 日期网格 -->
			<view class="date-grid">
				<view 
					class="date-item" 
					v-for="(item, index) in dateList" 
					:key="index"
					:class="{
						'available': item.currentMonth && isAvailable(item.day),
						'selected': item.currentMonth && reserveDay == item.fullDate,
						'disabled': !item.currentMonth || !isAvailable(item.day)
					}"
					@click="selectDate(item)"
				>
					<text class="date-num">{{item.day}}</text>
					<view class="dot" v-if="item.currentMonth && isAvailable(item.day)"></view>
				</view>
			</view>
		</view>
		
		<!-- 底部提示 -->
		<view class="bottom-tips">
			<view class="tip-item">
				<view class="dot available"></view>
				<text>可预约</text>
			</view>
			<view class="tip-item">
				<view class="dot selected"></view>
				<text>已选择</text>
			</view>
			<view class="tip-item">
				<view class="dot disabled"></view>
				<text>不可预约</text>
			</view>
		</view>
		
		<!-- 报名弹窗 -->
		<u-modal
			:show="showModal"
			:title="modalTitle"
			showCancelButton
			@confirm="confirmSignup"
			@cancel="cancelSignup"
		>
			<view class="modal-content">
				<view class="date-info">
					<text class="label">活动日期：</text>
					<text class="value">{{selectedDate}}</text>
				</view>
				<view class="time-info">
					<text class="label">活动时间：</text>
					<text class="value">14:00-16:00</text>
				</view>
				<view class="location-info">
					<text class="label">活动地点：</text>
					<text class="value">{{activityLocation}}</text>
				</view>
			</view>
		</u-modal>
		
		<!-- 手机号绑定弹窗 -->
		<u-popup v-model="showBindModal" mode="center" :round="10">
			<view class="bind-modal">
				<view class="bind-title">绑定手机号</view>
				<view class="bind-content">
					<u-form :model="bindForm" ref="bindForm">
						<u-form-item>
							<u-input
								v-model="bindForm.mobile"
								type="number"
								placeholder="请输入手机号"
								maxlength="11"
							/>
						</u-form-item>
					</u-form>
					<view class="bind-btns">
						<u-button @click="cancelBind">取消</u-button>
						<u-button type="primary" @click="confirmBind">确认</u-button>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			weekList: ['一', '二', '三', '四', '五', '六', '日'],
			dateList: [], // 日期数据
			availableDay:[], // 可选日期
			showModal: false,
			selectedDate: null, 
			modalTitle: '活动报名确认',
			activityLocation: '创新中心体验馆',
			activityId: '',
			reserveDay: "",
			showBindModal: false,
			bindForm: {
				mobile: '',
			},
			counting: 0,
			timer: null
		}
	},
	async onLoad(e) {
		this.activityId = e.id
		this.initCalendar()
		await this.getAvailableDays()
		// 从 reserveInfo 数组中找到匹配活动 ID 的预约记录
		const userReserveInfo = this.$store.state.user.userInfo.reserveInfo
		console.log('userReserveInfo:',userReserveInfo)
		if (userReserveInfo && Array.isArray(userReserveInfo)) {
			const currentReserve = userReserveInfo.find(item => item.id === e.id)
			this.reserveDay = currentReserve ? currentReserve.date : null
		}
	},
	methods: {
		// 初始化日历数据
		initCalendar() {
			const now = new Date()
			const year = now.getFullYear()
			const month = now.getMonth()
			
			// 获取当月第一天是星期几
			const firstDay = new Date(year, month, 1).getDay() || 7
			
			// 获取当月天数
			const lastDate = new Date(year, month + 1, 0).getDate()
			
			// 上个月的最后几天
			const lastMonthLastDate = new Date(year, month, 0).getDate()
			const lastMonthDays = firstDay - 1
			
			let dateList = []
			
			// 添加上个月的日期
			for(let i = 0; i < lastMonthDays; i++) {
				dateList.push({
					day: lastMonthLastDate - lastMonthDays + i + 1,
					currentMonth: false,
					fullDate: this.formatDate(year, month - 1, lastMonthLastDate - lastMonthDays + i + 1)
				})
			}
			
			// 添加当月的日期
			for(let i = 1; i <= lastDate; i++) {
				dateList.push({
					day: i,
					currentMonth: true,
					fullDate: this.formatDate(year, month, i)
				})
			}
			
			// 添加下个月的日期
			const nextMonthDays = 42 - dateList.length
			for(let i = 1; i <= nextMonthDays; i++) {
				dateList.push({
					day: i,
					currentMonth: false,
					fullDate: this.formatDate(year, month + 1, i)
				})
			}
			
			this.dateList = dateList
		},
		
		// 判断日期是否可选
		isAvailable(day) {
			const currentItem = this.dateList.find(item => item.day === day && item.currentMonth)
			return currentItem && this.availableDay.includes(currentItem.fullDate)
		},
		
		// 格式化日期为 YYYY-MM-DD
		formatDate(year, month, day) {
			const date = new Date(year, month, day)
			const y = date.getFullYear()
			const m = (date.getMonth() + 1).toString().padStart(2, '0')
			const d = date.getDate().toString().padStart(2, '0')
			return `${y}-${m}-${d}`
		},
		
		// 选择日期
		selectDate(item) {
			// 只处理当前月且可选的日期
			if(!item.currentMonth || !this.isAvailable(item.day)) {
				return
			}
			this.selectedDate = item.fullDate
			this.showModal = true
		},
		
		// 获取可选日期
		async getAvailableDays() {
			// TODO: 调用接口获取可选日期
			console.log('获取活动ID：', this.activityId)
			const {result} = await uniCloud.callFunction({
				name: 'getReserveDays',
				data:{
					id:this.activityId
				}
			})
			console.log('result',result)
			this.activityLocation = result.data[0].location
			this.availableDay = result.data[0].availableDays
		},
		
		// 确认报名
		async confirmSignup() {
			if(this.reserveDay){
				uni.showToast({
					title: '你已报名该活动，不可重复报名',
					icon: 'none'
				})
				this.showModal = false
				return
			}
			
			if(!this.$store.state.user.userInfo){
				uni.showToast({
					title: '服务器异常',
					icon: 'none'
				})
				this.showModal = false
				return
			}
			
			if(!this.$store.state.user.userInfo.mobile){
				this.showModal = false
				this.showBindModal = true
				return
			}
			
			uni.showLoading({
				title: '提交中...'
			})
			
			try {
				// 调用云函数进行报名
				const result = await uniCloud.callFunction({
					name: 'signUp',
					data: {
						courseId: this.activityId,
						userId: this.$store.state.user.userInfo._id,
						mobile: this.$store.state.user.userInfo.mobile,
						date: this.selectedDate
					}
				})
				
				console.log('报名结果：', result)
				
				if (result.result.code === 0) {
					// 构造新的预约记录数组
					const newReserveInfo = [...(this.$store.state.user.userInfo.reserveInfo || [])];
					// 添加新的预约记录
					newReserveInfo.push({
						id: this.activityId,
						date: this.selectedDate
					});
					
					// 更新 store
					this.$store.commit('user/UPDATE_USER_INFO', {
						reserveInfo: newReserveInfo
					});
					
					// 更新用户的 reserveInfo
					const updateResult = await uniCloud.callFunction({
						name: 'updateUserInfo',
						data: {
							_id: this.$store.state.user.userInfo._id,
							reserveInfo: newReserveInfo  // 传递完整的预约记录数组
						}
					});
					
					if (!updateResult.result || updateResult.result.updated !== 1) {
						// 如果更新失败，回滚 store 中的预约信息
						this.$store.commit('user/UPDATE_USER_INFO', {
							reserveInfo: this.$store.state.user.userInfo.reserveInfo.filter(item => item.id !== this.activityId)
						});
						throw new Error('用户信息更新失败');
					}
					
					uni.hideLoading();
					uni.showToast({
						title: '报名成功',
						icon: 'success'
					});
					
					this.reserveDay = this.selectedDate;
					this.showModal = false;
					
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				} else {
					throw new Error(result.result.msg || '报名失败');
				}
			} catch (error) {
				uni.hideLoading();
				uni.showToast({
					title: error.message || '报名失败，请重试',
					icon: 'none'
				});
			}
		},
		
		// 取消报名
		cancelSignup() {
			this.showModal = false
		},
		
		// 修改确认绑定方法
		async confirmBind() {
			if(!/^1[3-9]\d{9}$/.test(this.bindForm.mobile)) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'none'
				})
				return
			}
			
			try {
				// 先更新 store 中的手机号
				this.$store.commit('user/UPDATE_USER_INFO', {
					mobile: this.bindForm.mobile
				})
				
				// 再调用云函数更新数据库
				const result = await uniCloud.callFunction({
					name: 'updateUserInfo',
					data: {
						_id: this.$store.state.user.userInfo._id,
						...this.$store.state.user.userInfo  // 传递完整的用户信息
					}
				})
				
				if(result.result.updated === 1) {
					uni.showToast({
						title: '绑定成功',
						icon: 'success'
					})
					
					this.showBindModal = false
					// 继续报名流程
					this.showModal = true
				} else {
					// 如果数据库更新失败，回滚 store 中的手机号
					this.$store.commit('user/UPDATE_USER_INFO', {
						mobile: ''
					})
					throw new Error('绑定失败，请重试')
				}
			} catch(error) {
				// 如果出错，回滚 store 中的手机号
				this.$store.commit('user/UPDATE_USER_INFO', {
					mobile: ''
				})
				uni.showToast({
					title: error.message || '绑定失败，请重试',
					icon: 'none'
				})
			}
		},
		
		// 取消绑定
		cancelBind() {
			this.showBindModal = false
			this.bindForm.mobile = ''
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	background-color: #f8f8f8;
	min-height: 100vh;
	padding: 30rpx;
}

.header {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 40rpx;
	
	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-left: 12rpx;
	}
}

.calendar-wrap {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.week-bar {
	display: flex;
	border-bottom: 2rpx solid #f5f5f5;
	padding-bottom: 20rpx;
	margin-bottom: 20rpx;
	
	.week-item {
		flex: 1;
		text-align: center;
		font-size: 28rpx;
		color: #666;
	
	}
}

.date-grid {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 10rpx;
	
	.date-item {
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 8rpx;
		position: relative;
		
		.date-num {
			font-size: 28rpx;
			color: #333;
		}
		
		.dot {
			width: 8rpx;
			height: 8rpx;
			border-radius: 50%;
			background-color: #67c23a;
			margin-top: 6rpx;
		}
		
		&.available {
			background-color: rgba(103, 194, 58, 0.1);
			
			.date-num {
				color: #67c23a;
			}
		}
		
		&.selected {
			background-color: #2979ff;
			
			.date-num {
				color: #fff;
			}
			
			.dot {
				background-color: #fff;
			}
		}
		
		&.disabled {
			opacity: 0.3;
			pointer-events: none;
		}
		
		&:active {
			transform: scale(0.95);
			transition: transform 0.2s;
		}
	}
}

.bottom-tips {
	display: flex;
	justify-content: center;
	margin-top: 30rpx;
	gap: 40rpx;
	
	.tip-item {
		display: flex;
		align-items: center;
		
		.dot {
			width: 16rpx;
			height: 16rpx;
			border-radius: 50%;
			margin-right: 8rpx;
			
			&.available {
				background-color: #67c23a;
			}
			
			&.selected {
				background-color: #2979ff;
			}
			
			&.disabled {
				background-color: #999;
			}
		}
		
		text {
			font-size: 24rpx;
			color: #666;
		}
	}
}

.modal-content {
	padding: 20rpx;
	
	.date-info,
	.time-info,
	.location-info {
		display: flex;
		margin-bottom: 16rpx;
		
		.label {
			color: #666;
			font-size: 28rpx;
			width: 160rpx;
		}
		
		.value {
			color: #333;
			font-size: 28rpx;
			font-weight: 500;
		}
		
		&:last-child {
			margin-bottom: 0;
		}
	}
}

.bind-modal {
	width: 600rpx;
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	
	.bind-title {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 30rpx;
	}
	
	.bind-content {
		.code-input {
			display: flex;
			align-items: center;
			gap: 20rpx;
		}
		
		.bind-btns {
			display: flex;
			justify-content: space-between;
			margin-top: 40rpx;
			gap: 20rpx;
			
			.u-button {
				flex: 1;
			}
		}
	}
}
</style>
