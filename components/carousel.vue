<template>
	<view class="carousel-container">
		<swiper
			class="swiper"
			:autoplay="true"
			:interval="3000"
			:circular="true"
			@change="onChange"
			:style="{ height: height + 'rpx' }"
		>
			<swiper-item v-for="(item, index) in img" :key="index" @click="onClick(item)">
				<image 
					:src="item.image" 
					:mode="imgMode"
					class="swiper-image"
				/>
			</swiper-item>
		</swiper>
		
		<!-- 将指示器移到swiper外部 -->
		<view class="indicator-wrapper">
			<view 
				class="indicator-dot" 
				v-for="(item, index) in img" 
				:key="index"
				:class="{ active: current === index }"
			></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "carousel",
		props: {
			// 轮播图类型：course-课程, activity-活动, new-新品
			
			// 轮播图高度
			height: {
				type: [String, Number],
				default: 300
			},
			// 图片显示模式
			imgMode: {
				type: String,
				default: 'aspectFill'
			},
			// 修改img属性的定义
			img: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				current: 0, // 当前轮播图索引
			};
		},
		onLoad(){
			
		},
		methods: {
			// 点击轮播图
			onClick(item) {
				uni.navigateTo({
					url: `/pages/course/course?_id=${item._id}`
				})
				this.$emit('click', item)
			},
			// 轮播图切换
			onChange(e) {
				this.current = e.detail.current
				// 触发切换事件，传递索引给父组件
				this.$emit('change', e.detail.current)
			},
		}
	}
</script>

<style lang="scss" scoped>
.carousel-container {
	width: 100%;
	position: relative;
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
	
	.swiper {
		width: 100%;
		border-radius: 12rpx;
	}
	
	.swiper-image {
		width: 100%;
		height: 100%;
		border-radius: 12rpx;
	}
	
	.indicator-wrapper {
		position: absolute;
		bottom: 20rpx;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1;
		
		.indicator-dot {
			width: 12rpx;
			height: 12rpx;
			border-radius: 50%;
			background-color: rgba(255, 255, 255, 0.5);
			margin: 0 8rpx;
			transition: all 0.3s;
			
			&.active {
				width: 24rpx;
				border-radius: 6rpx;
				background-color: #ffffff;
			}
		}
	}
}
</style>