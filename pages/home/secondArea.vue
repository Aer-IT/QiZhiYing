<template>
	<view class="container">
		<!-- 页面标题 -->
		<view class="header">
			<text class="title">{{pageTitle}}</text>
			<text class="subtitle">为孩子选择合适的课程和活动</text>
		</view>
		
		<!-- 专区入口网格 -->
		<view class="area-grid">
			<view 
				class="area-card" 
				v-for="(item, index) in areaList" 
				:key="index"
				@click="toThirdArea(item)"
			>
				<image class="card-bg" :src="item.image" mode="aspectFill"></image>
				<view class="card-content">
					<view class="card-icon">
						<uni-icons :type="item.icon" size="30" color="#2979ff"></uni-icons>
					</view>
					<text class="card-title">{{item.title}}</text>
					<text class="card-desc">{{item.description}}</text>
				</view>
				<view class="card-tag" :style="{ backgroundColor: item.tagColor }">
					{{item.tag}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type: '',
			pageTitle: '',
			areaList: [
				{
					title: '3~8岁儿童专区',
					description: '激发天性，培养兴趣',
					image: '/static/logo.png',
					icon: 'star',
					tag: '幼儿成长',
					tagColor: '#67C23A',
					sectype: 1
				},
				{
					title: '8~12岁儿童专区',
					description: '探索世界，培养能力',
					image: '/static/logo.png',
					icon: 'medal',
					tag: '少儿成长',
					tagColor: '#E6A23C',
					sectype: 2
				},
				{
					title: '线上课程专区',
					description: '随时随地，快乐学习',
					image: '/static/logo.png',
					icon: 'chatbubble',
					tag: '在线学习',
					tagColor: '#409EFF',
					sectype: 3
				},
				{
					title: '线下活动专区',
					description: '实地体验，快乐成长',
					image: '/static/logo.png',
					icon: 'location',
					tag: '实地活动',
					tagColor: '#F56C6C',
					sectype: 4
				}
			]
		}
	},
	onLoad(options) {
		this.type = options.type
		
		// 根据类型设置页面标题
		switch(this.type) {
			case 'eco':
				this.pageTitle = '生态环保'
				break
			case 'culture':
				this.pageTitle = '非遗体验'
				break
			case 'explore':
				this.pageTitle = '野外考察'
				break
			default:
				this.pageTitle = '主题活动'
		}
		
	},
	methods: {
		toThirdArea(item) {
			uni.navigateTo({
				url: `/pages/home/thirdArea?type=${this.type}&sectype=${item.sectype}`
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	padding: 20rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.header {
	padding: 20rpx 0;
	text-align: center;
	margin-bottom: 20rpx;
	
	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 8rpx;
		display: block;
	}
	
	.subtitle {
		font-size: 24rpx;
		color: #666;
	}
}

.area-grid {
	flex: 1;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(2, 1fr);
	gap: 20rpx;
	padding: 10rpx;
	height: calc(100vh - 200rpx);
	
	.area-card {
		position: relative;
		background: #fff;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		height: 100%;
		
		.card-bg {
			position: absolute;
			width: 100%;
			height: 100%;
			opacity: 0.1;
		}
		
		.card-content {
			position: relative;
			z-index: 1;
			padding: 20rpx;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			
			.card-icon {
				margin-bottom: 16rpx;
				
				:deep(.uni-icons) {
					font-size: 40rpx !important;
				}
			}
			
			.card-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 12rpx;
				text-align: center;
			}
			
			.card-desc {
				font-size: 24rpx;
				color: #666;
				text-align: center;
				line-height: 1.4;
				padding: 0 20rpx;
			}
		}
		
		.card-tag {
			position: absolute;
			top: 16rpx;
			right: 16rpx;
			padding: 6rpx 16rpx;
			border-radius: 16rpx;
			color: #fff;
			font-size: 24rpx;
		}
		
		&:active {
			transform: scale(0.98);
			transition: transform 0.2s;
		}
	}
}
</style>
