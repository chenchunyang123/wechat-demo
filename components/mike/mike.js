const app = getApp();
let disY = 0;  // 手指按下到松开y方向上移动的距离
const DIS_MAX = 50;  // 取消录音的最大Y方向距离
let touchTime = 0;  // 按下麦克风的时间
const TOUCHTIME_MAX = 500;  // 按下麦克风去识别的最小时间间隔(毫秒)
const recorderManager = wx.getRecorderManager();    // 获取录音管理器
let lock = false;   // 定义一个锁，判断处不处理语音
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        ifSpeak: false,  // 是否正在语音输入
    },

    lifetimes: {
        created() {
            // 监听录音结果
            recorderManager.onStop(res => {
                if (lock) {
                    return;
                }
                this.triggerEvent('mikeResult', res);
            })
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleTouchStart(e) {
            wx.authorize({
                scope: 'scope.record',
                success() {
                    console.log(2)
                },
                fail(e) {
                    console.log(e)
                }
            })
            // 保存手指y位置
            disY = e.changedTouches[0].pageY;
            // 更新初始时间
            touchTime = new Date().getTime();
            // 改变输入状态
            this.setData({
                ifSpeak: true,
            })
            // 开始录音
            recorderManager.start({
                duration: 60000,    // 录音最大时间
                sampleRate: 16000,   // 采样率
                numberOfChannels: 1,   // 单声道
                format: 'wav'
            });
        },
        handleTouchEnd(e) {
            // 更新手指Y方向移动的距离
            disY = disY - e.changedTouches[0].pageY;
            // 计算手指松开和按下间的间隔时间
            touchTime = new Date().getTime() - touchTime;
            // 改变输入状态
            this.setData({
                ifSpeak: false,
            })
            // 结束录音
            recorderManager.stop();
            // 判断手指按下的时间
            if (touchTime < TOUCHTIME_MAX) {
                wx.showToast({
                    title: '说话时间太短',
                    icon: 'none',
                    duration: 700
                });
                lock =  true;
                return;
            } else {
                lock = false;
            }
            // 判断是否需要录音结果
            if (disY > DIS_MAX) {
                console.log('录音取消');
                lock = true;
                return;
            } else {
                lock = false;
            }
        }
    }
})
