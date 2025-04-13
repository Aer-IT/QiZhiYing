'use strict';
const db = uniCloud.database();
const shareCollection = db.collection('shares'); // 分享内容集合

exports.main = async (event, context) => {
	try {
		console.log('接收到的分享数据:', event);
		
		// 获取当前用户ID，允许为空
		const userId = event.userId || 'anonymous';
		
		// 验证必要字段
		if (!event.content && (!event.images || event.images.length === 0)) {
			return {
				code: 400,
				msg: '分享内容不能为空'
			};
		}
		
		// 构建分享记录
		const shareRecord = {
			userId: userId,
			nickname: event.name || '匿名用户', // 原代码中是 nanme，保持一致
			avatar: event.avatar || '',
			type: event.type || 1, // 1-自然笔记，2-亲子时光
			content: event.content || '',
			images: event.images || [],
			courseName: event.courseName || '',
			createTime: new Date(),
			postTime: event.postTime || new Date().toLocaleString()
		};
		
		// 保存到数据库
		const result = await shareCollection.add(shareRecord);
		
		return {
			code: 0,
			msg: '分享成功',
			data: {
				id: result.id,
				...shareRecord
			}
		};
		
	} catch (e) {
		console.error('分享内容保存失败:', e);
		return {
			code: 500,
			msg: '分享失败，服务器错误',
			error: e.message
		};
	}
}; 