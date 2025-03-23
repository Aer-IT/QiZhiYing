'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//添加日志输出便于调试
	console.log('接收到的参数:', event);
	
	//将字符串类型的参数转换为数字类型
	const query = {
		type: event.type,
		sectype: event.sectype
	};
	
	console.log('查询条件:', query);
	
	return await db.collection('courses').where(query).get();
};
