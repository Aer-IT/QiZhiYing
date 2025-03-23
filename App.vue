<script>
	import {
		mapMutations
	} from 'vuex'

	export default {
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
					_id: data._id
				}
				this.$store.commit('user/UPDATE_USER_INFO', userInfo)
			}
		},
		onLaunch: async function() {
			try {
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
						icon: 'success'
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
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
</style>