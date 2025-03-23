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
			indicator-active-color="#2979ff"
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
			<view class="price-section">
				<view class="price-box">
					<text class="currency">¥</text>
					<text class="price">{{goods_info.goods_price}}</text>
				</view>
				<button class="share-btn" open-type="share">
					<u-icon name="share" size="40" color="#666"></u-icon>
					<text>分享</text>
				</button>
			</view>
			
			<view class="title-section">
				<text class="goods-title">{{goods_info.goods_title}}</text>
			</view>
		 
			<view class="stats-section">
				<view class="stat-item">
					<text class="label">运费</text>
					<text class="value">{{goods_info.goods_yunfei == 0.00 ? '包邮' : '¥' + goods_info.goods_yunfei}}</text>
				</view>
				<view class="stat-item">
					<text class="label">库存</text>
					<text class="value">{{goods_info.goods_kucun}}件</text>
				</view>
				<view class="stat-item">
					<text class="label">销量</text>
					<text class="value">{{goods_info.goods_xiaoliang}}件</text>
				</view>
			</view>
		</view>
		
		<!-- 评价区域 -->
		<view class='review-section' v-if="pjDataList && pjDataList.length">
			<view class="section-header">
				<view class="title">
					<u-icon name="chat" size="32" color="#2979ff"></u-icon>
					<text>商品评价</text>
				</view>
				<navigator :url="`pjList?id=${goods_id}`" class="more">
					<text>查看全部</text>
					<u-icon name="arrow-right" size="24" color="#999"></u-icon>
				</navigator>
			</view>
			
			<view class="review-list">
				<view 
					class="review-item" 
					v-for="(item, index) in pjDataList" 
					:key="index"
				>
					<view class="user-info">
						<image :src="item.headpic" mode="aspectFill" class="avatar"></image>
						<text class="nickname">{{item.author}}</text>
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
					<u-icon name="file-text" size="32" color="#2979ff"></u-icon>
					<text>商品详情</text>
				</view>
			</view>
			<view class="detail-content">
				<text>{{goods_info.content}}</text>
			</view>
		</view>
		
		<!-- 底部操作栏 -->
		<view class="footer-action">
			<view class="action-group">
				<view class="action-item" @tap="shoucang">
					<u-icon 
						:name="is_shoucang ? 'heart-fill' : 'heart'" 
						:color="is_shoucang ? '#ff5500' : '#666'"
						size="40"
					></u-icon>
					<text :class="{'active': is_shoucang}">收藏</text>
				</view>
				<button class="action-item contact-btn" open-type="contact">
					<u-icon name="server-man" size="40" color="#666"></u-icon>
					<text>客服</text>
				</button>
				<view class="action-item">
					<u-icon name="shopping-cart" size="40" color="#666"></u-icon>
					<text>购物车</text>
				</view>
			</view>
			<view class="buy-btn" @tap="buy">
				<text>立即购买</text>
			</view>
		</view>
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
				is_shoucang: 0,
				goods_info: {
					goods_id: 1,
					goods_title: "商品标题1",
					goods_price: '100',
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
				]
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
			shoucang() {
				this.is_shoucang = !this.is_shoucang;
			},
			buy() {
				// 购买逻辑
				console.log('购买');
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
		
		.slide-image {
			width: 100%;
			height: 100%;
		}
	}
	
	.info-section {
		background: #ffffff;
		margin-bottom: 20rpx;
		padding: 30rpx;
		
		.price-section {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;
			
			.price-box {
				display: flex;
				align-items: baseline;
				
				.currency {
					font-size: 32rpx;
					color: #ff5500;
					margin-right: 4rpx;
				}
				
				.price {
					font-size: 48rpx;
					color: #ff5500;
					font-weight: bold;
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
				
				text {
					font-size: 24rpx;
					color: #666;
					margin-top: 4rpx;
				}
				
				&::after {
					border: none;
				}
			}
		}
		
		.title-section {
			margin-bottom: 30rpx;
			
			.goods-title {
				font-size: 32rpx;
				color: #333;
				line-height: 1.5;
				font-weight: bold;
			}
		}
		
		.stats-section {
			display: flex;
			justify-content: space-between;
			padding-top: 20rpx;
			border-top: 2rpx solid #f5f5f5;
			
			.stat-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				
				.label {
					font-size: 24rpx;
					color: #999;
					margin-bottom: 8rpx;
				}
				
				.value {
					font-size: 28rpx;
					color: #333;
				}
			}
		}
	}
	
	.review-section, .detail-section {
		background: #ffffff;
		margin-bottom: 20rpx;
		padding: 30rpx;
		
		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;
			
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
					color: #999;
					margin-right: 8rpx;
				}
			}
		}
	}
	
	.review-list {
		.review-item {
			padding: 20rpx 0;
			border-bottom: 2rpx solid #f5f5f5;
			
			&:last-child {
				border-bottom: none;
			}
			
			.user-info {
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;
				
				.avatar {
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
					margin-right: 16rpx;
				}
				
				.nickname {
					font-size: 28rpx;
					color: #333;
					margin-right: auto;
				}
				
				.time {
					font-size: 24rpx;
					color: #999;
				}
			}
			
			.review-content {
				font-size: 28rpx;
				color: #666;
				line-height: 1.6;
			}
		}
	}
	
	.detail-content {
		font-size: 28rpx;
		color: #666;
		line-height: 1.8;
	}
	
	.footer-action {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100rpx;
		background: #ffffff;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.05);
		
		.action-group {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 320rpx;
			margin-right: 20rpx;
			padding: 0 10rpx;
			
			.action-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				position: relative;
				padding: 10rpx 0;
				flex: 1;
				
				text {
					font-size: 20rpx;
					color: #666;
					margin-top: 8rpx;
					
					&.active {
						color: #ff5500;
					}
				}
				
				&.contact-btn {
					background: none;
					border: none;
					padding: 10rpx 0;
					margin: 0;
					line-height: 1;
					flex: 1;
					
					&::after {
						border: none;
					}
				}
				
				&:active {
					opacity: 0.7;
				}
				
				&:not(:last-child)::after {
					content: '';
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
					height: 50%;
					width: 2rpx;
					background-color: #f5f5f5;
				}
			}
		}
		
		.buy-btn {
			flex: 1;
			height: 72rpx;
			background: linear-gradient(to right, #ff6034, #ee0a24);
			border-radius: 36rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-left: 10rpx;
			
			text {
				color: #ffffff;
				font-size: 28rpx;
				font-weight: bold;
			}
			
			&:active {
				opacity: 0.9;
				transform: scale(0.98);
			}
		}
	}
}
</style>
