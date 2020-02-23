// components/ans/ans.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        type: String,
        value: String,  // 文字内容
        list: Array,    // 更多问题列表
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleAskAsText(e) {
            let text = e.currentTarget.dataset.item;
            this.triggerEvent('askAsText', text);
        }
    }
})
