'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const { courseId, userId, mobile, date } = event;
	const collection = db.collection('reserve');
	
	try {
		console.log('收到的参数：', { courseId, userId, mobile, date });
		
		// 查找课程
		const course = await collection.where({
			courseId: courseId
		}).get();
		
		console.log('查询到的课程：', course);
		
		if (!course.data || course.data.length === 0) {
			return {
				code: 1,
				msg: '课程不存在'
			}
		}
		
		const courseData = course.data[0];
		
		// 检查日期是否可预约
		if (!courseData.availableDays.includes(date)) {
			return {
				code: 1,
				msg: '该日期不可预约'
			}
		}
		
		// 直接添加预约记录
		const updateResult = await collection.doc(courseData._id).update({
			userInfo: db.command.push([{
				userId,
				mobile,
				date
			}])
		});
		
		console.log('更新结果：', updateResult);
		
		if (updateResult.updated === 1) {
			return {
				code: 0,
				msg: '预约成功'
			}
		} else {
			return {
				code: 1,
				msg: '预约失败，请重试'
			}
		}
		
	} catch (error) {
		console.error('预约失败：', error);
		return {
			code: 1,
			msg: '预约失败，请重试'
		}
	}
};
