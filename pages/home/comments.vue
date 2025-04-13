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
					<text class="rating-num">0.0</text>
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
				// 评价列表
				reviewList: [
				]
			}
		},
		methods: {
			
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
				margin-bottom: 10rpx;
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
		}
	}
}
</style>
