<template>
	<view class="share-container">
	
		
		<!-- 内容区域 -->
		<view class="content-section">
			<!-- 文本输入区 -->
			<u-textarea
				v-model="content"
				placeholder="分享你的观察和感受..."
				:maxlength="500"
				height="200"
				count
			></u-textarea>
			
			<!-- 图片上传区 -->
			<view class="upload-section">
				<u-upload
					:fileList="fileList"
					@afterRead="afterRead"
					@delete="deletePic"
					name="image"
					multiple
					:maxCount="9"
					:previewFullImage="true"
					width="160"
					height="160"
					:customStyle="{borderRadius:'12rpx'}"
				></u-upload>
				
				<!-- 显示上传进度和状态 -->
				<view class="upload-status" v-if="uploadingCount > 0">
					<u-loading-icon size="28" mode="circle" color="#2979ff"></u-loading-icon>
					<text class="status-text">正在上传 {{uploadingCount}} 张图片...</text>
				</view>
			</view>
			
			<!-- 课程选择区 -->
			<view class="course-select">
				<view class="select-title">
					<u-icon name="bookmark" size="20" color="#2979ff"></u-icon>
					<text>选择相关课程<text class="required">*</text></text>
				</view>
				<u-picker
					:show="showCoursePicker"
					:columns="[courseList]"
					@confirm="confirmCourse"
					@cancel="showCoursePicker = false"
					keyName="text"
				></u-picker>
				<view class="selected-course" @click="showCoursePicker = true">
					<text v-if="selectedCourse">{{ selectedCourse }}</text>
					<text v-else class="placeholder">请选择课程</text>
					<u-icon name="arrow-right" size="20" color="#999"></u-icon>
				</view>
			</view>
		</view>
		
		<!-- 发布按钮 -->
		<view class="publish-button">
			<u-button
				type="success"
				shape="circle"
				:disabled="!isValid"
				:loading="isSubmitting"
				@click="submitShare"
				:customStyle="{
					width: '100rpx',
					height: '100rpx',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}"
			>
				<view class="button-content">
					<u-icon name="checkmark" color="#ffffff" size="24"></u-icon>
					<text class="button-text">发布</text>
				</view>
			</u-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			content: '', // 文字内容
			fileList: [], // 图片列表
			courseList: [], // 课程列表
			selectedCourse: null, // 选中的课程
			showCoursePicker: false, // 是否显示课程选择器
			isSubmitting: false, // 是否正在提交
			type: 1, // 页面类型：1-自然笔记，2-亲子时光
			uploadingCount: 0, // 正在上传的图片数量
		}
	},
	
	computed: {
		// 修改表单验证逻辑，必须选择课程
		isValid() {
			return (this.content.trim() || this.fileList.length > 0) && this.selectedCourse;
		}
	},
	
	onLoad(options) {
		this.type = Number(options.type) || 1;
		this.loadCourses();
	},
	
	methods: {
		// 加载课程列表
		async loadCourses() {
			try {
				const { result } = await uniCloud.callFunction({
					name: 'getCourses',
					data: {}
				});
				
				if (result.data && result.data.length > 0) {
					this.courseList = result.data.map(course => ({
						text: course.title
					}));
				}
			} catch (e) {
				console.error('加载课程失败:', e);
				uni.showToast({
					title: '加载课程失败',
					icon: 'none'
				});
			}
		},
		
		// 处理图片上传
		async afterRead(event) {
			// 获取文件
			const files = Array.isArray(event.file) ? event.file : [event.file];
			
			// 增加上传计数
			this.uploadingCount += files.length;
			
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				// 显示上传中状态
				const fileIndex = this.fileList.length;
				this.fileList.push({
					...file,
					status: 'uploading',
					message: '上传中',
					progress: 0
				});
				
				try {
					// 上传文件到云储存
					const uploadResult = await uniCloud.uploadFile({
						filePath: file.url,
						cloudPath: `share/${Date.now()}-${Math.random().toString(36).slice(-6)}.${file.url.split('.').pop()}`,
						onUploadProgress: (progressEvent) => {
							if (progressEvent.totalBytesSent && progressEvent.totalBytesExpectedToSend) {
								const progress = Math.round(progressEvent.totalBytesSent / progressEvent.totalBytesExpectedToSend * 100);
								// 更新上传进度
								this.fileList[fileIndex].progress = progress;
								this.fileList[fileIndex].message = `${progress}%`;
							}
						}
					});
					
					console.log('文件上传成功，fileID:', uploadResult.fileID);
					
					if (!uploadResult || !uploadResult.fileID) {
						throw new Error('文件上传失败，未获取到fileID');
					}
					
					// 更新文件状态为成功，并清除上传相关属性
					this.fileList[fileIndex] = {
						...this.fileList[fileIndex],
						url: uploadResult.fileID, // 使用上传后的文件ID
						status: 'success',
						thumb: uploadResult.fileID, // 先用fileID作为缩略图
						viewUrl: uploadResult.fileID,  // 先用fileID作为预览URL
						originalUrl: file.url, // 保存原始本地路径
						// 移除上传状态相关属性
						message: undefined,
						progress: undefined
					};
					
					// 减少上传计数
					this.uploadingCount--;
					
					// 调用云函数处理文件元数据
					try {
						const { result } = await uniCloud.callFunction({
							name: 'upload',
							data: {
								fileID: uploadResult.fileID
							}
						});
						
						if (result && result.code === 0) {
							console.log('云函数处理成功:', result);
							// 预处理图片URL，用于前端显示
							this.getTempFileURL(uploadResult.fileID, fileIndex);
						} else {
							console.warn('云函数处理失败:', result);
							// 即使处理失败，文件已上传成功，仍可以继续
							this.getTempFileURL(uploadResult.fileID, fileIndex);
						}
					} catch (cloudFuncError) {
						console.warn('调用云函数失败，但文件已上传:', cloudFuncError);
						// 即使云函数调用失败，文件已上传成功，仍可以继续
						this.getTempFileURL(uploadResult.fileID, fileIndex);
					}
				} catch (e) {
					console.error('图片上传失败:', e);
					// 更新文件状态为失败
					this.fileList[fileIndex] = {
						...this.fileList[fileIndex],
						status: 'error',
						message: e.message || '上传失败'
					};
					
					// 减少上传计数
					this.uploadingCount--;
					
					uni.showToast({
						title: '图片上传失败',
						icon: 'none'
					});
				}
			}
		},
		
		// 获取临时文件URL用于展示
		async getTempFileURL(fileID, index) {
			try {
				// 直接使用fileID作为预览URL
				// 在uniCloud环境中，云存储的fileID本身就可以用于预览
				this.fileList[index] = {
					...this.fileList[index],
					thumb: fileID, // 使用fileID作为缩略图地址
					viewUrl: fileID // 使用fileID作为预览URL
				};
				
				// 尝试获取临时URL，如果获取成功则使用临时URL
				try {
					const { result } = await uniCloud.getTempFileURL({
						fileList: [fileID]
					});
					
					// 检查result是否存在以及是否有fileList属性
					if (result && result.fileList && result.fileList.length > 0 && result.fileList[0].tempFileURL) {
						// 更新文件显示URL
						this.fileList[index] = {
							...this.fileList[index],
							thumb: result.fileList[0].tempFileURL, // 缩略图URL
							viewUrl: result.fileList[0].tempFileURL // 预览URL
						};
					}
				} catch (innerError) {
					console.warn('获取临时文件URL失败，将使用fileID作为URL:', innerError);
					// 这里不抛出异常，因为已经使用fileID作为预览URL
				}
			} catch (e) {
				console.error('处理图片URL失败:', e);
			}
		},
		
		// 删除图片
		async deletePic(event) {
			const index = event.index;
			const file = this.fileList[index];
			
			try {
				// 如果图片已上传到云存储，尝试删除云存储上的文件
				if (file.status === 'success' && file.url && file.url.indexOf('cloud://') === 0) {
					// 显示删除中状态
					uni.showLoading({
						title: '删除中...'
					});
					
					// 调用云函数删除云存储中的文件
					try {
						const { result } = await uniCloud.callFunction({
							name: 'deleteFile',
							data: {
								fileList: [file.url]
							}
						});
						
						console.log('云函数删除文件结果:', result);
					} catch (deleteCallError) {
						console.warn('删除云存储文件失败:', deleteCallError);
						// 即使删除云存储文件失败，仍然从界面上移除
					} finally {
						uni.hideLoading();
					}
				}
				
				// 如果文件正在上传，减少上传计数
				if (file.status === 'uploading') {
					this.uploadingCount--;
				}
				
				// 从文件列表中移除
				this.fileList.splice(index, 1);
				
				console.log('图片已从列表中删除');
			} catch (e) {
				console.error('删除图片失败:', e);
				uni.showToast({
					title: '删除失败',
					icon: 'none'
				});
			}
		},
		
		// 选择课程
		confirmCourse(e) {
			try {
				console.log('选择的数据:', e);
				// 使用选择器返回的索引获取课程
				if (e && Array.isArray(e.value) && e.value.length > 0) {
					this.selectedCourse = e.value[0].text;
				}
				console.log('选中的课程:', this.selectedCourse);
			} catch (error) {
				console.error('课程选择错误:', error);
			} finally {
				this.showCoursePicker = false;
			}
		},
		
		// 提交分享
		async submitShare() {
			if (!this.isValid) return;
			
			try {
				this.isSubmitting = true;
				
				// 检查是否有正在上传的图片
				const uploadingIndex = this.fileList.findIndex(file => file.status === 'uploading');
				if (uploadingIndex !== -1) {
					uni.showToast({
						title: '请等待图片上传完成',
						icon: 'none'
					});
					this.isSubmitting = false;
					return;
				}
				
				// 收集所有上传成功的图片ID
				const imageIds = this.fileList
					.filter(file => file.status === 'success')
					.map(file => file.url);
				
				const shareData = {
					name: this.$store.state.user.userInfo.nickName,
					avatar: this.$store.state.user.userInfo.avatarUrl,
					userId: this.$store.state.user.userInfo._id,
					type: this.type,
					content: this.content,
					images: imageIds,
					courseName: this.selectedCourse,
					postTime: new Date().toLocaleString()
				};
				
				console.log('提交的分享数据:', shareData);
				
				const { result } = await uniCloud.callFunction({
					name: 'postShare',
					data: shareData
				});
				
				if (result.code === 0) {
					uni.showToast({
						title: '发布成功',
						icon: 'success'
					});
					
					// 延迟返回，让用户看到成功提示
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 1500);
				} else {
					throw new Error(result.msg || '发布失败');
				}
				
			} catch (e) {
				console.error('发布失败:', e);
				uni.showToast({
					title: e.message || '发布失败',
					icon: 'none'
				});
			} finally {
				this.isSubmitting = false;
			}
		}
	}
}
</script>

