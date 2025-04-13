'use strict';

const db = uniCloud.database();
const $ = db.command.aggregate;

exports.main = async (event, context) => {
	try {
		// 获取请求参数
		const { page = 1, pageSize = 5, type } = event;
		
		// 计算跳过的数量
		const skipCount = (page - 1) * pageSize;
		
		// 构建查询条件
		let query = {};
		
		// 如果指定了类型，添加到查询条件中
		if (type !== undefined) {
			query.type = type;
		}
		
		// 执行聚合查询
		const listResult = await db.collection('shares')
			.where(query)
			.orderBy('createTime', 'desc') // 按创建时间降序排列，最新的在前面
			.skip(skipCount)
			.limit(pageSize)
			.get();
			
		// 获取总记录数
		const countResult = await db.collection('shares')
			.where(query)
			.count();
		
		// 计算总页数
		const total = countResult.total;
		const totalPages = Math.ceil(total / pageSize);
		
		// 处理查询结果
		const items = listResult.data || [];
		
		// 格式化返回结果
		for (let i = 0; i < items.length; i++) {
			// 处理时间格式
			if (items[i].createTime) {
				const createTime = new Date(items[i].createTime);
				items[i].time = `${createTime.getFullYear()}-${String(createTime.getMonth() + 1).padStart(2, '0')}-${String(createTime.getDate()).padStart(2, '0')}`;
			} else {
				items[i].time = items[i].postTime || '-';
			}
			
			// 确保必须的字段存在
			items[i].id = items[i]._id;
			items[i].nickname = items[i].nickname || '匿名用户';
			items[i].avatar = items[i].avatar || '/static/images/avatar.png';
			items[i].content = items[i].content || '';
			items[i].images = items[i].images || [];
			items[i].courseName = items[i].courseName || '';
		}
		
		return {
			code: 0,
			msg: '获取成功',
			data: items,
			page,
			pageSize,
			total,
			totalPages,
			hasMore: page < totalPages
		};
	} catch (e) {
		console.error('获取分享内容列表失败:', e);
		return {
			code: 500,
			msg: '获取列表失败',
			error: e.message
		};
	}
}; 