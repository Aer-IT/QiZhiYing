<template>
	<view class="container">
		<!-- 评论统计 -->
		<view class="comment-stats">
			<view class="stats-header">
				<text class="title">用户评价</text>
				<text class="count">({{total}}条)</text>
			</view>
			<view class="rating-overview">
				<view class="overall-rating">
					<text class="rating-num">{{averageRating}}</text>
					<u-rate 
						v-model="averageRating" 
						:readonly="true"
						:count="5"
						:allowHalf="true"
						activeColor="#ff9900"
						size="34"
					></u-rate>
				</view>
				<view class="rating-progress">
					<view class="progress-item" v-for="(item, index) in ratingStats" :key="index">
						<text class="star-level">{{item.star}}星</text>
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
				courseId: '',
				page: 1,
				pageSize: 10,
				loadStatus: 'loadmore', // loadmore, loading, nomore
				reviewList: [],
				averageRating: 0,
				ratingStats: [],
				total: 0
			}
		},
		
		onLoad(options) {
			this.courseId = options.id;
			this.getComments();
		},
		
		methods: {
			// 获取评论列表
			async getComments() {
				if (this.loadStatus === 'loading') return;
				
				try {
					this.loadStatus = 'loading';
					const { result } = await uniCloud.callFunction({
						name: 'getAllComments',
						data: {
							courseId: this.courseId,
							page: this.page,
							pageSize: this.pageSize,
							type: 'all' // 获取全部评论
						}
					});
					
					if (result.code === 0) {
						const { list, total, averageRating, ratingStats } = result.data;
						
						// 处理评论数据
						const newList = list.map(item => ({
							username: item.userName,
							avatar: item.avatar,
							rating: Number(item.rating),
							content: item.content,
							time: this.formatDate(item.time),
							images: (item.imgList || []).map(img => ({
								src: img
							}))
						}));
						
						// 首次加载或刷新
						if (this.page === 1) {
							this.reviewList = newList;
							this.averageRating = Number(averageRating);
							this.ratingStats = ratingStats;
							this.total = total;
						} else {
							// 加载更多
							this.reviewList = [...this.reviewList, ...newList];
						}
						
						// 更新加载状态
						if (this.reviewList.length >= total) {
							this.loadStatus = 'nomore';
						} else {
							this.loadStatus = 'loadmore';
						}
					} else {
						uni.showToast({
							title: result.message,
							icon: 'none'
						});
					}
				} catch (e) {
					console.error('获取评论失败:', e);
					uni.showToast({
						title: '获取评论失败',
						icon: 'none'
					});
					this.loadStatus = 'loadmore';
				}
			},
			
			// 格式化日期
			formatDate(dateStr) {
				const date = new Date(dateStr);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			
			// 加载更多
			loadMore() {
				if (this.loadStatus !== 'loadmore') return;
				this.page++;
				this.getComments();
			},
			
			// 预览图片
			previewImage(images, current) {
				const urls = images.map(img => img.src);
				uni.previewImage({
					urls: urls,
					current: urls[current]
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
		}
	}
}
</style>
