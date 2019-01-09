// components/tab-view/tab-view.js
Component({

  options: {
    multipleSlots: true
  },

  properties: {
    tabs: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal) {
        var _that = this
        setTimeout(function() {
          _that._initCursor()
        }, 1)
      }
    },
    tabCenter: {
      type: Boolean,
      value: false
    },
    showCursor: {
      type: Boolean,
      value: true
    },
    cursorWidthMode: {
      type: String,
      value: 'normal'
    },
    cursorDeviate: {
      type: Number,
      value: 0,
      observer: function(newVal, oldVal) {
        if (newVal < 0) {
          this.setData({
            cursorDeviate: 0
          })
        } else if (newVal > 15) {
          this.setData({
            cursorDeviate: 15
          })
        }
        console.log(this.properties.cursorDeviate)
      }
    },
    color: {
      type: String,
      value: 'black'
    },
    selectedColor: {
      type: String,
      value: 'red'
    },
    tabBackgroundColor: {
      type: String,
      value: 'white'
    },
    highlight: {
      type: Boolean,
      value: true
    },
    duration: {
      type: Number,
      value: 250
    },
    componentStyle: String
  },

  data: {
    _cursorPosition: 0,
    _tabWidth: 0,
    _tabIndex: 0,
    _titleWidths: []
  },

  methods: {

    getSlotIds: function() {
      var ids = []
      for (var i = 0; i < this.properties.tabs.length; i++) {
        ids.push('tabviewpage' + i)
      }
      return ids
    },

    _initCursor: function() {
      var _that = this
      if (!_that.properties.showCursor) {
        return
      }
      if (!wx.createSelectorQuery) {
        throw new Error('当前基础库版本小于1.6.0，不支持tab-view组件')
        return
      }
      if (Object.prototype.toString.call(_that.properties.tabs) != '[object Array]' || _that.properties.tabs.length < 2) {
        // throw new Error('Length must more then 1 before component ready.')
        return
      }
      var query = wx.createSelectorQuery().in(_that)
      query.select('#tab').boundingClientRect()
      query.select('#cursor').boundingClientRect()
      if (_that.properties.cursorWidthMode == 'title') {
        for (var i = 0; i < _that.properties.tabs.length; i++) {
          query.select('#tabTitle' + i).boundingClientRect()
        }
      }
      query.exec(function(res) {
        if (Object.prototype.toString.call(res) != '[object Array]' || res.length == 0 || res[0] == null) {
          return
        }
        if (_that._tabAnimation) {
          _that._tabAnimation.translateX(0 + 'px').step()
          _that.setData({
            _cursorPosition: 0,
            _tabWidth: 0,
            _tabIndex: 0,
            _titleWidths: [],
            _tabAnimation: _that._tabAnimation.export()
          })
        }
        if (_that.properties.cursorWidthMode == 'title') {
          var titleWidths = []
          for (var i = 2; i < _that.properties.tabs.length + 2; i++) {
            titleWidths.push(res[i].width)
          }
          _that.setData({
            _cursorPosition: res[0].left + (res[0].width - titleWidths[0]) / 2,
            _tabWidth: res[0].width,
            _titleWidths: titleWidths
          })
        } else if (_that.properties.cursorWidthMode == 'tab') {
          _that.setData({
            _tabWidth: res[0].width,
            _cursorPosition: res[0].width * (_that.properties.tabCenter ? _that.data._tabIndex + 1 : _that.data._tabIndex)
          })
        } else {
          _that.setData({
            _tabWidth: res[0].width,
            _cursorPosition: res[0].left + (res[0].width - res[1].width) / 2
          })
        }
      })
      _that._tabAnimation = wx.createAnimation({
        duration: _that.properties.duration,
        transformOrigin: "50% 50%",
        timingFunction: 'ease'
      })
    },

    _swicthTabEvent: function(e) {
      this._pageChangeEvent(e)
    },

    _pageChangeEvent: function(e) {
      var index = e.type == 'tap' ? e.currentTarget.dataset.index : e.detail.current
      if (this.data._tabIndex != index) {
        if (this.properties.showCursor && this._tabAnimation) {
          if (this.properties.cursorWidthMode == 'title') {
            var x = 0
            if (index > 0) {
              x = (this.data._titleWidths[0] - this.data._titleWidths[index]) / 2 + this.data._tabWidth * index
            }
            this._tabAnimation.translateX(x + 'px').step()
          } else {
            this._tabAnimation.translateX(this.data._tabWidth * index + 'px').step()
          }
          this.setData({
            _tabIndex: index,
            _tabAnimation: this._tabAnimation.export()
          })
        } else {
          this.setData({
            _tabIndex: index
          })
        }
        this.triggerEvent('pagechange', {
          'index': index,
          'id': 'tabviewpage' + index,
          'value': this.properties.tabs[index]
        }, {})
      }
    },

    _scrolltolowerEvent: function(e) {
      this.triggerEvent('scrolltobottom', {
        'direction': e.detail.direction,
        'index': this.data._tabIndex,
        'id': 'tabviewpage' + this.data._tabIndex,
        'value': this.properties.tabs[this.data._tabIndex]
      }, {})
    }

  }
})