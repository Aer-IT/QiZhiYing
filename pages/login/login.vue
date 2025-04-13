<template>
	<view class="content">
		<view class="login-box">
			<!-- logo -->
			<view class="logo-box">
				<u-avatar
					:src="defaultAvatar"
					size="140"
					shape="circle"
				></u-avatar>
			</view>
			
			<!-- 标题 -->
			<view class="title-box">
				<text class="title-text">欢迎登录</text>
			</view>
			
			<!-- 登录按钮 -->
			<view class="btn-box">
				<u-button
					type="primary"
					shape="circle"
					size="large"
					:custom-style="buttonStyle"
					@click="getUserInfo"
					:disabled="isLoading"
				>
					<u-icon name="weixin-fill" color="#ffffff" size="20"></u-icon>
					<text class="button-text">微信一键登录</text>
				</u-button>
			</view>
			
			<!-- 隐私协议 -->
			<view class="privacy-box">
				<text class="privacy-text">登录即代表同意</text>
				<text class="privacy-link" @click="showPrivacy">用户协议</text>
			</view>
		</view>
		
		<!-- 加载动画 -->
		<u-loading-page :loading="isLoading"></u-loading-page>
	</view>
</template>

<script>

export default {
	data() {
		return {
			isLoading: false,
			defaultAvatar: '/static/logo.png', // 替换为您的默认头像
			buttonStyle: {
				height: '100rpx',
				marginTop: '50rpx'
			}
		}
	},
	methods: {
		// 更新用户信息到 vuex
		updateUserInfo(data) {
				const userInfo = {
					avatarUrl: data.avatarUrl || '',
					nickName: data.nickName || '',
					mobile: data.mobile || '',
					gender: data.gender || 0,
					history: data.history || [],
					reserveInfo: data.reserveInfo || [],
					_id: data._id,
					points: data.points || 0
					
				}
				this.$store.commit('user/UPDATE_USER_INFO', userInfo)
			},
		
		// 获取授权
		async getUserInfo() {
			if (this.isLoading) return; // 防止重复点击
			
			try {
				this.isLoading = true; // 开始加载状态
				
				// 微信登录
				const loginResult = await new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						success: res => resolve(res),
						fail: err => reject(err)
					});
				});
				
				// 调用云函数登录
				const result = await uniCloud.callFunction({
					name: 'Login',
					data: {
						code: loginResult.code
					}
				});
				
				if (result.result.code === 0) {
					console.log('登录成功，用户信息：', result.result)
					// 存储用户信息到 vuex
					this.updateUserInfo(result.result.data[0])
					
					uni.showToast({
						title: '登录成功',
						icon: 'success',
						duration: 1500,
						success: () => {
							// 延迟跳转，让用户看到成功提示
							setTimeout(() => {
								// 跳转到首页或上一页
								const pages = getCurrentPages();
								if (pages.length > 1) {
									uni.navigateBack(); // 如果有上一页，返回上一页
								} else {
									uni.switchTab({
										url: '/pages/index/index' // 替换为你的首页路径
									});
								}
							}, 1500);
						}
					});
					
				} else {
					console.error('登录失败:', result.result.msg);
					uni.showToast({
						title: result.result.msg || '登录失败',
						icon: 'none'
					});
				}
				
			} catch (error) {
				console.error('登录过程出错:', error);
				uni.showToast({
					title: '登录失败',
					icon: 'none'
				});
			} finally {
				this.isLoading = false; // 结束加载状态
			}
		},
		
		// 显示隐私协议
		showPrivacy() {
			uni.showModal({
				title: '用户协议',
				content: '这里是用户协议内容...',
				showCancel: false
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.content {
	min-height: 100vh;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
}

.login-box {
	width: 80%;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.logo-box {
	margin-bottom: 40rpx;
}

.title-box {
	margin-bottom: 60rpx;
	
	.title-text {
		font-size: 40rpx;
		font-weight: bold;
		color: #2979ff;
	}
}

.btn-box {
	width: 100%;
	
	.button-text {
		margin-left: 10rpx;
	}
}

.privacy-box {
	margin-top: 40rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	
	.privacy-text {
		font-size: 24rpx;
		color: #999;
	}
	
	.privacy-link {
		font-size: 24rpx;
		color: #2979ff;
		margin-left: 8rpx;
	}
}
</style>
