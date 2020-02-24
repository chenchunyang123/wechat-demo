// components/ask/ask.js
import Toast from '@vant/weapp/toast/toast';
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        type: String,   // 提问消息类型
        value: String,  // 文字消息内容
        url: String,    // 语音链接
        sec: Number,    // 语音的秒数
        text: String,   // 转换的文字
        loading: Boolean,   // 是否正在转换成文字
        error: Boolean, // 是否转换错误
        ifPlaying: Boolean,   // 是否语音正在播放
    },

    /**
     * 组件的初始数据
     */
    data: {
        toTextBtn: false,   // 转文字按钮是否显示
        textResult: false,  // 转文字结果是否显示
        ifChoose: false,    // 按住声音组件和弹出“转文字”按钮时，控制组件背景颜色是否变化
    },

    lifetimes: {
        created() {
            app.getGlobalData('innerAudioContext').onEnded(() => {
                if (this.data.ifPlaying) {  // 如果当前音频的状态为正在播放，则设置成停止播放
                    this.triggerEvent('voiceEnded');
                }
            })
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleLongPress() {
            wx.vibrateShort();
            this.setData({
                toTextBtn: true,
            })
            this.triggerEvent('maskDisplay');
        },
        handleToText() {
            let { loading, error } = this.data;
            if (!loading && error) {    // 已经识别完成并且无法识别
                Toast({
                    duration: 3000,
                    message: '语音无法识别，转文字失败'
                });
            }
            this.setData({
                textResult: true,
                toTextBtn: false,
            })
            this.triggerEvent('maskHidden');
            this.triggerEvent('toBottom');
        }, 
        // 播放或停止
        handleSwitch() {
            let innerAudioContext = app.getGlobalData('innerAudioContext');
            innerAudioContext.stop();   // 开始播放前先停止上一个播放
            innerAudioContext.src = this.data.url;
            innerAudioContext.play();
            // 改变正在播放的语音状态
            this.triggerEvent('changePlayingVoice', this.data.url);
        },
        // 开始按住声音组件
        handleVoiceStart() {
            this.setData({
                ifChoose: true
            })
        },
        // 结束按声音组件
        handleVoiceEnd() {
            this.setData({
                ifChoose: false
            })
        }
    }
})
