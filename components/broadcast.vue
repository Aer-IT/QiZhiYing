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
				<view class="notice-item">{{item}}</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		name: 'broadcast',
		data() {
			return {
				noticeList: [
					'暂无评价'
				]
			}
		},
		methods: {
			toComments() {
				uni.navigateTo({
					url: '/pages/home/comments?type=1'
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
				text-align: center;
			}
		}
	}
</style>