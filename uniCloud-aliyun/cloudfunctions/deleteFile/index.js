'use strict';

// 云函数入口函数
exports.main = async (event, context) => {
	try {
		// 检查参数
		if (!event.fileList || !Array.isArray(event.fileList) || event.fileList.length === 0) {
			return {
				code: 1,
				message: '缺少有效的fileList参数'
			};
		}
		
		// 调用云存储的删除文件API
		const result = await uniCloud.deleteFile({
			fileList: event.fileList
		});
		
		console.log('删除文件结果:', result);
		
		// 检查是否有删除失败的文件
		if (result.fileList) {
			const failedFiles = result.fileList.filter(file => file.code !== 0);
			
			if (failedFiles.length > 0) {
				return {
					code: 2,
					message: '部分文件删除失败',
					fileList: result.fileList,
					failedFiles
				};
			}
		}
		
		// 全部删除成功
		return {
			code: 0,
			message: '删除成功',
			fileList: result.fileList
		};
	} catch (e) {
		console.error('删除文件出错:', e);
		return {
			code: -1,
			message: '删除文件处理失败',
			error: e.message
		};
	}
}; 