<template>
	<view class="container">
		<!-- 评论统计 -->
		<view class="comment-stats">
			<view class="stats-header">
				<text class="title">用户评价</text>
				<text class="count">({{reviewList.length}}条)</text>
			</view>
			<view class="rating-overview">
				<view class="overall-rating">
					<text class="rating-num">4.8</text>
					<u-rate 
						v-model="averageRating" 
						:readonly="true"
						:count="5"
						activeColor="#ff9900"
						size="34"
					></u-rate>
				</view>
				<view class="rating-progress">
					<view class="progress-item" v-for="(item, index) in ratingStats" :key="index">
						<text class="star-level">{{5 - index}}星</text>
						<u-line-progress
							:percentage="item.percentage"
							height="16"
							activeColor="#ff9900"
						></u-line-progress>
						<text class="percentage">{{item.percentage}}%</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 评论筛选 -->
		<view class="filter-section">
			<scroll-view 
				scroll-x 
				class="tabs-scroll"
				:scroll-with-animation="true"
				:show-scrollbar="false"
			>
				<view class="title">
					<text 
						v-for="(tab, index) in filterTabs" 
						:key="index"
						:class="{ active: currentTab === index }"
						@tap="handleTabChange(index)"
					>{{tab.text}}</text>
				</view>
			</scroll-view>
		</view>

		<!-- 评论列表 -->
		<view class="new-review-list">
			<view class="review-card" v-for="(item, index) in reviewList" :key="index">
				<view class="review-user">
					<u-avatar
						:src="item.avatar"
						size="80"
					></u-avatar>
					<view class="user-detail">
						<text class="username">{{item.username}}</text>
						<u-rate 
							v-model="item.rating"
							:readonly="true"
							size="26"
							activeColor="#ff9900"
						></u-rate>
					</view>
					<text class="review-time">{{item.time}}</text>
				</view>
				<view class="review-detail">
					<text class="review-text">{{item.content}}</text>
					<!-- 评论图片展示 -->
					<view class="review-images" v-if="item.images && item.images.length">
						<view class="image-list">
							<image 
								v-for="(img, imgIndex) in item.images" 
								:key="imgIndex"
								:src="img.src"
								mode="aspectFill"
								@tap="previewImage(item.images, imgIndex)"
								class="review-image"
							></image>
						</view>
					</view>
					<!-- 商家回复 -->
					<view class="merchant-reply" v-if="item.reply">
						<u-icon name="chat" size="28" color="#666"></u-icon>
						<text class="reply-text">商家回复：{{item.reply}}</text>
					</view>
					<!-- 操作按钮 -->
					<view class="review-actions">
						<view class="action-item">
							<u-icon name="thumb-up" size="28" :color="item.isLiked ? '#ff9900' : '#999'"></u-icon>
							<text :class="['action-text', item.isLiked ? 'active' : '']">{{item.likes || 0}}</text>
						</view>
						<view class="action-item">
							<u-icon name="chat" size="28" color="#999"></u-icon>
							<text class="action-text">回复</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 加载更多 -->
		<u-loadmore
			:status="loadStatus"
			@loadmore="loadMore"
			marginTop="30"
			marginBottom="30"
			loadingText="努力加载中..."
			loadmoreText="点击或上拉加载更多"
			nomore-text="没有更多数据了"
		></u-loadmore>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 评价列表
				reviewList: [
					{
						avatar: '/static/logo.png',
						username: '张三',
						rating: 5,
						time: '2024-03-19',
						content: '课程内容很充实，老师讲解很详细，非常推荐！',
						images: [
							{ src: '/static/logo.png' },
							{ src: '/static/logo.png' }
						],
						reply: '感谢您的支持，我们会继续努力提供更好的课程！',
						likes: 12,
						isLiked: false
					},
					{
						avatar: '/static/logo.png',
						username: '李四',
						rating: 4,
						time: '2024-03-18',
						content: '整体不错，就是有些地方讲得有点快。',
						likes: 8,
						isLiked: true
					},
					{
						avatar: '/static/logo.png',
						username: '王五',
						rating: 5,
						time: '2024-03-17',
						content: '课程质量很高，学到了很多，希望能有更多类似的课程。',
						likes: 15,
						isLiked: false
					}
				],
				// 评分统计
				averageRating: 4.8,
				ratingStats: [
					{ percentage: 85 },
					{ percentage: 10 },
					{ percentage: 3 },
					{ percentage: 1 },
					{ percentage: 1 }
				],
				// 筛选标签
				filterTabs: [
					{ text: '全部' },
					{ text: '最新' },
					{ text: '好评' },
					{ text: '有图' },
					{ text: '已回复' }
				],
				currentTab: 0,
				// 加载状态
				loadStatus: 'loadmore', // loadmore, loading, nomore
				page: 1,
				limit: 10
			}
		},
		methods: {
			// 处理标签切换
			handleTabChange(index) {
				this.currentTab = index;
				this.loadComments(this.filterTabs[index].text);
			},
			
			// 加载更多
			loadMore() {
				if (this.loadStatus !== 'loadmore') return;
				this.loadStatus = 'loading';
				
				// 模拟加载数据
				setTimeout(() => {
					if (this.page >= 3) {
						this.loadStatus = 'nomore';
					} else {
						this.page++;
						this.loadStatus = 'loadmore';
					}
				}, 1000);
			},
			
			// 加载评价数据
			loadComments(type) {
				// 这里可以根据type调用不同的接口获取评价数据
				console.log('加载类型：', type);
				// 重置页码和加载状态
				this.page = 1;
				this.loadStatus = 'loadmore';
			},
			
			// 预览图片
			previewImage(images, current) {
				const urls = images.map(img => img.src);
				uni.previewImage({
					urls: urls,
					current: current
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
}

.comment-stats {
	background-color: #ffffff;
	padding: 30rpx;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
	
	.stats-header {
		margin-bottom: 20rpx;
		
		.title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
		
		.count {
			font-size: 28rpx;
			color: #999;
			margin-left: 10rpx;
		}
	}
	
	.rating-overview {
		display: flex;
		align-items: flex-start;
		
		.overall-rating {
			margin-right: 40rpx;
			text-align: center;
			
			.rating-num {
				font-size: 48rpx;
				font-weight: bold;
				color: #ff9900;
				line-height: 1.2;
				margin-bottom: 10rpx;
				display: block;
			}
		}
		
		.rating-progress {
			flex: 1;
			
			.progress-item {
				display: flex;
				align-items: center;
				margin-bottom: 10rpx;
				
				.star-level {
					width: 80rpx;
					font-size: 24rpx;
					color: #666;
				}
				
				.percentage {
					width: 60rpx;
					font-size: 24rpx;
					color: #999;
					margin-left: 10rpx;
				}
			}
		}
	}
}

.filter-section {
	background-color: #ffffff;
	margin-bottom: 20rpx;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
	padding: 20rpx 0;
	overflow: hidden;
	
	.tabs-scroll {
		width: 100%;
		white-space: nowrap;
		
		::-webkit-scrollbar {
			display: none;
			width: 0;
			height: 0;
			color: transparent;
		}
	}
	
	.title {
		display: inline-flex;
		justify-content: center;
		padding: 0 30rpx;
		gap: 60rpx;
		font-size: 32rpx;
		color: #333333;
		width: fit-content;
		margin: 0 auto;
		
		text {
			position: relative;
			padding: 8rpx 12rpx;
			font-weight: 500;
			transition: all 0.3s ease;
			white-space: nowrap;
			
			&:active {
				opacity: 0.8;
			}
			
			&::after {
				content: '';
				position: absolute;
				bottom: -4rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 0;
				height: 4rpx;
				background: #ff9900;
				border-radius: 4rpx;
				transition: all 0.3s ease;
			}
			
			&.active {
				color: #ff9900;
				font-weight: bold;
				transform: scale(1.05);
				
				&::after {
					width: 80%;
				}
			}
		}
	}
}

.new-review-list {
	.review-card {
		background-color: #ffffff;
		padding: 30rpx;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		
		.review-user {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			
			.user-detail {
				flex: 1;
				margin-left: 20rpx;
				
				.username {
					font-size: 28rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 6rpx;
					display: block;
				}
			}
			
			.review-time {
				font-size: 24rpx;
				color: #999;
			}
		}
		
		.review-detail {
			.review-text {
				font-size: 28rpx;
				color: #333;
				line-height: 1.6;
				margin-bottom: 20rpx;
			}
			
			.review-images {
				margin-bottom: 20rpx;
				
				.image-list {
					display: flex;
					flex-wrap: wrap;
					gap: 12rpx;
					
					.review-image {
						width: 200rpx;
						height: 200rpx;
						border-radius: 12rpx;
						background-color: #f5f5f5;
						object-fit: cover;
						box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
						transition: all 0.3s ease;
						
						&:active {
							transform: scale(0.98);
							opacity: 0.8;
						}
					}
				}
			}
			
			.merchant-reply {
				background-color: #f8f8f8;
				padding: 20rpx;
				border-radius: 8rpx;
				margin-bottom: 20rpx;
				display: flex;
				align-items: flex-start;
				
				.reply-text {
					flex: 1;
					font-size: 26rpx;
					color: #666;
					margin-left: 10rpx;
					line-height: 1.5;
				}
			}
			
			.review-actions {
				display: flex;
				align-items: center;
				border-top: 2rpx solid #f5f5f5;
				padding-top: 20rpx;
				
				.action-item {
					display: flex;
					align-items: center;
					margin-right: 40rpx;
					
					.action-text {
						font-size: 26rpx;
						color: #999;
						margin-left: 8rpx;
						
						&.active {
							color: #ff9900;
						}
					}
				}
			}
		}
	}
}
</style>
