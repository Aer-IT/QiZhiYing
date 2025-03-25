<template>
	<view class="user-info">
		<!-- 顶部个人信息区域 -->
		<view class="top-section">
			<view class="profile-container">
				<!-- 头像区域 -->
				<view class="avatar-section">
					<view class="avatar-display">
						<image 
							class="avatar-image"
							:src="userInfo.avatar || '/static/logo.png'"
							mode="aspectFill"
						></image>
					</view>
				</view>
				
				<!-- 昵称区域 -->
				<view class="name-section">
					<text class="nickname">{{tempNickName || '未设置昵称'}}</text>
					<text class="user-id">ID: {{userInfo._id || '未登录'}}</text>
				</view>
			</view>

			<!-- 设置按钮 -->
			<view class="settings-btn" @tap="navigateTo('/pages/settings/userSettings')">
				<u-icon name="setting-fill" size="36" color="#999"></u-icon>
			</view>
		</view>
		
		<!-- 用户数据面板 -->
		<view class="user-panel">
			<view class="panel-item">
				<text class="item-value">{{userInfo.points || 0}}</text>
				<text class="item-label">积分</text>
			</view>
			<view class="panel-item">
				<text class="item-value">{{userInfo.activities || 0}}</text>
				<text class="item-label">活动</text>
			</view>
		</view>
		
		<!-- 中部功能按钮区域 -->
		<view class="function-section">
			<view class="function-item" @tap="navigateTo('/pages/activity/history')">
				<u-icon
					name="calendar"
					size="40"
					color="#ff9900"
				></u-icon>
				<text class="item-text">活动历史</text>
			</view>
			
			<view class="function-item" @tap="navigateTo('/pages/points/detail')">
				<u-icon
					name="gift"
					size="40"
					color="#19be6b"
				></u-icon>
				<text class="item-text">积分明细</text>
			</view>

			<view class="function-item" @tap="navigateTo('/pages/appointment/record')">
				<u-icon
					name="clock"
					size="40"
					color="#fa3534"
				></u-icon>
				<text class="item-text">预约记录</text>
			</view>
		</view>
		
		<!-- 底部区域 -->
		<view class="bottom-section">
			<view class="section-title">
				<text>更多服务</text>
			</view>
			
			<view class="menu-list">
				<view class="menu-item" @tap="navigateTo('/pages/about/about')">
					<view class="item-left">
						<u-icon name="info-circle" size="40" color="#5677fc"></u-icon>
						<text class="item-text">关于我们</text>
					</view>
					<u-icon name="arrow-right" size="28" color="#c0c4cc"></u-icon>
				</view>
				
				<view class="menu-item" @tap="navigateTo('/pages/points/rules')">
					<view class="item-left">
						<u-icon name="file-text" size="40" color="#ff9900"></u-icon>
						<text class="item-text">积分使用规则</text>
					</view>
					<u-icon name="arrow-right" size="28" color="#c0c4cc"></u-icon>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
	data() {
		return {
			tempNickName: '',
			tempPhoneNumber: '',
			nickName: '',
			phoneNumber: ''
		}
	},
	
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo || {}
		})
	},
	
	onShow() {
		// 初始化临时变量
		this.tempNickName = this.userInfo.nickName || '';
		this.tempPhoneNumber = this.userInfo.mobile || '';
		this.nickName = this.userInfo.nickName || '';
		this.phoneNumber = this.userInfo.mobile || '';
	},
	
	methods: {
		...mapMutations({
			updateUserInfo: 'user/UPDATE_USER_INFO'
		}),
		
		// 页面跳转
		navigateTo(url) {
			uni.navigateTo({
				url
			});
		}
	}
}
</script>

<style lang="scss">
.user-info {
	background-color: #f8f8f8;
	min-height: 100vh;
	
	.top-section {
		background: #ffffff;
		padding: 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		border-radius: 0 0 30rpx 30rpx;
		
		.profile-container {
			display: flex;
			align-items: center;
			flex: 1;
		}
		
		.avatar-section {
			.avatar-display {
				width: 150rpx !important;
				height: 150rpx !important;
				border-radius: 50%;
				overflow: hidden;
				background: transparent;
				box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
				
				.avatar-image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
		}
		
		.name-section {
			margin-left: 30rpx;
			display: flex;
			flex-direction: column;
			
			.nickname {
				font-size: 40rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 10rpx;
			}
			
			.user-id {
				font-size: 24rpx;
				color: #999;
			}
		}
		
		.settings-btn {
			width: 70rpx;
			height: 70rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #f8f8f8;
			border-radius: 50%;
			transition: all 0.2s;
			
			&:active {
				background-color: #efefef;
				transform: scale(0.95);
			}
		}
	}
	
	.user-panel {
		margin: 30rpx 20rpx 0;
		padding: 30rpx;
		background: #ffffff;
		border-radius: 16rpx;
		display: flex;
		justify-content: space-around;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		
		.panel-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 0 40rpx;
			position: relative;
			
			&:not(:last-child)::after {
				content: '';
				position: absolute;
				right: 0;
				top: 15%;
				height: 70%;
				width: 1px;
				background-color: #f0f0f0;
			}
			
			.item-value {
				font-size: 40rpx;
				font-weight: bold;
				color: #3c8cff;
				margin-bottom: 10rpx;
			}
			
			.item-label {
				font-size: 26rpx;
				color: #999;
			}
		}
	}
	
	.function-section {
		margin: 30rpx 20rpx;
		padding: 30rpx 20rpx;
		background: #ffffff;
		display: flex;
		justify-content: space-around;
		align-items: center;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		border-radius: 16rpx;
		
		.function-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
			padding: 10rpx;
			flex: 1;
			
			// 圆形背景
			&::before {
				content: '';
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
				z-index: 0;
				transition: all 0.3s ease;
			}
			
			// 图标容器
			.u-icon {
				position: relative;
				z-index: 1;
				margin-bottom: 8rpx;
			}
			
			// 文字样式
			.item-text {
				font-size: 24rpx;
				color: #333333;
				position: relative;
				z-index: 1;
			}
			
			// 每个按钮的特殊颜色
			&:nth-child(1) {
				&::before {
					background: rgba(255, 153, 0, 0.1);
				}
			}
			
			&:nth-child(2) {
				&::before {
					background: rgba(25, 190, 107, 0.1);
				}
			}
			
			&:nth-child(3) {
				&::before {
					background: rgba(250, 53, 52, 0.1);
				}
			}
			
			// 点击效果
			&:active {
				&::before {
					transform: translate(-50%, -50%) scale(0.9);
				}
				.item-text {
					opacity: 0.8;
				}
			}
			
			
		}
	}
	
	.bottom-section {
		margin-top: 30rpx;
		background: #ffffff;
		padding: 20rpx 0;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		
		.section-title {
			padding: 20rpx 40rpx;
			font-size: 32rpx;
			color: #333333;
			font-weight: bold;
		}
		
		.menu-list {
			.menu-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30rpx 40rpx;
				position: relative;
				
				&::after {
					content: '';
					position: absolute;
					left: 40rpx;
					right: 40rpx;
					bottom: 0;
					height: 1px;
					background: #f5f5f5;
				}
				
				&:last-child::after {
					display: none;
				}
				
				&:active {
					background-color: #f8f8f8;
				}
				
				.item-left {
					display: flex;
					align-items: center;
					
					.item-text {
						font-size: 28rpx;
						color: #333333;
						margin-left: 20rpx;
					}
				}
			}
		}
	}
}
</style>
