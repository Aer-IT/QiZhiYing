<template>
	<view class="interactions">
		<!-- 自然笔记栏目 -->
		<view class="section nature-notes">
			<view class="section-header">
				<text class="title">自然笔记</text>
				<text class="subtitle">记录你与自然的美好时刻</text>
			</view>
			<view class="section-content" @tap="navigateTo('/pages/InteractionDetails/InteractionDetails?type=1')">
				<u-icon name="edit-pen" size="80" color="#19be6b"></u-icon>
				<view class="content-text">
					<text class="main-text">今天的发现</text>
					<text class="sub-text">分享你的自然观察</text>
				</view>
			</view>
		</view>
		
		<!-- 亲子时光栏目 -->
		<view class="section family-time">
			<view class="section-header">
				<text class="title">亲子时光</text>
				<text class="subtitle">珍贵的家庭互动记录</text>
			</view>
			<view class="section-content" @tap="navigateTo('/pages/InteractionDetails/InteractionDetails?type=2')">
				<u-icon name="heart" size="80" color="#ff9900"></u-icon>
				<view class="content-text">
					<text class="main-text">记录精彩瞬间</text>
					<text class="sub-text">留住温馨回忆</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url
				});
			}
		}
	}
</script>

<style lang="scss">
.interactions {
	min-height: 100vh;
	padding: 30rpx;
	background: #f8f8f8;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 40rpx;
	
	.section {
		background: #ffffff;
		border-radius: 24rpx;
		padding: 40rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
		
		.section-header {
			margin-bottom: 30rpx;
			
			.title {
				font-size: 36rpx;
				font-weight: bold;
				color: #333333;
				display: block;
			}
			
			.subtitle {
				font-size: 24rpx;
				color: #999999;
				margin-top: 8rpx;
				display: block;
			}
		}
		
		.section-content {
			display: flex;
			align-items: center;
			padding: 30rpx;
			background: #f8f8f8;
			border-radius: 16rpx;
			transition: all 0.3s ease;
			
			&:active {
				transform: scale(0.98);
				opacity: 0.8;
			}
			
			.content-text {
				margin-left: 30rpx;
				
				.main-text {
					font-size: 32rpx;
					color: #333333;
					display: block;
				}
				
				.sub-text {
					font-size: 24rpx;
					color: #666666;
					margin-top: 8rpx;
					display: block;
				}
			}
		}
	}
	
	.nature-notes {
		.section-content {
			background: rgba(25, 190, 107, 0.1);
		}
	}
	
	.family-time {
		.section-content {
			background: rgba(255, 153, 0, 0.1);
		}
	}
}
</style>
