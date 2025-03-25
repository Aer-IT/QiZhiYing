'use strict';

exports.main = async (event, context) => {
	try {
		// 获取客户端上传的参数
		console.log('event : ', event);
		
		// 如果是通过uniCloud.uploadFile直接上传的文件，无需在云函数中处理
		// 云函数可以用来处理文件元数据或权限
		
		// 如果需要对文件进行处理，可以使用uniCloud.getFileInfo获取文件信息
		if (event.fileID) {
			const fileInfo = await uniCloud.getFileInfo({
				fileList: [event.fileID]
			});
			
			// 返回文件信息和状态
			return {
				code: 0,
				message: '上传成功',
				fileInfo: fileInfo.fileList[0],
				fileID: event.fileID
			};
		}
		
		// 如果没有文件ID，返回错误
		return {
			code: 1,
			message: '未检测到上传的文件'
		};
	} catch (e) {
		// 发生错误时返回错误信息
		return {
			code: -1,
			message: '上传处理失败',
			error: e.message
		};
	}
};
