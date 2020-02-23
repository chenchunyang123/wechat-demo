const { formatTime } = require('../../utils/util.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        getScopeLoad: true,     // true为读取权限信息中，false为读取完毕并且已获得用户权限信息
        dialogArr: [],          // 对话流，num=0为问（type=text文字，type=voice语音），num=1为回答（type=text一般文字内容，type=moreQuestions）,num=2为文案提示信息
        scrollTop: 0,           // 聊天框的scrollTop值
        mask: false,            // 控制让转文字按钮消失的浮层的显隐
        hiWords: '',            // 打招呼的时间判断
    },

    // 滚到聊天框底部
    scrollToBottom() {
        this.setData({
            scrollTop: 99999,
        })
    },

    // 获取权限情况，看跳不跳转登录页
    getScopeInfo() {
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权获取用户信息
                    wx.hideLoading();
                    wx.getUserInfo({
                        success: res => {
                            // 获取用户信息后保存
                            app.setGlobalData('userInfo', res.userInfo);
                            this.setData({
                                getScopeLoad: false,
                            })
                            // 这时候再去开始渲染对话信息
                            this.renderDialog();
                        }
                    })
                } else {
                    // 未授权用户信息
                    wx.redirectTo({
                        url: '/pages/login/login',
                    })
                }
                if (res.authSetting['scope.record']) {
                    // 已经授权录音
                    app.setGlobalData('canUseMike', true);
                } else {
                    // 未授权录音
                }
            }
        })
    },

    // 开始渲染对话信息
    renderDialog() {
        // 获得时间
        let nowHour = new Date().getHours();
        let newHiWords;
        if (nowHour === 12) {
            newHiWords = '中午';
        } else if (nowHour > 5 && nowHour < 12) {
            newHiWords = '上午';
        } else if (nowHour > 12 && nowHour < 18) {
            newHiWords = '下午';
        } else if (nowHour >= 18 || nowHour <= 5) {
            newHiWords = '晚上';
        }
        // 渲染对话
        this.setData({
            hiWords: newHiWords,
            dialogArr: [
                {
                    num: 1, 
                    type: 'text', 
                    value: '华小来为您准备了汽车的使用小贴士，您如果遇到汽车的使用题，可以直接语音提问哦～了解爱车变得更方便，更快捷，更贴心。' 
                },
                { num: 1, type: 'moreQuestions', list: ['我的车加什么油？', '怎么安装', '如何使用行车记录仪'] },
                // {num: 0, type: 'text', value: '阿双方均卡萨合肥市飞机撒粉红色快捷键开始放假是多少'}
                { num: 0, type: 'voice', sec: 60 },
                {num: 0, type: 'voice', text: 'jdfakfaljfskljfsdlfjlsdfjsdfslflklajfklsjfsldjfslfjsfsfsldkfjsdlj'},
            ]
        })
    },

    // 监听语音输入结果
    onMikeResult(res) {
        let { tempFilePath, duration } = res.detail;
        let s = Math.round(duration / 1000);  // 转换成秒并四舍五入
        // 更新data对话流，先展示语音
        this.setData({
            dialogArr: this.data.dialogArr.concat({
                num: 0,
                type: 'voice',
                url: tempFilePath,
                sec: s,
                text: '',
                loading: true,  // 是否正在转换成文字
                error: false,   // 是否转换错误
            }),
        })
        // 滚动底部
        this.scrollToBottom();
        // 语音翻译文字
        wx.uploadFile({
            url: 'http://115.182.62.182:2020/asr_engines_1.0?asr_engine=Baidu&file_format=wav&file_rate=16000',
            filePath: tempFilePath,
            name: 'file',
            complete: (res) => {
                console.log(res)
                let idx = this.data.dialogArr.findIndex(item => item.url === tempFilePath); // 拿到当前语音对应值的索引
                try {
                    if (res.statusCode === 200) {
                        let { return_code, result } = JSON.parse(res.data);
                        if (return_code == 200) {   // return_code为字符串
                            let text = result[0];   // 转换的文字结果
                            // 更新语音对应的text结果
                            this.setData({
                                [`dialogArr[${idx}].text`]: text,
                                [`dialogArr[${idx}].loading`]: false,
                            })
                        } else {
                            throw new Error('语音转文字错误');
                        }
                    } else {
                        throw new Error('语音转文字错误');
                    }
                } catch (e) {
                    console.log(e);
                    // 更新语音对应的error结果
                    this.setData({
                        [`dialogArr[${idx}].loading`]: false,
                        [`dialogArr[${idx}].error`]: true,
                    })
                }
            }
        })
    },

    // 监听渲染文字提问
    onAskAsText(text) {
        this.setData({
            dialogArr: this.data.dialogArr.concat({
                num: 0,
                type: 'text',
                value: text.detail
            })
        })
        this.scrollToBottom();
    },

    // 把文字提问传给后台拿结果
    getRobotAnswer() {

    },

    // 让浮层显示--传递给子的
    letMaskDisplay() {
        this.setData({
            mask: true
        })
    },

    // 让浮层隐藏--传递给子的
    letMaskHidden() {
        this.setData({
            mask: false
        })
    },

    // 点浮层让浮层消失
    handleMaskHidden() {
        this.setData({
            mask: false
        })
        // 让转按钮消失
        let cs = this.selectAllComponents('.voice');
        cs && cs.forEach(item => item.setData({ toTextBtn: false }));
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中...',
        })
        this.getScopeInfo();
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