// pages/login/login.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    // 获取用户信息权限
    getInfo(e) {
        if (e.detail.userInfo) {
            // 允许则设置用户信息
            app.setGlobalData('userInfo', e.detail.userInfo);
            // 然后获取语音输入权限
            if (app.getGlobalData('canUseMike')) {
                // 已授权语音输入
                wx.redirectTo({
                    url: '/pages/chat/chat',
                })
            } else {
                // 未授权语音输入，发起授权
                wx.authorize({
                    scope: 'scope.record',
                    complete: () => { // 允许拒绝都会执行
                        wx.redirectTo({
                            url: '/pages/chat/chat',
                        })
                    }
                })
            }
        } else {
            // 拒绝不进行任何处理
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})