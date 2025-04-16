'use strict';
const db = uniCloud.database();
const dbCmd = db.command;
const $ = db.command.aggregate;

exports.main = async (event, context) => {
	const { courseId, page = 1, pageSize = 10 } = event;
	
	// 参数验证
	if (!courseId) {
		return {
			code: 1,
			message: '课程ID不能为空'
		}
	}
	
	try {
		// 获取评论总数
		const countResult = await db.collection('courseComments')
			.where({
				courseId: courseId
			})
			.count();
			
		const total = countResult.total;
		
		// 获取评论列表
		const { data } = await db.collection('courseComments')
			.where({
				courseId: courseId
			})
			.orderBy('time', 'desc') // 按时间倒序
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.get();
			
		// 计算评分统计
		const ratingStatsResult = await db.collection('courseComments')
			.aggregate()
			.match({
				courseId: courseId
			})
			.group({
				_id: '$rating',
				count: $.sum(1)
			})
			.end();
			
		// 处理评分统计数据
		const ratingCounts = {};
		let totalRating = 0;
		
		if (ratingStatsResult.data) {
			ratingStatsResult.data.forEach(item => {
				ratingCounts[item._id] = item.count;
				totalRating += Number(item._id) * item.count;
			});
		}
		
		// 计算平均评分
		const averageRating = total > 0 ? (totalRating / total).toFixed(1) : '0.0';
		
		// 计算各星级百分比
		const ratingPercentages = [];
		for (let i = 5; i >= 1; i--) {
			const percentage = total > 0 ? Math.round((ratingCounts[i] || 0) / total * 100) : 0;
			ratingPercentages.push({
				star: i,
				percentage: percentage
			});
		}
		
		return {
			code: 0,
			message: '获取成功',
			data: {
				list: data,
				total,
				averageRating,
				ratingStats: ratingPercentages,
				pageSize,
				page
			}
		}
		
	} catch (e) {
		console.error('获取评论失败:', e);
		return {
			code: 500,
			message: '获取评论失败'
		}
	}
};
