'use strict';
 
// 小程序的AppID 和 AppSecret
const CONFIG = {
    appid: "wx502ac36341c1abb7",
    secret: "0303626bcb128a84f30839eeb92c23da"
};

// 创建user数据表实例
const db = uniCloud.database();
const user = db.collection('user');
 
// 生成token和校验token公共模块
// const { getToken, verifyToken } = require('wx-common');
 
exports.main = async (event, context) => {
    try {
        //获取用户openid和session_key
        const res = await uniCloud.httpclient.request('https://api.weixin.qq.com/sns/jscode2session', {
            method: 'GET',
            data: {
                appid: CONFIG.appid,
                secret: CONFIG.secret,
                js_code: event.code,// 客户端传递过来的code
                grant_type: 'authorization_code'
            },
            dataType: 'json'
        });

        //判断请求用户openid和session_key是否成功
        if (res.status === 200 && res.data.openid) {
            //成功返回的openid和session_key
            const wx_openid = res.data.openid;
            const wx_session_key = res.data.session_key;
            // 生成token
            // const token = getToken(wx_openid);

            //查询数据库判断用户是否已经注册 根据openid查找
            const res_user = await user.where({
                openid: wx_openid
            }).get();

            let userData;
            //用户未注册存储用户信息
            if (!res_user.data || res_user.data.length === 0) {
                const userInfo = event.userinfo;
                const addResult = await user.add({
					avatarUrl:"",
					nickName:"",
					gender:"",
                    openid: wx_openid,
                    mobile: "",
					history:[],
					reserveInfo:[],
					points: 0,
                    create_time: Date.now(),
					update_time: Date.now()
                });
                
                if (!addResult.id) {
                    throw new Error('添加用户失败');
                }
                
                userData = await user.doc(addResult.id).get();
            } else {
                //用户已经存在更新token和session_key
                await user.doc(res_user.data[0]._id).update({
                    // token: token,
                    update_time: Date.now()
                });
                
                userData = await user.doc(res_user.data[0]._id).get();
            }

            //将需要的个人信息返回到客户端
            return {
                code: 0,
                msg: '登录成功',
                data: userData.data.map(item => ({
                    avatarUrl: item.avatarUrl,
                    gender: item.gender,
                    nickName: item.nickName,
                    mobile: item.mobile || '',
					history:item.history,
					reserveInfo:item.reserveInfo,
					_id:item._id,
					points: item.points
                }))
            };
        } else {
            //获取用户openid和session_key失败响应客户端
            return {
                code: 500,
                msg: '获取微信服务失败',
                data: null
            };
        }
    } catch (error) {
        console.error('登录失败：', error);
        return {
            code: 500,
            msg: error.message || '服务器错误',
            data: null
        };
    }
};