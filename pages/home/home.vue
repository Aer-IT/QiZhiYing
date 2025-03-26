<template>
	<view class="container">
		<!-- 课程轮播图 -->
		<view class="carousel-wrapper">
			<carousel 
				:height="400"
				imgMode="aspectFill"
				@click="onCarouselClick"
				@change="onCarouselChange"
				:img="imgList"
			></carousel>
		</view>
		
		<!-- 广播栏 -->
		<view class="broadcast-wrapper">
			<BroadCast></BroadCast>
		</view>
		
		<!-- 主题活动区域 -->
		<view class="theme-section">
			<view class="section-header">
				<view class="title-group">
					<text class="title-text">主题活动</text>
					<text class="subtitle-text">精选特色主题活动</text>
				</view>
			</view>
			
			<view class="theme-grid">
				<view 
					class="theme-card" 
					v-for="(item, index) in themeList" 
					:key="index"
					@click="toSecondArea(item)"
				>
					<image class="card-image" :src="item.image" mode="aspectFill"></image>
					<view class="card-overlay"></view>
					<view class="card-content">
						<view class="content-wrapper">
							<text class="card-title">{{item.title}}</text>
							<text class="card-desc">{{item.description}}</text>
						</view>
						<view class="card-tag" :style="{ backgroundColor: item.tagColor }">
							{{item.tag}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background-color: #f8f9fa;
	padding-bottom: 30rpx;
}

.carousel-wrapper {
	padding: 0;
	position: relative;
	
	:deep(.carousel-container) {
		border-radius: 0;
		overflow: hidden;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
	}
}

.broadcast-wrapper {
	margin: 30rpx 30rpx;
	border-radius: 16rpx;
	overflow: hidden;
	background: #fff;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
	transform: translateY(0);
	transition: all 0.3s ease;
	
	&:active {
		transform: translateY(2rpx);
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
	}
}

.theme-section {
	margin: 40rpx 30rpx;
	
	.section-header {
		margin-bottom: 30rpx;
		
		.title-group {
			display: flex;
			align-items: baseline;
			
			.title-text {
				font-size: 40rpx;
				font-weight: 600;
				color: #333;
				margin-right: 16rpx;
				letter-spacing: 1px;
			}
			
			.subtitle-text {
				font-size: 26rpx;
				color: #666;
				letter-spacing: 0.5px;
			}
		}
	}
	
	.theme-grid {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
		
		.theme-card {
			position: relative;
			border-radius: 20rpx;
			overflow: hidden;
			box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			
			&:active {
				transform: scale(0.98) translateY(2rpx);
				box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
			}
			
			.card-image {
				width: 100%;
				height: 320rpx;
				transform: scale(1.01);
				transition: all 0.3s ease;
			}
			
			.card-overlay {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				height: 180rpx;
				background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent);
			}
			
			.card-content {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				padding: 30rpx;
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				
				.content-wrapper {
					flex: 1;
					margin-right: 24rpx;
					
					.card-title {
						font-size: 36rpx;
						font-weight: 600;
						color: #fff;
						margin-bottom: 12rpx;
						display: block;
						text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
						letter-spacing: 1px;
					}
					
					.card-desc {
						font-size: 26rpx;
						color: rgba(255,255,255,0.95);
						line-height: 1.5;
						display: block;
						text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
						letter-spacing: 0.5px;
					}
				}
				
				.card-tag {
					padding: 8rpx 24rpx;
					border-radius: 32rpx;
					font-size: 26rpx;
					color: #fff;
					box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.25);
					letter-spacing: 1px;
					backdrop-filter: blur(4px);
				}
			}
		}
	}
}
</style>

<script>
import Carousel from '@/components/carousel.vue'
import BroadCast from '@/components/broadcast.vue'

export default {
	components: {
		Carousel,
		BroadCast
	},
	data() {
		return {
			themeList: [
				{
					title: '绿色星球',
					description: '探索自然奥秘，守护生态环境',
					image: '/static/logo.png',
					tag: '生态环保',
					tagColor: 'rgba(103, 194, 58, 0.95)',
					type: 1
				},
				{
					title: '非遗传承',
					description: '感受传统文化魅力，传承匠人精神',
					image: '/static/logo.png',
					tag: '非遗体验',
					tagColor: 'rgba(230, 162, 60, 0.95)',
					type: 2
				},
				{
					title: '探索发现',
					description: '走进自然，探索科学奥秘',
					image: '/static/logo.png',
					tag: '野外考察',
					tagColor: 'rgba(64, 158, 255, 0.95)',
					type: 3
				}
			],
			imgList:[]
		}
	},
	methods: {
		// 轮播图点击事件
		onCarouselClick(item) {
			console.log('点击轮播图：', item._id);
			// 跳转到课程详情页
			uni.navigateTo({
				url: `/pages/course/course?id=${item._id}`
			});
		},
		// 轮播图切换事件
		onCarouselChange(index) {
			// 可以在这里添加切换动画或其他效果
		},
		// 跳转到二级页面
		toSecondArea(item) {
			uni.navigateTo({
				url: `/pages/home/secondArea?type=${item.type}`
			});
		}
	},
	async onLoad() {
		try {
			const { result } = await uniCloud.callFunction({
				name: 'getCarousel',
				data: {
					type: 'home'
				}
			});
			// 将displayImg映射为image
			this.imgList = result.data.map(item => ({
				image: item.displayImg,
				_id: item._id
			}));
		} catch (e) {
			console.error('获取轮播图失败:', e);
			uni.showToast({
				title: '获取数据失败',
				icon: 'none'
			});
		}
	}
}
</script>
