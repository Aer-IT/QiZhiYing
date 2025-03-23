'use strict';
const db = uniCloud.database();
const command = uniCloud.command;
exports.main = async (event, context) => {
	return await db.collection('courses')
			.orderBy('createTime', 'desc')  // 使用orderBy替代where来实现降序
			.limit(5)
			.field({
				"displayImg":true,
				"_id":true
			})
			.get();
};
