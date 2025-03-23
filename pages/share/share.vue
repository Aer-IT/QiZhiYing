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
				></u-upload>
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
			const { file } = event.file;
			// 处理文件上传
			try {
				const result = await uniCloud.uploadFile({
					filePath: file.url,
					cloudPath: `share/${Date.now()}-${Math.random().toString(36).slice(-6)}.${file.url.split('.').pop()}`
				});
				
				// 更新文件列表
				const newFile = {
					...file,
					url: result.fileID, // 使用上传后的文件ID
					status: 'success'
				};
				this.fileList.push(newFile);
				
			} catch (e) {
				uni.showToast({
					title: '图片上传失败',
					icon: 'none'
				});
			}
		},
		
		// 删除图片
		deletePic(event) {
			this.fileList.splice(event.index, 1);
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
				
				const shareData = {
					type: this.type,
					content: this.content,
					images: this.fileList.map(file => file.url),
					courseName: this.selectedCourse.name
				};
				
				const { result } = await uniCloud.callFunction({
					name: 'createShare',
					data: shareData
				});
				
				if (result.code === 0) {
					uni.showToast({
						title: '发布成功',
						icon: 'success'
					});
					
					// 延迟返回，让用户看到成功提示
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/InteractionDetails/InteractionDetails'
						})
					}, 1500);
				} else {
					throw new Error(result.message);
				}
				
			} catch (e) {
				uni.showToast({
					title: '发布失败',
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
