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
import { mapGetters, mapActions } from 'vuex'

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
	computed: {
		...mapGetters({
			userInfo: 'user/userInfo',
			isLogin: 'user/isLogin'
		})
	},
	methods: {
		...mapActions({
			updateUserInfo: 'user/updateUserInfo'
		}),
		// 获取授权
		getUserInfo() {
			uni.showModal({
				title: "温馨提示",
				content: "正在请求获取您的个人信息",
				confirmText: "确定登录",
				confirmColor: "#2979ff",
				cancelColor: "#999999",
				success: (res) => {
					if(res.confirm) {
						this.isLoading = true;
						uni.getUserProfile({
							desc: '用于完善会员资料',
							success: (info) => {
								this.getLogin(info.userInfo);
							},
							fail: (err) => {
								this.isLoading = false;
								uni.showToast({
									title: '获取信息失败',
									icon: 'none'
								});
							}
						});
					}
				}
			});
		},
		
		// 微信登录
		getLogin(userInfo) {
			uni.login({
				provider: 'weixin',
				success: (res) => {
					uniCloud.callFunction({
						name: 'Login',
						data: {
							userinfo: userInfo,
							code: res.code
						}
					}).then(result => {
						this.isLoading = false;
						if(result.result.code === 0) {
							// 存储用户信息到vuex
							this.updateUserInfo(result.result.data[0]);
							// 存储token
							uni.setStorageSync('Token', result.result.data[0].token);
							
							uni.showToast({
								title: '登录成功',
								icon: 'success'
							});
							
							// 跳转到首页
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/home/home'
								});
							}, 1500);
						} else {
							uni.showToast({
								title: result.result.msg || '登录失败',
								icon: 'none'
							});
						}
					}).catch(err => {
						this.isLoading = false;
						uni.showToast({
							title: '登录失败',
							icon: 'none'
						});
					});
				},
				fail: () => {
					this.isLoading = false;
					uni.showToast({
						title: '登录失败',
						icon: 'none'
					});
				}
			});
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
