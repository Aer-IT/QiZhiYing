<template>
	<view class="shop-detail">
		<!-- 商品轮播图 -->
		<swiper 
			:indicator-dots="indicatorDots"
			:autoplay="autoplay"
			:interval="interval"
			:duration="duration"
			:circular="circular"
			class="banner"
			indicator-active-color="#3c8cff"
			indicator-color="rgba(255,255,255,0.6)"
		>
			<swiper-item v-for="(item, index) in goods_img" :key="index">
				<image 
					:src="item.img"
					class="slide-image"
					mode="aspectFill"
					:data-src="item.img"
					@tap="previewImage"
				/>
			</swiper-item>
		</swiper>
		
		<!-- 商品基本信息 -->
		<view class="info-section">
			<view class="info-wrap">
				<view class="goods-title">
					{{goods_info.goods_title}}
				</view>
				<view class="price-box">
					<text class="currency">积分</text>
					<text class="price">{{goods_info.goods_points}}</text>
				</view>
				<view class="goods-statistics">
					<view class="statistics-item">
						<text class="label">配送</text>
						<text class="content" v-if="goods_info.goods_yunfei == 0">免运费</text>
						<text class="content" v-else>￥{{goods_info.goods_yunfei}}</text>
					</view>
					<view class="statistics-item">
						<text class="label">库存</text>
						<text class="content">{{goods_info.goods_kucun}}件</text>
					</view>
					<view class="statistics-item">
						<text class="label">已兑</text>
						<text class="content">{{goods_info.goods_xiaoliang}}件</text>
					</view>
				</view>
			</view>
			
			<button class="share-btn" open-type="share">
				<u-icon name="share" size="40" color="#666"></u-icon>
				<text>分享</text>
			</button>
		</view>
		
		<!-- 评价区域 -->
		<view class='review-section' v-if="pjDataList && pjDataList.length">
			<view class="section-header">
				<view class="title">
					<u-icon name="chat" size="32" color="#3c8cff"></u-icon>
					<text>商品评价</text>
				</view>
				<navigator :url="`pjList?id=${goods_id}`" class="more">
					<text>查看全部</text>
					<u-icon name="arrow-right" size="24" color="#3c8cff"></u-icon>
				</navigator>
			</view>
			
			<view class="review-list">
				<view 
					class="review-item" 
					v-for="(item, index) in pjDataList" 
					:key="index"
					:class="{'last-item': index === pjDataList.length - 1}"
				>
					<view class="user-info">
						<image :src="item.headpic" mode="aspectFill" class="avatar"></image>
						<view class="user-meta">
							<text class="nickname">{{item.author}}</text>
							<view class="rating">
								<u-icon name="star-fill" size="24" color="#ffa200" v-for="n in 5" :key="n"></u-icon>
							</view>
						</view>
						<text class="time">{{item.add_time}}</text>
					</view>
					<view class="review-content">{{item.content}}</view>
				</view>
			</view>
		</view>
		
		<!-- 商品详情 -->
		<view class='detail-section'>
			<view class="section-header">
				<view class="title">
					<u-icon name="file-text" size="32" color="#3c8cff"></u-icon>
					<text>商品详情</text>
				</view>
			</view>
			<view class="detail-content">
				<rich-text :nodes="goods_info.content"></rich-text>
			</view>
		</view>
		
		<!-- 底部操作栏 -->
		<view class="footer-action">
			<view class="action-bar safe-area-inset-bottom">
				<view class="btn-item">
					<button class="icon" open-type="contact">
						<u-icon name="server-fill" size="40" color="#606266"></u-icon>
						<text>客服</text>
					</button>
				</view>
				<view class="btn-group" style="width: 60%;">
					<button class="btn buy-btn" style="width: 100%;" @click="exchange">立即兑换</button>
				</view>
			</view>
		</view>
		
		<!-- 积分兑换确认弹窗 -->
		<u-modal v-model="showExchangeModal" 
			:show-cancel-button="true"
			title="积分兑换确认"
			confirm-text="确认兑换"
			cancel-text="取消"
			@confirm="confirmExchange"
			@cancel="cancelExchange">
			<view class="exchange-modal-content">
				<text>您确定要使用</text>
				<text class="points">{{goods_info.goods_points}}</text>
				<text>积分兑换该商品吗？</text>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				indicatorDots: true,
				autoplay: true,
				interval: 5000,
				duration: 1000,
				circular: true,
				goods_info: {
					goods_id: 1,
					goods_title: "商品标题1",
					goods_points: 990,
					goods_yunfei: 0,
					goods_kucun: 100,
					goods_xiaoliang: 1,
					content: '商品介绍详情商品介绍详情商品介绍详情商品介绍详情商品介绍详情商品介绍详情商品介绍详情'
				},
				goods_img: [
					{
						img: '/static/logo.png'
					},
					{
						img: '/static/images/goods/2.jpg'
					},
					{
						img: '/static/images/goods/3.jpg'
					}
				],
				pjDataList: [
					{
						headpic: '/static/images/avatar.jpg',
						author: '张三',
						add_time: '2018-06-01',
						content: '好评好评，真实太好了!'
					},
					{
						headpic: '/static/images/avatar.jpg',
						author: '张三',
						add_time: '2018-06-01',
						content: '好评好评，真实太好了!'
					}
				],
				showExchangeModal: false,
			}
		},
		methods:{
			previewImage(e){
				const current = e.target.dataset.src;
				const imgList = this.goods_img.map(item => item.img);
				uni.previewImage({
					current,
					urls: imgList
				});
			},
			// 兑换逻辑
			exchange() {
				this.showExchangeModal = true;
			},
			// 确认兑换
			confirmExchange() {
				uni.showLoading({
					title: '处理中...'
				});
				
				// 模拟兑换请求
				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '兑换成功',
						icon: 'success'
					});
					// 可以在这里进行页面跳转等操作
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/order/order'
						});
					}, 1500);
				}, 1000);
			},
			// 取消兑换
			cancelExchange() {
				this.showExchangeModal = false;
			}
		}
	}
