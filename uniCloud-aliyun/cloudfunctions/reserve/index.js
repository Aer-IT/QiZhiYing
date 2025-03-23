'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	return await db.collection('user').doc(event._id).update({
		reserveday: event.day
	});
};
