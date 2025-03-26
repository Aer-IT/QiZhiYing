<template>
	<view class="interaction-details">
		<!-- 列表内容 -->
		<scroll-view 
			scroll-y 
			class="scroll-container"
			@scrolltolower="loadMore"
			:refresher-enabled="true"
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh"
		>
			<view class="post-list">
				<view 
					class="post-item" 
					v-for="(item, index) in postList" 
					:key="index"
				>
					<!-- 用户信息 -->
					<view class="user-info">
						<image 
							:src="item.avatar || '/static/images/avatar.png'" 
							class="avatar"
							mode="aspectFill"
						></image>
						<text class="nickname">{{item.nickname}}</text>
						<text class="time">{{item.time}}</text>
					</view>
					
					<!-- 文字内容 -->
					<view class="content">
						<text class="text">{{item.content}}</text>
					</view>
					
					<!-- 图片内容 -->
					<view class="image-list" v-if="item.images && item.images.length">
						<view 
							class="image-item"
							v-for="(img, imgIndex) in item.images"
							:key="imgIndex"
							@tap="previewImage(item.images, imgIndex)"
						>
							<image 
								:src="img" 
								mode="aspectFill"
							></image>
						</view>
					</view>
					
					<!-- 课程标签 -->
					<view class="course-tag" v-if="item.courseName">
						<u-icon name="bookmark" size="24" color="#2979ff"></u-icon>
						<text>{{item.courseName}}</text>
					</view>
					
					<!-- 互动栏 -->
					<view class="interaction-bar">
						<view class="action-item" @tap="toggleLike(index)">
							<u-icon name="thumb-up" size="32" :color="item.isLiked ? '#2979ff' : '#999'"></u-icon>
							<text :class="['count', item.isLiked ? 'active' : '']">{{item.likeCount}}</text>
						</view>
						<view class="action-item" @tap="goToComments(item.id)">
							<u-icon name="chat" size="32" color="#999"></u-icon>
							<text class="count">{{item.commentCount}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 加载更多提示 -->
			<view class="loading-more" v-if="isLoading">
				<u-loading-icon></u-loading-icon>
				<text>加载中...</text>
			</view>
			<view class="no-more" v-if="!hasMore">
				<text>没有更多内容了</text>
			</view>
		</scroll-view>
		
		<!-- 新增悬浮分享按钮 -->
		<view class="float-button">
			<u-button
				type="primary"
				shape="circle"
				@click="goToShare"
				:customStyle="{
					width: '100rpx',
					height: '100rpx',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}"
			>
				<view class="button-content">
					<u-icon name="edit-pen" color="#ffffff" size="24"></u-icon>
					<text class="button-text">分享</text>
				</view>
			</u-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			postList: [], // 帖子列表
			page: 1, // 当前页码
			pageSize: 5, // 每页数量
			hasMore: true, // 是否还有更多
			isLoading: false, // 是否正在加载
			isRefreshing: false,
			type: 1, // 页面类型：1-自然笔记，2-亲子时光
		}
	},
	
	onLoad(options) {
		this.type = Number(options.type) || 1;
		// 设置导航栏标题
		uni.setNavigationBarTitle({
			title: this.type === 1 ? '自然笔记' : '亲子时光'
		});
		this.loadInitialData();
	},
	
	methods: {
		// 下拉刷新
		async onRefresh() {
			this.isRefreshing = true;
			this.page = 1;
			await this.loadInitialData();
			this.isRefreshing = false;
			// 重置加载更多状态
			this.hasMore = true;
		},
		
		// 跳转到评论页面
		goToComments(postId) {
			uni.navigateTo({
				url: `/pages/home/comments?postId=${postId}`
			});
		},
		
		// 加载初始数据
		async loadInitialData() {
			this.postList = Array(5).fill({}).map((_, index) => ({
				id: index + 1,
				nickname: `用户${index + 1}`,
				avatar: '/static/images/avatar.png',
				content: '这是一段示例内容，描述用户的' + (this.type === 1 ? '自然观察笔记' : '亲子互动记录'),
				images: index % 2 === 0 ? [
					'/static/images/demo1.jpg',
					'/static/images/demo2.jpg'
				] : [],
				time: '2024-03-20',
				likeCount: Math.floor(Math.random() * 100),
				commentCount: Math.floor(Math.random() * 50),
				isLiked: false,
				courseName: `示例课程${index + 1}` // 添加课程名称
			}));
		},
		
		// 加载更多
		async loadMore() {
			if (!this.hasMore || this.isLoading) return;
			
			this.isLoading = true;
			
			// 模拟请求延迟
			await new Promise(resolve => setTimeout(resolve, 500));
			
			// 模拟加载更多数据
			const newData = Array(5).fill({}).map((_, index) => ({
				id: this.postList.length + index + 1,
				nickname: `用户${this.postList.length + index + 1}`,
				avatar: '/static/images/avatar.png',
				content: '这是加载的更多内容示例',
				images: index % 2 === 0 ? [
					'/static/images/demo1.jpg',
					'/static/images/demo2.jpg'
				] : [],
				time: '2024-03-20',
				likeCount: Math.floor(Math.random() * 100),
				commentCount: Math.floor(Math.random() * 50),
				isLiked: false,
				courseName: `示例课程${this.postList.length + index + 1}` // 添加课程名称
			}));
			
			this.postList = [...this.postList, ...newData];
			this.page++;
			
			// 模拟数据到达上限
			if (this.page > 4) {
				this.hasMore = false;
			}
			
			this.isLoading = false;
		},
		
		// 预览图片
		previewImage(images, current) {
			uni.previewImage({
				urls: images,
				current: images[current]
			});
		},
		
		// 点赞功能
		toggleLike(index) {
			const item = this.postList[index];
			item.isLiked = !item.isLiked;
			item.likeCount += item.isLiked ? 1 : -1;
		},
		
		// 跳转到分享页面
		goToShare() {
			if(!this.$store.state.user.userInfo){
				uni.showToast({
					title:'用户未登录,无法分享内容',
					icon:'none'
				})
				return
			}
			uni.navigateTo({
				url: `/pages/interaction/share?type=${this.type}`
			});
		}
	}
}
</script>