</script>

<style lang="scss">
.shop-detail {
	min-height: 100vh;
	background-color: #f8f8f8;
	padding-bottom: 120rpx;
	
	.banner {
		height: 750rpx;
		background: #fff;
		position: relative;
		
		.slide-image {
			width: 100%;
			height: 100%;
			transition: transform 0.3s ease;
			
			&:active {
				transform: scale(0.98);
			}
		}
		
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 40rpx;
			background: linear-gradient(to top, rgba(0,0,0,0.1), transparent);
			z-index: 1;
		}
	}
	
	.info-section {
		background: #ffffff;
		margin: 0 20rpx 20rpx;
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
		margin-top: -60rpx;
		position: relative;
		z-index: 2;
		
		.info-wrap {
			flex: 1;
			margin-right: 30rpx;
			
			.goods-title {
				font-size: 36rpx;
				color: #333;
				line-height: 1.5;
				font-weight: bold;
				margin-bottom: 20rpx;
			}
			
			.price-box {
				display: flex;
				align-items: baseline;
				margin-bottom: 20rpx;
				
				.currency {
					font-size: 32rpx;
					color: #3c8cff;
					margin-right: 10rpx;
					font-weight: 500;
				}
				
				.price {
					font-size: 48rpx;
					color: #3c8cff;
					font-weight: bold;
				}
			}
			
			.goods-statistics {
				display: flex;
				justify-content: space-between;
				padding-top: 20rpx;
				border-top: 2rpx solid #f5f5f5;
				
				.statistics-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					flex: 1;
					
					.label {
						font-size: 24rpx;
						color: #999;
						margin-bottom: 8rpx;
					}
					
					.content {
						font-size: 28rpx;
						color: #333;
						font-weight: 500;
					}
				}
			}
		}
		
		.share-btn {
			background: none;
			border: none;
			padding: 0;
			margin: 0;
			line-height: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			width: 80rpx;
			
			text {
				font-size: 24rpx;
				color: #666;
				margin-top: 8rpx;
			}
			
			&::after {
				border: none;
			}
		}
	}
	
	.review-section, .detail-section {
		background: #ffffff;
		margin: 0 20rpx 20rpx;
		padding: 30rpx;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
		
		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;
			border-bottom: 2rpx solid #f5f5f5;
			padding-bottom: 20rpx;
			
			.title {
				display: flex;
				align-items: center;
				
				text {
					font-size: 32rpx;
					color: #333;
					font-weight: bold;
					margin-left: 12rpx;
				}
			}
			
			.more {
				display: flex;
				align-items: center;
				
				text {
					font-size: 28rpx;
					color: #3c8cff;
					margin-right: 8rpx;
				}
			}
		}
	}
	
	.review-list {
		.review-item {
			padding: 24rpx 0;
			border-bottom: 2rpx solid #f5f5f5;
			transition: all 0.3s;
			
			&:last-child {
				border-bottom: none;
				padding-bottom: 0;
			}
			
			&:active {
				background-color: #f9f9f9;
			}
			
			&.last-item {
				margin-bottom: 0;
			}
			
			.user-info {
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;
				
				.avatar {
					width: 72rpx;
					height: 72rpx;
					border-radius: 50%;
					margin-right: 20rpx;
					border: 2rpx solid #f0f0f0;
					background-color: #f5f5f5;
				}
				
				.user-meta {
					flex: 1;
					display: flex;
					flex-direction: column;
					
					.nickname {
						font-size: 28rpx;
						color: #333;
						font-weight: 500;
						margin-bottom: 6rpx;
					}
					
					.rating {
						display: flex;
						
						.u-icon {
							margin-right: 4rpx;
						}
					}
				}
				
				.time {
					font-size: 24rpx;
					color: #999;
					background-color: #f8f8f8;
					padding: 4rpx 12rpx;
					border-radius: 20rpx;
				}
			}
			
			.review-content {
				font-size: 28rpx;
				color: #666;
				line-height: 1.6;
				padding-left: 92rpx;
			}
		}
	}
	
	.detail-content {
		font-size: 30rpx;
		color: #333;
		line-height: 1.8;
		padding: 20rpx;
		background-color: #fafafa;
		border-radius: 12rpx;
		
		rich-text {
			width: 100%;
			overflow: hidden;
		}
	}
	
	.footer-action {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 110rpx;
		background: #ffffff;
		display: flex;
		align-items: center;
		padding: 0 30rpx;
		box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.08);
		z-index: 10;
		
		.action-bar {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.btn-item {
				width: 100rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				position: relative;
				padding: 10rpx 0;
				
				button {
					background: none;
					border: none;
					line-height: 1;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 100%;
					
					&::after {
						border: none;
					}
				}
				
				text {
					font-size: 22rpx;
					color: #666;
					margin-top: 8rpx;
					
					&.active {
						color: #3c8cff;
					}
				}
				
				&:active {
					opacity: 0.7;
				}
			}
		}
		
		.btn-group {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			margin-left: 30rpx;
			
			.btn {
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				font-size: 30rpx;
				color: #fff;
				border-radius: 40rpx;
				font-weight: 500;
				box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
				transition: all 0.2s;
				position: relative;
				overflow: hidden;
				
				&::after {
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: rgba(255, 255, 255, 0.1);
					opacity: 0;
					transition: opacity 0.3s;
				}
				
				&:active::after {
					opacity: 1;
				}
			}
			
			.buy-btn {
				background-color: #3c8cff;
				padding: 0 70rpx;
				
				&:active {
					background-color: #3278e6;
					transform: scale(0.98);
				}
			}
		}
	}
}

