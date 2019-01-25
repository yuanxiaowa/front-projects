export default detail => {
  var Point = BMap.Point;
  var Marker = BMap.Marker;
  var map = new BMap.Map('map');
  map.enableScrollWheelZoom();
  map.enableContinuousZoom();
  var icon = new BMap.Icon(__uri('../../images/marker.png'), new BMap.Size(23, 31));
  var opts = {
    width: 363, // 信息窗口宽度 
  }
  var point = new Point(detail.lng, detail.lat);
  var geoc = new BMap.Geocoder();
  map.centerAndZoom(point, 12);
  let mk = new Marker(point, {
    icon
  });
  geoc.getLocation(point, function (rs) {
    var addComp = rs.addressComponents;
    let infoWindow = new BMap.InfoWindow(`
    <div class="mb-6">${detail.name}</div>
    <div class="text-gray">地址：${addComp.province + addComp.city + addComp.district + detail.address}<br>
    ${detail.work_time?'营业时间：'+detail.work_time+'<br>':''}
    ${detail.phone?'电话：'+detail.phone:''}
    ${/* detail.traffic?'<br>交通方式：'+detail.traffic:'' */''}</div>`, opts); // 创建信息窗口对象
    mk.addEventListener('click', () => {
      map.openInfoWindow(infoWindow, point);
    })
    map.openInfoWindow(infoWindow, point);
  });

  map.addOverlay(mk);
}