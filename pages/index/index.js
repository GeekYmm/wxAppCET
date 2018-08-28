// pages/index/index.js
var app = getApp();
var Bmob = require("../../utils/Bmob.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    id: '',
    code: '',
    img_url: "",
    isCode: false,
    array: [2018],
    index: 0,
    KGarray: ["上半年"],
    KGindex: 0,
    SLarray: ["四级", "六级"],
    SLindex: 0,
  },
  getUserName: function(e) {
    //console.log(e.detail.value);
    this.data.name = e.detail.value;
  },
  getUserId: function(e) {
    //console.log(e.detail.value);
    this.data.id = e.detail.value;
  },
  getCode: function(e) {
    //console.log(e.detail.value);
    this.data.code = e.detail.value;
  },
  subForm: function(e) {
    var that = this;
    console.log(this.data.name);
    console.log(Number(this.data.id));
    console.log(this.data.code);
    wx.request({
      url: 'https://www.wexcampus.com/cet/result?token=001002003',
      method: "POST",
      data: {
        number: Number(this.data.id),
        name: this.data.name,
        img_code: this.data.code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.code === 80001) {
          console.log(res.data.img_url);
          that.setData({
            isCode: true,
            img_url: res.data.img_url
          })
        } else if (res.data.code === 0) {
          console.log(res.data.result);
          wx.setStorageSync("result", res.data.result);
          wx.navigateTo({
            url: '/pages/result/result',
          });
          let params = {
            username: res.data.result.name,
            password: res.data.result.number,
            number: res.data.result.number,
            result: res.data.result,
          }
          Bmob.User.register(params).then(res => {
            console.log(res)
          }).catch(err => {
            console.log(err)
          });
        } else {
          that.getReCode(Number(that.data.id));
          wx.showModal({
            title: '查询错误！',
            content: res.data.message,
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },
  getReCode: function(id) {
    var that = this;
    wx.request({
      url: 'https://www.wexcampus.com/cet/change-img?number=' + id + '&token=001002003',
      method: 'GET',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data);

        that.setData({
          isCode: true,
          img_url: res.data.url
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.index = e.detail.value
    this.setData({
      index: e.detail.value
    })
  },
  bindKGPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.KGindex = e.detail.value
    this.setData({
      KGindex: e.detail.value
    })
  },
  bindSLPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.SLindex = e.detail.value
    this.setData({
      SLindex: e.detail.value
    })
  },
  formSubmit: function(e) {
    var that = this;
    var name = e.detail.value.name;
    var school = e.detail.value.school;
    var id_number = "18" + "1" + String(Number(this.data.SLindex) + 1);
    if (name != "" && school != "") {
      const query = Bmob.Query('Request');
      query.set("name", name)
      query.set("school", school)
      query.set("number", id_number)
      query.save().then(res => {
        console.log(res)
        wx.showModal({
          title: '提交成功！',
          content: '请联系客服或者微信：wxkf0666有偿获取成绩',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              name = "";
              school = "";
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }).catch(err => {
        console.log(err)
      })
    } else {
      wx.showModal({
        title: '提交失败！',
        content: '请检查姓名和学校是否填写正确',
      })
    }
  },

  onLoad: function(options) {
    // wx.request({
    //   url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/webimage',
    //   method: 'POST',
    //   data:{

    //   },
    //   header: {
    //     'content-type': 'application / x - www - form - urlencoded' // 默认值
    //   },

    // })
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

  }
})