<style lang="scss">
.interaction-details {
	min-height: 100vh;
	background: #f8f8f8;
	
	.scroll-container {
		height: 100vh;
	}
	
	.post-list {
		padding: 20rpx;
		
		.post-item {
			background: #ffffff;
			border-radius: 16rpx;
			padding: 30rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
			
			.user-info {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				
				.avatar {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}
				
				.nickname {
					font-size: 28rpx;
					color: #333333;
					font-weight: bold;
				}
				
				.time {
					font-size: 24rpx;
					color: #999999;
					margin-left: auto;
				}
			}
			
			.content {
				margin-bottom: 20rpx;
				
				.text {
					font-size: 28rpx;
					color: #333333;
					line-height: 1.6;
				}
			}
			
			.image-list {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 10rpx;
				margin-bottom: 20rpx;
				
				.image-item {
					aspect-ratio: 1;
					border-radius: 8rpx;
					overflow: hidden;
					
					image {
						width: 100%;
						height: 100%;
					}
				}
			}
			
			.course-tag {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				margin-bottom: 16rpx;
				
				text {
					font-size: 24rpx;
					color: #2979ff;
					margin-left: 8rpx;
				}
			}
			
			.interaction-bar {
				display: flex;
				align-items: center;
				border-top: 2rpx solid #f5f5f5;
				padding-top: 20rpx;
				
				.action-item {
					display: flex;
					align-items: center;
					margin-right: 40rpx;
					
					.count {
						font-size: 24rpx;
						color: #999999;
						margin-left: 8rpx;
						
						&.active {
							color: #2979ff;
						}
					}
				}
			}
		}
	}
	
	.loading-more,
	.no-more {
		text-align: center;
		padding: 30rpx;
		font-size: 24rpx;
		color: #999999;
		display: flex;
		align-items: center;
		justify-content: center;
		
		text {
			margin-left: 10rpx;
		}
	}
	
	// 新增悬浮按钮样式
	.float-button {
		position: fixed;
		right: 40rpx;
		top: 120rpx;
		z-index: 99;
		
		.button-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			
			.button-text {
				font-size: 20rpx;
				color: #ffffff;
				margin-top: 4rpx;
			}
		}
		
		// 添加按钮阴影和悬浮效果
		:deep(.u-button) {
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
			transition: all 0.3s ease;
			
			&:active {
				transform: scale(0.95);
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
			}
		}
	}
}
</style>
