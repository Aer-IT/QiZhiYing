<template>
	<view class="container">
		<!-- 视频播放区域 -->
		<view class="video-section">
			<video 
				:src="courseInfo.video"
				:poster="courseInfo.videoPoster"
				class="video-player"
				controls
				:show-play-btn="true"
				:enable-play-gesture="true"
				:show-progress="true"
				:show-fullscreen-btn="true"
			></video>
		</view>
		
		<!-- 虚拟探索链接 -->
		<view class="vr-section" @click="toVRExplore" v-if="courseInfo.online">
			<view class="vr-content">
				<u-icon name="globe" color="#2979ff" size="24"></u-icon>
				<text class="vr-text">虚拟探索</text>
			</view>
			<u-icon name="arrow-right" color="#2979ff" size="16"></u-icon>
		</view>

		<!-- 轮播图 -->
		<carousel 
			:height="300" 
			:img="carouselImages"
			v-if="!courseInfo.online"
		></carousel>

		<!-- 课程内容区域 -->
		<view class="content-section">
			<!-- 课程简介 -->
			<view class="course-intro">
				<view class="section-title">
					<view class="title-bar"></view>
					<text class="title-text">课程简介</text>
				</view>
				<view class="intro-content">
					<text class="content-text">{{courseInfo.introduction || '暂无简介'}}</text>
				</view>
			</view>
			
			<!-- 教师介绍 -->
			<view class="teacher-intro" v-for="(item,index) in courseInfo.teacherInfo" :key="index">
				<view class="section-title">
					<view class="title-bar"></view>
					<text class="title-text">教师介绍</text>
				</view>
				<view class="teacher-content">
					<view class="teacher-info">
						<text class="teacher-name">{{item.teacherName}}</text>
						<text class="teacher-title">{{item.teacherTitle}}</text>
						<text class="teacher-desc">{{item.teacherIntro}}</text>
					</view>
					<image 
						class="teacher-avatar" 
						:src="item.teacherAvatar" 
						mode="aspectFill"
					></image>
				</view>
			</view>
			
			<!-- 用户评价 -->
			<view class="review-section">
				<view class="section-title">
					<view class="title-bar"></view>
					<text class="title-text">用户评价</text>
				</view>
				<broadcast></broadcast>
			</view>
		</view>

		<!-- 底部固定按钮 -->
		<view class="fixed-bottom">
			<button class="share-btn" open-type="share">
				<u-icon name="share" size="20" color="#2979ff"></u-icon>
				<text>分享</text>
			</button>
			
			<button class="signup-btn" @click="toSignup">
				<u-icon name="calendar" size="20" color="#fff"></u-icon>
				<text>立即报名</text>
			</button>
		</view>
	</view>
</template>