.exchange-modal {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 40rpx;
	overflow: hidden;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
	
	.exchange-title {
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 30rpx;
		color: #333;
	}
	
	.exchange-content {
		font-size: 30rpx;
		color: #666;
		line-height: 1.6;
		margin-bottom: 40rpx;
		text-align: center;
		
		.points {
			color: #3c8cff;
			font-weight: bold;
			font-size: 44rpx;
		}
	}
	
	.exchange-actions {
		display: flex;
		justify-content: space-between;
		
		.exchange-btn {
			width: 45%;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			border-radius: 45rpx;
			font-size: 32rpx;
			transition: all 0.2s;
		}
		
		.cancel-btn {
			color: #666;
			background-color: #f5f5f5;
			
			&:active {
				background-color: #e9e9e9;
				transform: scale(0.98);
			}
		}
		
		.confirm-btn {
			color: #fff;
			background-color: #3c8cff;
			
			&:active {
				background-color: #3278e6;
				transform: scale(0.98);
			}
		}
	}
}

.exchange-modal-content {
	padding: 30rpx 0;
	text-align: center;
	font-size: 30rpx;
	line-height: 1.6;
	color: #333;
	
	.points {
		color: #3c8cff;
		font-weight: bold;
		font-size: 40rpx;
		margin: 0 10rpx;
	}
}
</style>
