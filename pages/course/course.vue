<template>
	<view class="container" v-if="hasCourse">
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

		<!-- 轮播图 - 所有课程都显示图片轮播 -->
		<view class="carousel-container" v-if="courseInfo.image ">
			<swiper
				class="swiper"
				:autoplay="true"
				:interval="3000"
				:circular="true"
				@change="onChange"
				:style="{ height: 300 + 'rpx' }"
			>
				<swiper-item v-for="(item, index) in carouselImages" :key="index">
					<image 
						:src="item.image" 
						mode="aspectFill"
						class="swiper-image"
					/>
				</swiper-item>
			</swiper>
			
			<!-- 将指示器移到swiper外部 -->
			<view class="indicator-wrapper">
				<view 
					class="indicator-dot" 
					v-for="(item, index) in carouselImages" 
					:key="index"
					:class="{ active: current === index }"
				></view>
			</view>
		</view>

		<!-- 课程内容区域 -->
		<view class="content-section">
			<!-- 课程简介 -->
			<view class="course-intro">
				<view class="section-title">
					<view class="title-bar"></view>
					<text class="title-text">课程简介</text>
				</view>
				<view class="intro-content">
					<!-- 简介 -->
					<text class="content-text">{{courseInfo.introduction.brief}}</text>
					
					<!-- 课程亮点 -->
					<view class="highlight-section">
						<view class="highlight-title">
							<u-icon name="star-fill" size="24" color="#FFB800"></u-icon>
							<text>课程亮点</text>
						</view>
						<view class="highlight-list">
							<view 
								class="highlight-item" 
								v-for="(item, index) in courseInfo.introduction.highlight" 
								:key="index"
							>
								<text class="highlight-num">{{index + 1}}</text>
								<text class="highlight-text">{{item}}</text>
							</view>
						</view>
					</view>
					
					<!-- 课程总结 -->
					<view class="summary-section">
						<view class="summary-title">
							<u-icon name="checkmark-circle-fill" size="24" color="#2979ff"></u-icon>
							<text>课程总结</text>
						</view>
						<text class="summary-text">{{courseInfo.introduction.summary}}</text>
					</view>
				</view>
			</view>
			
			<!-- 教师介绍 -->
			<view class="teacher-intro" v-for="(item,index) in (courseInfo.teacherInfo || [])" :key="index">
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
				<view class="section-header">
					<view class="section-title">
						<view class="title-bar"></view>
						<text class="title-text">用户评价</text>
					</view>
					<view class="view-all" @click="toAllComments">
						<text>查看全部</text>
						<u-icon name="arrow-right" size="24" color="#666"></u-icon>
					</view>
				</view>
				
				<view class="review-list">
					<view class="review-item" v-for="(item, index) in reviewList" :key="index">
						<view class="reviewer-info">
							<image :src="item.avatar" class="reviewer-avatar"></image>
							<view class="reviewer-detail">
								<view class="reviewer-name">{{item.name}}</view>
								<view class="review-badge">
									<u-icon name="star-fill" size="24" color="#FFB800"></u-icon>
									<text>金牌会员</text>
								</view>
							</view>
						</view>
						<view class="review-content">{{item.content}}</view>
						<view class="review-images" v-if="item.images && item.images.length">
							<image 
								v-for="(img, imgIndex) in item.images" 
								:key="imgIndex" 
								:src="img" 
								mode="aspectFill"
								class="review-image"
								@click="previewImage(item.images, imgIndex)"
							></image>
						</view>
					</view>
				</view>
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
export default {
	
	components: {
		Broadcast
	},
	data() {
		return {
			courseId: '',
			courseInfo: {}, // 课程信息
			vrLink: 'https://www.bilibili.com/', // 虚拟探索网页链接
			current: 0, // 当前轮播图索引
			hasCourse: false,
			reviewList: [], // 清空静态数据
			averageRating: 0,
			totalReviews: 0
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
		// 兼容不同参数名
		this.courseId = e._id || e.id || e.courseId || '';
		console.log('获取课程ID:', this.courseId);
		if (this.courseId) {
			this.getCourseDetail();
		} else {
			uni.showToast({
				title: '课程ID无效',
				icon: 'none'
			});
		}
	},
	
	methods: {
		// 获取评论列表
		async getReviews() {
			try {
				const { result } = await uniCloud.callFunction({
					name: 'getComments',
					data: {
						courseId: this.courseId,
						page: 1,
						pageSize: 3 // 只获取3条评论
					}
				});
				
				if (result.code === 0) {
					this.reviewList = result.data.list.map(item => ({
						avatar: item.avatar,
						name: item.userName,
						content: item.content,
						images: item.imgList || [],
						rating: item.rating
					}));
					this.averageRating = result.data.averageRating;
					this.totalReviews = result.data.total;
				}
			} catch (e) {
				console.error('获取评论失败:', e);
			}
		},
		
		async getCourseDetail() {
			try {
				const { result } = await uniCloud.callFunction({
					name: 'getCourse',
					data: {
						_id: this.courseId
					}
				});
				if (result && result.data && result.data.length > 0) {
					this.courseInfo = result.data[0];
					console.log('result:', result);
					this.hasCourse = true;
					// 获取评论数据
					await this.getReviews();
				} else {
					uni.showToast({
						title: '暂无课程信息',
						icon: 'none',
						duration: 2000,
						mask: true,
						complete: () => {
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								});
							}, 1500);
						}
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
		onChange(e) {
				this.current = e.detail.current
				// 触发切换事件，传递索引给父组件
			},
		// 跳转到虚拟探索网页
		toVRExplore() {
			if(this.vrLink) {
				// 使用web-view跳转到网页
				uni.navigateTo({
					url: `/pages/course/webview?url=${encodeURIComponent(this.vrLink)}`
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
				url: `/pages/course/calendar?id=${this.courseId}`
			})
		},
		// 添加分享方法
		onShareAppMessage() {
			return {
				title: this.courseInfo.title || this.courseInfo.introduction || '课程分享',
				path: `/pages/course/course?id=${this.courseId}`,
				imageUrl: this.courseInfo.displayImg || this.courseInfo.videoPoster || (this.courseInfo.image && this.courseInfo.image.length > 0 ? this.courseInfo.image[0] : '')
			}
		},
		// 跳转到全部评论页面
		toAllComments() {
			uni.navigateTo({
				url: `/pages/home/comments?id=${this.courseId}`
			})
		},
		// 预览图片
		previewImage(images, current) {
			uni.previewImage({
				urls: images,
				current: images[current]
			})
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

.carousel-container {
	width: 100%;
	position: relative;
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
	margin: 20rpx;
	
	.swiper {
		width: 100%;
		border-radius: 12rpx;
	}
	
	.swiper-image {
		width: 100%;
		height: 100%;
		border-radius: 12rpx;
	}
	
	.indicator-wrapper {
		position: absolute;
		bottom: 20rpx;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1;
		
		.indicator-dot {
			width: 12rpx;
			height: 12rpx;
			border-radius: 50%;
			background-color: rgba(255, 255, 255, 0.5);
			margin: 0 8rpx;
			transition: all 0.3s;
			
			&.active {
				width: 24rpx;
				border-radius: 6rpx;
				background-color: #ffffff;
			}
		}
	}
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
				color: #333;
				line-height: 1.8;
				margin-bottom: 30rpx;
			}
			
			.highlight-section {
				background: linear-gradient(135deg, #fff9e6 0%, #fff 100%);
				padding: 24rpx;
				border-radius: 12rpx;
				margin-bottom: 30rpx;
				
				.highlight-title {
					display: flex;
					align-items: center;
					margin-bottom: 20rpx;
					
					text {
						font-size: 30rpx;
						font-weight: 600;
						color: #333;
						margin-left: 12rpx;
					}
				}
				
				.highlight-list {
					.highlight-item {
						display: flex;
						align-items: flex-start;
						margin-bottom: 16rpx;
						
						&:last-child {
							margin-bottom: 0;
						}
						
						.highlight-num {
							width: 36rpx;
							height: 36rpx;
							background-color: #FFB800;
							color: #fff;
							font-size: 24rpx;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							margin-right: 16rpx;
							flex-shrink: 0;
							margin-top: 4rpx;
						}
						
						.highlight-text {
							flex: 1;
							font-size: 28rpx;
							color: #666;
							line-height: 1.6;
						}
					}
				}
			}
			
			.summary-section {
				background: linear-gradient(135deg, #f0f5ff 0%, #fff 100%);
				padding: 24rpx;
				border-radius: 12rpx;
				
				.summary-title {
					display: flex;
					align-items: center;
					margin-bottom: 20rpx;
					
					text {
						font-size: 30rpx;
						font-weight: 600;
						color: #333;
						margin-left: 12rpx;
					}
				}
				
				.summary-text {
					font-size: 28rpx;
					color: #666;
					line-height: 1.6;
				}
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
		
		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 30rpx 20rpx;
			
			.view-all {
				display: flex;
				align-items: center;
				color: #666;
				font-size: 26rpx;
				
				text {
					margin-right: 4rpx;
				}
			}
		}
		
		.review-list {
			padding: 0 30rpx;
			
			.review-item {
				padding: 24rpx 0;
				border-bottom: 2rpx solid #f5f5f5;
				
				&:last-child {
					border-bottom: none;
				}
				
				.reviewer-info {
					display: flex;
					align-items: center;
					margin-bottom: 16rpx;
					
					.reviewer-avatar {
						width: 64rpx;
						height: 64rpx;
						border-radius: 50%;
						margin-right: 16rpx;
					}
					
					.reviewer-detail {
						flex: 1;
						
						.reviewer-name {
							font-size: 28rpx;
							color: #333;
							margin-bottom: 8rpx;
						}
						
						.review-badge {
							display: flex;
							align-items: center;
							font-size: 24rpx;
							color: #FFB800;
							
							text {
								margin-left: 8rpx;
							}
						}
					}
				}
				
				.review-content {
					font-size: 28rpx;
					color: #333;
					line-height: 1.6;
					margin-bottom: 16rpx;
				}
				
				.review-images {
					display: flex;
					flex-wrap: wrap;
					margin: 0 -8rpx;
					
					.review-image {
						width: 180rpx;
						height: 180rpx;
						margin: 8rpx;
						border-radius: 8rpx;
					}
				}
			}
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
