'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	return await db.collection('reserve').where({
		courseId:event.id
	}).get();
};
