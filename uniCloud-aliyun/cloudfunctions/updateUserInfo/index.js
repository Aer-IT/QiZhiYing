'use strict';
const db = uniCloud.database();
const dbCmd = db.command;

// 定义错误类型
const ErrorType = {
	PARAMS_ERROR: { code: 1001, message: '参数错误' },
	DB_ERROR: { code: 2001, message: '数据库操作失败' },
	NOT_FOUND: { code: 2002, message: '用户不存在' }
};

// 参数验证函数
function validateParams(params) {
	const { _id } = params;
	if (!_id) {
		throw { ...ErrorType.PARAMS_ERROR, message: '用户ID不能为空' };
	}
	
	// 验证手机号格式
	if (params.phoneNumber && !/^1[3-9]\d{9}$/.test(params.phoneNumber)) {
		throw { ...ErrorType.PARAMS_ERROR, message: '手机号格式不正确' };
	}
	
	// 验证昵称长度
	if (params.nickName && (params.nickName.length < 2 || params.nickName.length > 12)) {
		throw { ...ErrorType.PARAMS_ERROR, message: '昵称长度应在2-12个字符之间' };
	}
}

// 构建更新对象
function buildUpdateData(event) {
	const updateData = {};
	
	if (event.reserveInfo) {
		updateData.reserveInfo = event.reserveInfo;
	}
	
	if (event.nickName) {
		updateData.nickName = event.nickName;
	}
	
	if (event.phoneNumber) {
		updateData.mobile = event.phoneNumber;
	}
	
	// 添加更新时间
	updateData.updateTime = Date.now();
	
	return updateData;
}

exports.main = async (event, context) => {
	try {
		// 参数验证
		validateParams(event);
		
		// 检查用户是否存在
		const userCheck = await db.collection('user')
			.doc(event._id)
			.field({ _id: true })
			.get();
			
		if (!userCheck.data || userCheck.data.length === 0) {
			throw ErrorType.NOT_FOUND;
		}
		
		// 构建更新数据
		const updateData = buildUpdateData(event);
		
		// 执行更新操作
		const result = await db.collection('user')
			.doc(event._id)
			.update(updateData);
			
		if (result.updated === 1) {
			// 获取更新后的用户数据
			const updatedUser = await db.collection('user')
				.doc(event._id)
				.field({ nickName: 1, mobile: 1, avatar: 1 })
				.get();
				
			return {
				code: 0,
				message: '更新成功',
				updated: 1,
				data: updatedUser.data[0]
			};
		} else {
			throw ErrorType.DB_ERROR;
		}
		
	} catch (error) {
		// 统一错误处理
		console.error('updateUserInfo error:', error);
		return {
			code: error.code || 500,
			message: error.message || '服务器内部错误',
			updated: 0
		};
	}
};	
