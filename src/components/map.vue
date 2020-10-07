<template>
  <div
    id="allmap"
    style="
        width: 100%;
        height:100%;
        overflow:hidden;"
  ></div>
</template>
<script>
import BMap from 'BMap'
export default {
  props: ['attr', 'location'],
  data () {
    return {
      locations: this.location,
      zoom: 11,
      attrs: this.attr
    }
  },
  mounted () {
    this.BaiduMap()
  },
  methods: {
    BaiduMap () {
      /** 地图初始化 start */
      var map = new BMap.Map('allmap') // 创建Map实例
      var point = new BMap.Point(this.locations.lng, this.locations.lat)
      map.centerAndZoom(point, 15) // 初始化地图,设置中心点坐标和地图级别
      /** 添加控件 */
      map.addControl(new BMap.NavigationControl())
      map.addControl(new BMap.ScaleControl())
      map.addControl(
        new BMap.OverviewMapControl({
          isOpen: true,
          anchor: BMAP_ANCHOR_BOTTOM_RIGHT
        })
      )
      map.addControl(new BMap.MapTypeControl())
      var myicon = new BMap.Icon(
        'https://api.map.baidu.com/img/markers.png', // 百度图片
        new BMap.Size(23, 25), // 视窗大小 // 视窗大小
        {
          offset: new BMap.Size(11, 25), // 指定定位位置
          imageOffset: new BMap.Size(0, 0 - 11 * 25) // 设置图片偏移
        }
      )

      var marker = new BMap.Marker(point, { icon: myicon })
      map.addEventListener('click', event => {
        point = event.point
      })
      // 把标注添加到地图上
      map.addOverlay(marker)
      marker.setAnimation(BMAP_ANIMATION_BOUNCE) // 跳动的动画
      map.setCurrentCity('深圳') // 设置地图显示的城市 此项是必须设置的
      map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
      var content = '<table>'
      // content = content + "<tr><td> 公司名称："+this.attrs.companyName+"</td></tr>";
      content =
        content + '<tr><td> 公司地址：' + this.attrs.address + '</td></tr>'
      // content =
      // content + "<tr><td> 公司简介：" + this.attrs.homepage + "</td></tr>";
      // content =
      //   content +
      //   "<tr><td> <img style='width:150px;height:100px;' src='" +
      //   this.attrs.companyLogo +
      //   "' /></td></tr>";
      content += '</table>'

      var opts = {
        width: 250, // 信息窗口宽度
        height: 100, // 信息窗口高度
        title: this.attrs.companyName // 信息窗口标题
      }
      var infowindow = new BMap.InfoWindow(content, opts) // 创建信息窗口对象
      map.openInfoWindow(infowindow, map.getCenter())
      marker.addEventListener('click', function () {
        this.openInfoWindow(infowindow, map.getCenter())
      })
    }
  }
}
</script>
<style>
/* 去掉地图左下角的百度LOGO */
.anchorBL {
  display: none;
}
</style>
