const app = getApp
const util = require('../../utils/util.js')

var list_type = ["thinking", "ambition", "businessModels", "girl", "boy"]
var mIndex = 0
var articalData = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['思维', '格局', '商业模式', '撩妹', '撩汉'],
    offset: 1,
    newsList: [],
    isloading: true,
    hasmore: true,
    newsdatasize: 0,
    issureTime: '',
    currentIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    this.mytabview = this.selectComponent('#mytabview')

    this.requestData(mIndex)
    this.setData({
      slotIds: this.mytabview.getSlotIds(),
    })
  },

  pageChangeEvent: function(e) {
    mIndex = e.detail.index
    console.log('当前索引：', mIndex)
    //articalData是上啦加载缓存的所有数据，页面切换的时候要置空，否则新的tab页面加载的也是上一个tab的数据 
    articalData = []
    //offset也需要重置为1否则之前的页面会缓存
    this.setData({
      offset: 1
    })
    this.requestData(mIndex)
  },
  requestData: function(index) {
    var that = this
    console.log('offset:', this.data.offset)
    // wx.showLoading({
    //     title: '加载中...',
    //     icon: 'loading'
    //   }),
      wx.request({
        url: 'https://www.lizubing.com/article/list',
        method: 'GET',
        data: {
          articleType: list_type[index],
          pageNo: this.data.offset,
          pageSize: 10,
        },

        success: function(res) {
          // wx.hideLoading()
          wx.stopPullDownRefresh()

          var pageList = res.data.data.list
          console.log('pageList:', pageList)
          for (var i in pageList) {
            articalData.push(pageList[i])
          }

          that.setData({
            newsdatasize: res.data.data.total,
            newsList: articalData,
            isloading: false,
            issureTime: util.formatTimeTwo(res.data.timestamp, 'Y/M/D h:m:s')
          })
          console.log('articalData:', articalData)
        }

      })

  },
  scrolltobottomEvent: function(e) {
    var that = this
    mIndex = e.detail.index
    var dataLength = articalData.length
    var totalSize = that.data.newsdatasize
    var isHasnext = dataLength < totalSize
    var pagesize = this.data.offset
    this.setData({
      hasmore: isHasnext,
      isloading: true,
      offset: pagesize + 1
    })
    if (isHasnext) {
      this.requestData(mIndex)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // wx.startPullDownRefresh()
    this.requestData(mIndex)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
})