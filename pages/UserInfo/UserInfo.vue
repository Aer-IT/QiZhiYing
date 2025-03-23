<template>
	<view class="user-info">
		<!-- 顶部个人信息区域 -->
		<view class="top-section">
			<!-- 头像区域 -->
			<view class="avatar-section">
				<button 
					class="avatar-button" 
					open-type="chooseAvatar" 
					@chooseavatar="onChooseAvatar"
				>
					<image 
						class="avatar-image"
						:src="userInfo.avatar || '/static/logo.png'"
						mode="aspectFill"
					></image>
				</button>
			</view>
			
			<!-- 用户信息区域 -->
			<view class="info-section">
					<view class="name-row">
						<input
							name="nickname"
							v-model="tempNickName"
							class="nickname-input"
							placeholder="请设置昵称"
							:focus="isNicknameEditing"
							@blur="handleNicknameBlur"
						/>
						<button 
							class="edit-btn"
							@tap="toggleNicknameEdit"
						>
							<u-icon 
								name="edit-pen" 
								size="18" 
								color="#999999"
							></u-icon>
						</button>
					</view>
				
				<view class="phone-row">
					<input
						v-model="tempPhoneNumber"
						class="phone-input"
						placeholder="未绑定手机号"
						:focus="isPhoneEditing"
						@blur="handlePhoneBlur"
					/>
					<button 
						class="edit-btn"
						@tap="togglePhoneEdit"
					>
						<u-icon 
							name="edit-pen" 
							size="18" 
							color="#999999"
						></u-icon>
					</button>
				</view>
				
				<!-- 新增保存按钮 -->
				<u-button
					type="primary"
					size="small"
					:loading="isSaving"
					@click="saveUserInfo"
					class="save-btn"
					shape="circle"
				>保存修改</u-button>
			</view>
		</view>
		
		<!-- 中部功能按钮区域 -->
		<view class="function-section">
			<view class="function-item" @tap="navigateTo('/pages/shop/cart')">
				<u-icon
					name="shopping-cart"
					size="40"
					color="#5677fc"
				></u-icon>
				<text class="item-text">购物车</text>
			</view>
			
			<view class="function-item" @tap="navigateTo('/pages/activity/history')">
				<u-icon
					name="calendar"
					size="40"
					color="#ff9900"
				></u-icon>
				<text class="item-text">活动历史</text>
			</view>
			
			<view class="function-item" @tap="navigateTo('/pages/points/detail')">
				<u-icon
					name="gift"
					size="40"
					color="#19be6b"
				></u-icon>
				<text class="item-text">积分明细</text>
			</view>

			<view class="function-item" @tap="navigateTo('/pages/appointment/record')">
				<u-icon
					name="clock"
					size="40"
					color="#fa3534"
				></u-icon>
				<text class="item-text">预约记录</text>
			</view>
		</view>
		
		<!-- 底部区域 -->
		<view class="bottom-section">
			<view class="section-title">
				<text>更多服务</text>
			</view>
			
			<view class="menu-list">
				<view class="menu-item" @tap="navigateTo('/pages/about/about')">
					<view class="item-left">
						<u-icon name="info-circle" size="40" color="#5677fc"></u-icon>
						<text class="item-text">关于我们</text>
					</view>
					<u-icon name="arrow-right" size="28" color="#c0c4cc"></u-icon>
				</view>
				
				<view class="menu-item" @tap="navigateTo('/pages/points/rules')">
					<view class="item-left">
						<u-icon name="file-text" size="40" color="#ff9900"></u-icon>
						<text class="item-text">积分使用规则</text>
					</view>
					<u-icon name="arrow-right" size="28" color="#c0c4cc"></u-icon>
				</view>
				
				<view class="menu-item" @tap="navigateTo('/pages/vip/benefits')">
					<view class="item-left">
						<u-icon name="star" size="40" color="#19be6b"></u-icon>
						<text class="item-text">会员权益</text>
					</view>
					<u-icon name="arrow-right" size="28" color="#c0c4cc"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
	data() {
		return {
			isNicknameEditing: false,
			isPhoneEditing: false,
			isSaving: false,
			// 使用临时变量存储编辑的值
			tempNickName: '',
			tempPhoneNumber: '',
			nickName: '',
			phoneNumber: ''
		}
	},
	
	created() {
		// 初始化临时变量
		this.tempNickName = this.$store.state.user.userInfo.nickName;
		this.tempPhoneNumber = this.$store.state.user.userInfo.mobile;
		this.nickName = this.$store.state.user.userInfo.nickName;
		this.phoneNumber = this.$store.state.user.userInfo.mobile;
	},
	
	methods: {
		...mapMutations({
			updateUserInfo: 'user/UPDATE_USER_INFO'
		}),
		// 处理头像选择
		async onChooseAvatar(e) {
			try {
				const { avatarUrl } = e.detail;
				if (avatarUrl) {
					uni.showLoading({
						title: '更新中...'
					});
					
					this.updateUserInfo({
						avatar: avatarUrl
					});
					
					uni.hideLoading();
					uni.showToast({
						title: '更新成功',
						icon: 'success'
					});
				}
			} catch (e) {
				uni.hideLoading();
				uni.showToast({
					title: '获取头像失败',
					icon: 'none'
				});
			}
		},
		
		// 页面跳转
		navigateTo(url) {
			uni.navigateTo({
				url
			});
		},
		
		// 切换昵称编辑状态
		toggleNicknameEdit() {
			this.isNicknameEditing = true;
			this.tempNickName = this.nickName;
		},
		
		// 切换手机号编辑状态
		togglePhoneEdit() {
			this.isPhoneEditing = true;
			this.tempPhoneNumber = this.phoneNumber;
		},
		
		// 处理昵称失焦
		handleNicknameBlur() {
			this.isNicknameEditing = false;
		},
		
		// 处理手机号失焦
		handlePhoneBlur() {
			this.isPhoneEditing = false;
		},
		
		// 保存用户信息
		async saveUserInfo() {
			try {
				this.isSaving = true;
				
				// 调用云函数并等待结果
				const { result } = await uniCloud.callFunction({
					name: 'updateUserInfo',
					data: {
						_id: this.$store.state.user.userInfo._id,
						nickName: this.tempNickName,
						phoneNumber: this.tempPhoneNumber
					}
				});
				
				// 根据返回值处理结果
				if (result.code === 0) {
					// 更新成功，更新本地状态
					this.nickName = this.tempNickName;
					this.phoneNumber = this.tempPhoneNumber;
					this.updateUserInfo({
						nickName: this.tempNickName,
						mobile: this.tempPhoneNumber
					});
					
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
				} else {
					// 显示错误信息
					uni.showToast({
						title: result.message || '保存失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('保存用户信息失败:', error);
				uni.showToast({
					title: '保存失败',
					icon: 'none'
				});
			} finally {
				this.isSaving = false;
			}
		},
	}
}
</script>

<style lang="scss">
.user-info {
	background-color: #f8f8f8;
	min-height: 100vh;
	
	.top-section {
		background: #ffffff;
		padding: 60rpx 40rpx 40rpx;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		
		.avatar-section {
			.avatar-button {
				width: 200rpx !important;
				height: 200rpx !important;
				padding: 0 !important;
				border-radius: 50%;
				overflow: hidden;
				background: transparent;
				box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
				transition: all 0.3s ease;
				
				&:active {
					transform: scale(0.95);
				}
				
				&::after {
					border: none;
				}
				
				.avatar-image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
		}
		
		.info-section {
			flex: 1;
			margin-left: 40rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			
			.name-row,
			.phone-row {
				display: flex;
				align-items: center;
				background: #f8f8f8;
				padding: 16rpx 24rpx;
				border-radius: 32rpx;
				margin-bottom: 20rpx;
				width: 100%;
				box-sizing: border-box;
				
				.nickname-input,
				.phone-input {
					flex: 1;
					font-size: 32rpx;
					color: #333333;
					padding: 0;
					margin-right: 16rpx;
					background: transparent;
					text-align: left;
					
					&::placeholder {
						color: #999999;
						font-size: 28rpx;
					}
					
					&:disabled {
						opacity: 0.7;
					}
				}
				
				.edit-btn {
					padding: 0;
					margin: 0;
					background: transparent;
					line-height: 1;
					width: auto !important;
					min-width: auto;
					
					&::after {
						border: none;
					}
					
					&:active {
						opacity: 0.7;
					}
				}
			}
			
			// 新增保存按钮样式
			.save-btn {
				margin-top: 50rpx;
				width: 200rpx !important;
			}	
		}
	}
	
	.function-section {
		margin: 30rpx 20rpx;
		padding: 30rpx 20rpx;
		background: #ffffff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		border-radius: 16rpx;
		
		.function-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
			padding: 10rpx;
			flex: 1;
			
			// 圆形背景
			&::before {
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
				z-index: 0;
				transition: all 0.3s ease;
			}
			
			// 图标容器
			.u-icon {
				position: relative;
				z-index: 1;
				margin-bottom: 8rpx;
			}
			
			// 文字样式
			.item-text {
				font-size: 24rpx;
				color: #333333;
				position: relative;
				z-index: 1;
			}
			
			// 每个按钮的特殊颜色
			&:nth-child(1) {
				&::before {
					background: rgba(86, 119, 252, 0.1);
				}
			}
			
			&:nth-child(2) {
				&::before {
					background: rgba(255, 153, 0, 0.1);
				}
			}
			
			&:nth-child(3) {
				&::before {
					background: rgba(25, 190, 107, 0.1);
				}
			}
			
			&:nth-child(4) {
				&::before {
					background: rgba(250, 53, 52, 0.1);
				}
			}
			
			// 点击效果
			&:active {
				&::before {
					transform: translate(-50%, -50%) scale(0.9);
				}
				.item-text {
					opacity: 0.8;
				}
			}
			
			
		}
	}
	
	.bottom-section {
		margin-top: 30rpx;
		background: #ffffff;
		padding: 20rpx 0;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		
		.section-title {
			padding: 20rpx 40rpx;
			font-size: 32rpx;
			color: #333333;
			font-weight: bold;
		}
		
		.menu-list {
			.menu-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30rpx 40rpx;
				position: relative;
				
				&::after {
					content: '';
					position: absolute;
					left: 40rpx;
					right: 40rpx;
					bottom: 0;
					height: 1px;
					background: #f5f5f5;
				}
				
				&:last-child::after {
					display: none;
				}
				
				&:active {
					background-color: #f8f8f8;
				}
				
				.item-left {
					display: flex;
					align-items: center;
					
					.item-text {
						font-size: 28rpx;
						color: #333333;
						margin-left: 20rpx;
					}
				}
			}
		}
	}
}
</style>
