<template>
	<view class="user-settings">
		<view class="settings-header">
			<view class="header-title">用户设置</view>
		</view>
		
		<!-- 设置列表 -->
		<view class="settings-list">
			<!-- 个人信息设置 -->
			<view class="settings-section">
				<view class="section-title">个人信息</view>
				
				<view class="settings-item">
					<text class="item-label">头像</text>
					<view class="item-content avatar-content">
						<image 
							:src="userInfo.avatarUrl || '/static/logo.png'" 
							mode="aspectFill" 
							class="avatar-image"
						></image>
						<button 
							class="avatar-btn" 
							open-type="chooseAvatar" 
							@chooseavatar="onChooseAvatar"
						>更换头像</button>
					</view>
				</view>
				
				<view class="settings-item">
					<text class="item-label">昵称</text>
					<view class="item-content">
						<input 
							type="text" 
							v-model="tempNickName" 
							placeholder="请输入昵称" 
							class="setting-input"
						/>
						<u-icon name="edit-pen" size="28" color="#3c8cff" class="edit-icon"></u-icon>
					</view>
				</view>
				
				<view class="settings-item">
					<text class="item-label">手机号</text>
					<view class="item-content">
						<input 
							type="number" 
							v-model="tempPhoneNumber" 
							placeholder="请输入手机号" 
							class="setting-input"
							maxlength="11"
						/>
						<u-icon name="edit-pen" size="28" color="#3c8cff" class="edit-icon"></u-icon>
					</view>
				</view>
			</view>
			
			
		</view>
		
		<!-- 保存按钮 -->
		<view class="btn-area">
			<button class="save-btn" :loading="isSaving" @tap="saveUserInfo">保存修改</button>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
	data() {
		return {
			isNicknameEditing: false,
			isPhoneEditing: false,
			isSaving: false,
			// 使用临时变量存储编辑的值
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
		
		// 处理头像选择
		async onChooseAvatar(e) {
			try {
				const { avatarUrl } = e.detail;
				if (avatarUrl) {
					uni.showLoading({
						title: '更新中...'
					});
					
					// 上传头像到云存储
					const uploadResult = await uniCloud.uploadFile({
						filePath: avatarUrl,
						cloudPath: `avatar/${this.userInfo._id || Date.now()}.jpg`
					});
					
					console.log('头像上传结果:', uploadResult);
					
					if (!uploadResult || !uploadResult.fileID) {
						throw new Error('上传失败，未获取到fileID');
					}
					
					// 调用云函数处理文件元数据
					const { result } = await uniCloud.callFunction({
						name: 'upload',
						data: {
							fileID: uploadResult.fileID
						}
					});
					
					if (result && result.code === 0) {
						console.log('云函数处理成功:', result);
						
						// 更新用户信息
						this.updateUserInfo({
							avatar: uploadResult.fileID
						});
						
						uni.hideLoading();
						uni.showToast({
							title: '头像更新成功',
							icon: 'success'
						});
					} else {
						throw new Error(result?.message || '处理头像失败');
					}
				}
			} catch (e) {
				uni.hideLoading();
				uni.showToast({
					title: '获取头像失败: ' + e.message,
					icon: 'none'
				});
				console.error('头像更新失败:', e);
			}
		},
		
		// 保存用户信息
		async saveUserInfo() {
			try {
				this.isSaving = true;
				
				// 调用云函数并等待结果
				const { result } = await uniCloud.callFunction({
					name: 'updateUserInfo',
					data: {
						_id: this.userInfo._id,
						nickName: this.tempNickName,
						phoneNumber: this.tempPhoneNumber
					}
				});
				
				// 根据返回值处理结果
				if (result && result.code === 0) {
					// 更新成功，更新本地状态
					this.nickName = this.tempNickName;
					this.phoneNumber = this.tempPhoneNumber;
					this.updateUserInfo({
						nickName: this.tempNickName,
						mobile: this.tempPhoneNumber
					});
					
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
					
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				} else {
					// 显示错误信息
					uni.showToast({
						title: result?.message || '保存失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('保存用户信息失败:', error);
				uni.showToast({
					title: '保存失败',
					icon: 'none'
				});
			} finally {
				this.isSaving = false;
			}
		}
	}
}
</script>

<style lang="scss">
.user-settings {
	min-height: 100vh;
	background-color: #f8f8f8;
	padding-bottom: 40rpx;
	
	.settings-header {
		background-color: #ffffff;
		padding: 40rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
		
		.header-title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
		}
	}
	
	.settings-list {
		padding: 20rpx;
		
		.settings-section {
			margin-bottom: 30rpx;
			background-color: #ffffff;
			border-radius: 16rpx;
			overflow: hidden;
			
			.section-title {
				padding: 30rpx 30rpx 20rpx;
				font-size: 28rpx;
				color: #3c8cff;
				font-weight: 500;
				border-bottom: 1rpx solid #f5f5f5;
			}
			
			.settings-item {
				display: flex;
				align-items: center;
				padding: 30rpx;
				border-bottom: 1rpx solid #f5f5f5;
				
				&:last-child {
					border-bottom: none;
				}
				
				.item-label {
					width: 180rpx;
					font-size: 28rpx;
					color: #333;
				}
				
				.item-content {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					
					.setting-input {
						text-align: right;
						width: 100%;
						font-size: 28rpx;
						color: #666;
						padding-right: 16rpx;
						
						&::placeholder {
							color: #999;
						}
					}
					
					.edit-icon {
						margin-left: 16rpx;
						flex-shrink: 0;
					}
					
					&.avatar-content {
						justify-content: space-between;
						.avatar-image {
							width: 100rpx;
							height: 100rpx;
							border-radius: 50%;
						}
						
						.avatar-btn {
							background-color: #f5f5f5;
							font-size: 26rpx;
							color: #666;
							padding: 10rpx 30rpx;
							border-radius: 30rpx;
							border: none;
							line-height: 1.5;
							
							&::after {
								border: none;
							}
							
							&:active {
								opacity: 0.7;
							}
						}
					}
				}
			}
		}
	}
	
	.btn-area {
		padding: 40rpx;
		
		.save-btn {
			width: 100%;
			height: 90rpx;
			line-height: 90rpx;
			background-color: #3c8cff;
			color: #ffffff;
			font-size: 32rpx;
			border-radius: 45rpx;
			box-shadow: 0 6rpx 16rpx rgba(60, 140, 255, 0.3);
			
			&:active {
				transform: scale(0.98);
				background-color: #3278e6;
			}
		}
	}
}
</style> 