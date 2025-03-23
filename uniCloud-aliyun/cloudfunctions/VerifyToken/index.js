'use strict';
const {getToken,verifyToken} = require('wx-common')
exports.main = async (event, context) => {
	return verifyToken(event.token);
};