<script>
import Broadcast from '@/components/broadcast.vue'
import Carousel from '@/components/carousel.vue'
export default {
	
	components: {
		Broadcast,
		Carousel
	},
	data() {
		return {
			courseId: '',
			courseInfo: {}, // 课程信息
			vrLink: 'https://www.bilibili.com/' // 虚拟探索网页链接
		}
	},
	
	computed: {
		// 处理轮播图数据
		carouselImages() {
			if (!this.courseInfo.image) return [];
			return this.courseInfo.image.map(img => ({
				image: img
			}));
		}
	},
	
	onLoad(e) {
		this.courseId = e._id;
		console.log('获取课程ID:', this.courseId);
		this.getCourseDetail();
	},
	
	methods: {
		async getCourseDetail() {
			try {
				const { result } = await uniCloud.callFunction({
					name: 'getCourse',
					data: {
						_id: this.courseId
					}
				});
				if (result && result.data && result.data.length > 0) {
					this.courseInfo = result.data[0]; // 获取数组中的第一个元素
					console.log('result:',result)
				} else {
					uni.showToast({
						title: '未找到课程信息',
						icon: 'none'
					});
				}
			} catch (e) {
				console.error('获取课程详情失败:', e);
				uni.showToast({
					title: '获取课程信息失败',
					icon: 'none'
				});
			}
		},
		// 跳转到虚拟探索网页
		toVRExplore() {
			if(this.vrLink) {
				// 使用web-view跳转到网页
				uni.navigateTo({
					url: `/pages/webview/webview?url=${encodeURIComponent(this.vrLink)}`
				})
			} else {
				uni.showToast({
					title: '暂无虚拟探索链接',
					icon: 'none'
				})
			}
		},
		// 跳转到报名页面
		toSignup() {
			uni.navigateTo({
				url: `/pages/calendar/calendar?id=${this.courseId}`
			})
		},
		// 添加分享方法
		onShareAppMessage() {
			return {
				title: this.courseInfo.introduction,
				path: `/pages/course/course?id=${this.courseId}`,
				imageUrl: this.courseInfo.displayImg
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	padding: 0;
	background-color: #f8f9fa;
	padding-bottom: 120rpx;
	min-height: 100vh;
}

.video-section {
	margin-bottom: 20rpx;
	position: relative;
	background-color: #000;
	
	.video-player {
		width: 100%;
		height: 420rpx;
	}
	
	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 60rpx;
		background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
		pointer-events: none;
	}
}

.vr-section {
	background: linear-gradient(135deg, #e8f0ff 0%, #ffffff 100%);
	margin: 20rpx;
	padding: 30rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 4rpx 16rpx rgba(41, 121, 255, 0.1);
	transition: all 0.3s ease;
	
	.vr-content {
		display: flex;
		align-items: center;
		
		.vr-text {
			font-size: 30rpx;
			color: #2979ff;
			margin-left: 16rpx;
			font-weight: 600;
		}
	}
	
	&:active {
		transform: scale(0.98);
		box-shadow: 0 2rpx 8rpx rgba(41, 121, 255, 0.1);
	}
}

.content-section {
	margin: 20rpx;
	border-radius: 16rpx;
	background-color: #fff;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
	overflow: hidden;
	
	.section-title {
		display: flex;
		align-items: center;
		margin: 30rpx;
		position: relative;
		
		.title-bar {
			width: 6rpx;
			height: 32rpx;
			background: linear-gradient(to bottom, #2979ff, #5094ff);
			border-radius: 6rpx;
			margin-right: 16rpx;
		}
		
		.title-text {
			font-size: 34rpx;
			font-weight: 600;
			color: #333;
			position: relative;
		}
	}
	
	.course-intro {
		margin-bottom: 40rpx;
		
		.intro-content {
			margin: 0 30rpx;
			
			.content-text {
				font-size: 28rpx;
				color: #666;
				line-height: 1.8;
			}
		}
	}
	
	.teacher-intro {
		margin-bottom: 40rpx;
		
		.teacher-content {
			margin: 0 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
			padding: 24rpx;
			border-radius: 12rpx;
			
			.teacher-info {
				flex: 1;
				margin-right: 30rpx;
				
				.teacher-name {
					font-size: 32rpx;
					font-weight: 600;
					color: #333;
					margin-bottom: 12rpx;
					display: block;
				}
				
				.teacher-title {
					font-size: 26rpx;
					color: #2979ff;
					margin-bottom: 20rpx;
					display: block;
					background-color: rgba(41, 121, 255, 0.1);
					padding: 4rpx 16rpx;
					border-radius: 20rpx;
					width: fit-content;
				}
				
				.teacher-desc {
					font-size: 26rpx;
					color: #666;
					line-height: 1.8;
				}
			}
			
			.teacher-avatar {
				width: 160rpx;
				height: 160rpx;
				border-radius: 16rpx;
				box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
			}
		}
	}
	
	.review-section {
		margin-bottom: 20rpx;
		
		.broadcast {
			margin: 16rpx 30rpx;
		}
	}
}

.fixed-bottom {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.98);
	backdrop-filter: blur(10px);
	display: flex;
	align-items: center;
	padding: 16rpx 30rpx;
	box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
	z-index: 99;
	
	button {
		height: 80rpx;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		padding: 0 40rpx;
		transition: all 0.3s ease;
		
		text {
			margin-left: 8rpx;
		}
		
		&:active {
			transform: scale(0.98);
		}
	}
	
	.share-btn {
		background: linear-gradient(135deg, #f0f5ff 0%, #e8f0ff 100%);
		color: #2979ff;
		margin-right: 20rpx;
		flex: 1;
		border: 2rpx solid rgba(41, 121, 255, 0.1);
		
		&::after {
			border: none;
		}
	}
	
	.signup-btn {
		background: linear-gradient(135deg, #2979ff 0%, #5094ff 100%);
		color: #fff;
		flex: 2;
		box-shadow: 0 4rpx 16rpx rgba(41, 121, 255, 0.2);
		
		&::after {
			border: none;
		}
	}
}
</style>
