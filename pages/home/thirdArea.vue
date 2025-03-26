<template>
	<view class="container">
		<!-- 页面标题 -->
		<view class="header">
			<text class="title">{{pageTitle}}</text>
		</view>
		
		<!-- 课程轮播区域 -->
		<swiper 
			class="course-swiper" 
			:current="currentIndex"
			@change="onSwiperChange"
			:indicator-dots="true"
			indicator-color="rgba(0, 0, 0, .3)"
			indicator-active-color="#2979ff"
			:style="{ height: swiperHeight + 'px' }"
		>
			<swiper-item 
				v-for="(page, pageIndex) in coursePages" 
				:key="pageIndex"
			>
				<scroll-view 
					scroll-y 
					class="scroll-view"
				>
					<view class="course-grid">
						<view 
							class="course-card"
							v-for="(item, index) in page"
							:key="index"
							@click="toCourse(item)"
						>
							<image 
								class="card-image" 
								:src="item.image" 
								mode="aspectFill"
								lazy-load
							></image>
							<view class="card-content">
								<view class="card-header">
									<text class="card-title">{{item.title}}</text>
									<view :class="['tag', item.online ? 'tag-online' : 'tag-offline']">
										{{item.tag}}
									</view>
								</view>
								<view class="card-info">
									<text class="info-text">{{item.duration}}课时</text>
									<text class="info-text">{{item.studentCount}}人已参加</text>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	data() {
		return {
			pageTitle: "",
			currentIndex: 0,
			swiperHeight: 0,
			// 模拟数据，后续替换为实际接口数据
			courseList: [
				
			]
		}
	},
	computed: {
		// 将课程列表分页，每页3个课程
		coursePages() {
			const pages = []
			const pageSize = 3
			
			for(let i = 0; i < this.courseList.length; i += pageSize) {
				pages.push(this.courseList.slice(i, i + pageSize))
			}
			return pages
		}
	},
	async onLoad(e) {
		this.setPageTitle(e.sectype)
		this.initSwiperHeight()
		
		// 确保传入的参数是数字类型
		const params = {
			type: parseInt(e.type),
			sectype: parseInt(e.sectype)
		};
		
		const {result} = await uniCloud.callFunction({
			name: 'getThirlArea',
			data: params
		})
		
		console.log('查询参数:', params)
		console.log('查询结果:', result)
		
		if(result.data.length==0){
			uni.showToast({
				title:'暂无课程信息',
				icon: 'none'
			})
			setTimeout(()=>{
				uni.navigateBack()
			},500)
		} else {
			// 更新courseList数据
			this.courseList = result.data.map(item => ({
				id: item._id,
				title: item.title,
				image: item.displayImg ,
				duration: item.duration,  // 如果数据库中有duration字段，可以使用item.duration
				studentCount: item.studentCount,      // 如果数据库中有studentCount字段，可以使用item.studentCount           // 如果数据库中有price字段，可以使用item.price
				tag: item.online ? '线上' : '线下',
				tagType: item.online ? 'primary' : 'warning'
			}));
		}
	},
	methods: {
		setPageTitle(sectype) {
			const titles = {
				'junior': '3~8岁儿童专区',
				'senior': '8~12岁儿童专区',
				'online': '线上课程专区',
				'offline': '线下活动专区'
			}
			this.pageTitle = titles[sectype] || '课程专区'
		},
		initSwiperHeight() {
			const systemInfo = uni.getSystemInfoSync()
			// 计算swiper高度：屏幕高度 - 头部高度(包含margin) - tabbar高度
			this.swiperHeight = systemInfo.windowHeight - uni.upx2px(140)
		},
		// 轮播图切换事件
		onSwiperChange(e) {
			this.currentIndex = e.detail.current
		},
		// 跳转到课程详情
		toCourse(item) {
			uni.navigateTo({
				url: `/pages/course/course?_id=${item.id}`
			})
		},
	
		
	}
}
</script>

<style lang="scss" scoped>
.container {
	background-color: #f5f5f5;
	height: 100vh;
}

.header {
	padding: 20rpx;
	background-color: #fff;
	margin-bottom: 10rpx;
	
	.title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		display: block;
		text-align: center;
	}
}

.scroll-view {
	height: 100%;
}

.course-grid {
	padding: 15rpx;
	display: flex;
	flex-direction: column;
	gap: 15rpx;
}

.course-card {
	background: #fff;
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	
	.card-image {
		width: 100%;
		height: 280rpx;
	}
	
	.card-content {
		padding: 16rpx;
		
		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			margin-bottom: 12rpx;
			
			.card-title {
				flex: 1;
				font-size: 28rpx;
				font-weight: bold;
				color: #333;
				margin-right: 16rpx;
			}
			
			.tag {
				padding: 4rpx 12rpx;
				border-radius: 6rpx;
				font-size: 22rpx;
				
				&.tag-online {
					background-color: rgba(41, 121, 255, 0.1);
					color: #2979ff;
				}
				
				&.tag-offline {
					background-color: rgba(255, 87, 34, 0.1);
					color: #ff5722;
				}
			}
		}
		
		.card-info {
			display: flex;
			justify-content: space-between;
			
			.info-text {
				font-size: 24rpx;
				color: #666;
				
				&:first-child {
					color: #2979ff;
				}
			}
		}
	}
	
	&:active {
		transform: scale(0.98);
		transition: transform 0.2s;
	}
}
</style>