<style lang="scss">
.share-container {
	min-height: 100vh;
	background-color: #f8f8f8;
	padding: 20rpx;
	position: relative; // 为固定定位的按钮提供参考
	
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		background-color: #ffffff;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
	}
	
	.content-section {
		background-color: #ffffff;
		border-radius: 12rpx;
		padding: 20rpx;
		
		.upload-section {
			margin: 30rpx 0;
			
			// 上传状态提示样式
			.upload-status {
				display: flex;
				align-items: center;
				margin-top: 20rpx;
				padding: 16rpx;
				background-color: rgba(41, 121, 255, 0.05);
				border-radius: 8rpx;
				
				.status-text {
					margin-left: 10rpx;
					font-size: 24rpx;
					color: #2979ff;
				}
			}
			
			// 自定义上传组件样式
			:deep(.u-upload) {
				.u-upload__button {
					border-radius: 12rpx !important;
					border: 2rpx dashed #dcdfe6 !important;
				}
				
				.u-upload__wrap__preview {
					border-radius: 12rpx;
					overflow: hidden;
					border: 2rpx solid #f2f2f2;
					
					&__image {
						border-radius: 12rpx;
					}
					
					&__delete {
						background-color: rgba(0, 0, 0, 0.6);
						border-radius: 50%;
						top: 10rpx;
						right: 10rpx;
					}
					
					// 上传状态覆盖层
					&__status {
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background-color: rgba(0, 0, 0, 0.5);
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						color: #ffffff;
						border-radius: 12rpx;
						
						.u-loading {
							margin-bottom: 10rpx;
						}
					}
				}
			}
		}
		
		.course-select {
			border-top: 2rpx solid #f5f5f5;
			padding-top: 30rpx;
			
			.select-title {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				
				text {
					font-size: 28rpx;
					color: #333333;
					margin-left: 10rpx;
					
					.required {
						color: #ff4d4f;
						margin-left: 4rpx;
					}
				}
			}
			
			.selected-course {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20rpx;
				background-color: #f8f8f8;
				border-radius: 8rpx;
				
				text {
					font-size: 28rpx;
					color: #333333;
					
					&.placeholder {
						color: #999999;
					}
				}
			}
		}
	}
	
	// 发布按钮样式
	.publish-button {
		position: fixed;
		right: 40rpx;
		top: 40rpx;
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
		
		:deep(.u-button) {
			box-shadow: 0 4rpx 16rpx rgba(41, 121, 255, 0.4);
			transition: all 0.3s ease;
			
			&:active {
				transform: scale(0.95);
				box-shadow: 0 2rpx 8rpx rgba(41, 121, 255, 0.3);
			}
			
			&.u-button--disabled {
				opacity: 0.7;
				background: #a0cfff !important;
			}
		}
	}
}
</style>
