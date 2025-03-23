<template>
	<view class="shop">
		<!-- 搜索栏 -->
		<view class="search-section">
			<view class="search-box">
				<input
					type="text"
					v-model="searchKeyword"
					placeholder="搜索商品"
					confirm-type="search"
					@confirm="doSearch"
					class="search-input"
				/>
				<view class="icon-group">
					<u-icon
						v-if="searchKeyword"
						name="close"
						size="36"
						color="#909399"
						@click="clearSearch"
						class="clear-icon"
					></u-icon>
					<u-icon 
						name="search" 
						size="40" 
						color="#909399"
						class="search-icon"
						@click="doSearch"
					></u-icon>
				</view>
			</view>
		</view>
		
		<!-- 商品列表区域 -->
		<swiper
			class="goods-swiper"
			:indicator-dots="true"
			indicator-color="rgba(0, 0, 0, .3)"
			indicator-active-color="#2979ff"
			@change="handlePageChange"
		>
			<swiper-item v-for="(page, pageIndex) in goodsPages" :key="pageIndex">
				<view class="goods-grid">
					<view 
						class="goods-item"
						v-for="(item, index) in page"
						:key="index"
						@tap="goToDetail(item.id)"
					>
						<image 
							:src="item.image" 
							mode="aspectFill" 
							class="goods-image"
						></image>
						<view class="goods-info">
							<text class="goods-name">{{item.name}}</text>
							<view class="price-row">
								<text class="price">¥{{item.price}}</text>
								<text class="sold">已售{{item.sold}}件</text>
							</view>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchKeyword: '', // 搜索关键词
				goodsList: [
					// 模拟数据，实际应该从API获取
					{
						id: 1,
						name: '商品1',
						price: '99.00',
						sold: 999,
						image: '/static/goods/1.png'
					},
					// ... 更多商品数据
				],
				currentPage: 0
			};
		},
		
		computed: {
			// 将商品列表分页，每页6个商品
			goodsPages() {
				const pages = [];
				const pageSize = 6;
				for (let i = 0; i < this.goodsList.length; i += pageSize) {
					pages.push(this.goodsList.slice(i, i + pageSize));
				}
				return pages;
			}
		},
		
		methods: {
			// 执行搜索
			doSearch() {
				if (!this.searchKeyword.trim()) {
					uni.showToast({
						title: '请输入搜索内容',
						icon: 'none'
					});
					return;
				}
				
				console.log('执行搜索:', this.searchKeyword);
				// TODO: 这里添加实际的搜索逻辑
			},
			
			// 清空搜索
			clearSearch() {
				this.searchKeyword = '';
			},
			
			// 处理页面切换
			handlePageChange(e) {
				this.currentPage = e.detail.current;
				// 当滑动到最后一页时，可以在这里加载更多商品
				if (this.currentPage === this.goodsPages.length - 1) {
					this.loadMoreGoods();
				}
			},
			
			// 加载更多商品
			loadMoreGoods() {
				// TODO: 这里添加加载更多商品的逻辑
				console.log('加载更多商品');
			},
			
			// 跳转到商品详情
			goToDetail(id) {
				uni.navigateTo({
					url: `/pages/shopDetail/shopDetail?id=${id}`
				});
			}
		}
	}
</script>

<style lang="scss">
.shop {
	background-color: #f8f8f8;
	min-height: 100vh;
	
	.search-section {
		background: #ffffff;
		padding: 20rpx 30rpx;
		position: sticky;
		top: 0;
		z-index: 100;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		
		.search-box {
			border: 1rpx solid black;
			display: flex;
			align-items: center;
			background-color: #f5f5f5;
			border-radius: 32rpx;
			padding: 16rpx 24rpx;
			
			.search-input {
				flex: 1;
				font-size: 28rpx;
				color: #333333;
				height: 40rpx;
				line-height: 40rpx;
				padding-right: 20rpx;
				
				&::placeholder {
					color: #909399;
				}
			}
			
			.icon-group {
				display: flex;
				align-items: center;
				border-left: 2rpx solid #e4e7ed;
				padding-left: 20rpx;
				
				.clear-icon {
					margin-right: 16rpx;
					
					&:active {
						opacity: 0.7;
					}
				}
				
				.search-icon {
					&:active {
						opacity: 0.7;
					}
				}
			}
		}
	}
	
	.goods-swiper {
		height: calc(100vh - 180rpx); // 减去搜索栏的高度
		
		.goods-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 20rpx;
			padding: 20rpx;
			
			.goods-item {
				background: #ffffff;
				border-radius: 12rpx;
				overflow: hidden;
				box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
				
				&:active {
					transform: scale(0.98);
				}
				
				.goods-image {
					width: 100%;
					height: 320rpx;
					background-color: #f5f5f5;
				}
				
				.goods-info {
					padding: 16rpx;
					
					.goods-name {
						font-size: 28rpx;
						color: #333333;
						line-height: 1.4;
						height: 80rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					
					.price-row {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-top: 12rpx;
						
						.price {
							font-size: 32rpx;
							color: #ff5500;
							font-weight: bold;
						}
						
						.sold {
							font-size: 24rpx;
							color: #999999;
						}
					}
				}
			}
		}
	}
}
</style>
