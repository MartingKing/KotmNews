//index.js
//获取应用实例
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    title: '',
    content: '',
  },

  onLoad: function(params) {
    var that = this
    wx.showLoading({
        title: '加载中...',
        icon: 'loading'
      }),
      console.log('id==', params)
    wx.request({
      url: 'https://www.lizubing.com/article/index?id=' + params.id,
      data: {},

      success: function(res) {
        wx.hideLoading();
        var article = res.data.data.content;
        var detailtitle = res.data.data.title;
        WxParse.wxParse('article', 'html', article, that, 5);
        that.setData({
          title: detailtitle
        })
        console.log('请求结果：', res)
      }

    })
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
      
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

})