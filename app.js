//app.js
App({
    onLaunch: function () {
        let innerAudioContext = wx.createInnerAudioContext();   // 获得音频
        this.globalData.innerAudioContext = innerAudioContext;  // 设置全局的音频播放管理
    },
    globalData: {
        userInfo: null,          // 登录的用户信息
        innerAudioContext: null, // 音频管理
    },
    // 取全局变量
    setGlobalData(dataName, val) {
        this.globalData[dataName] = val;
    },
    // 设置全局变量
    getGlobalData(dataName) {
        return this.globalData[dataName];
    }
})