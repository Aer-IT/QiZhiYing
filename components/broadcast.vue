<template>
	<!-- 用户评价滚动广播 -->
	<view class="notice-wrapper" @click="toComments()">
		<view class="notice-header">
			<u-icon name="volume" size="18" color="#2979ff"></u-icon>
			<text class="notice-title">最新评价</text>
		</view>
		<swiper
			class="notice-swiper"
			vertical
			:autoplay="true"
			:interval="3000"
			:duration="1000"
			:circular="true"
		>
			<swiper-item v-for="(item, index) in noticeList" :key="index">
				<view class="notice-item">
					<text class="user-name">{{item.userName}}：</text>
					<text class="comment-content">{{item.content}}</text>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name: 'broadcast',
		data() {
			return {
				noticeList: []
			}
		},
		created() {
			this.getLatestComments();
		},
		methods: {
			// 获取最新评论列表
			async getLatestComments() {
				try {
					const { result } = await uniCloud.callFunction({
						name: 'getAllComments',
						data: {
							type: 'latest' // 获取最新评论
						}
					});
					
					if (result.code === 0 && result.data.list.length > 0) {
						this.noticeList = result.data.list.map(item => ({
							userName: item.userName,
							content: item.content
						}));
					}
				} catch (e) {
					console.error('获取评论失败:', e);
				}
			},
			
			// 跳转到评论页面
			toComments() {
				uni.navigateTo({
					url: '/pages/home/comments'
				})
			}
		}
	}
</script>

<style lang="scss" scoped> 
	.notice-wrapper {
		margin: 20rpx 0;
		background-color: #ffffff;
		border-radius: 8rpx;
		padding: 16rpx 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		
		.notice-header {
			display: flex;
			align-items: center;
			margin-bottom: 10rpx;
			
			.notice-title {
				margin-left: 10rpx;
				font-size: 28rpx;
				color: #2979ff;
				font-weight: bold;
			}
		}
		
		.notice-swiper {
			height: 40rpx;
			
			.notice-item {
				font-size: 26rpx;
				color: #666;
				line-height: 40rpx;
				text-align: left;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				
				.user-name {
					color: #2979ff;
					margin-right: 10rpx;
				}
				
				.comment-content {
					color: #666;
				}
			}
		}
	}
</style>