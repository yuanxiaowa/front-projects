import $ from 'jquery';
import '../../components/select/index';

export default ({
  tempInfo,
  tempItem,
  url,
  pid,
  cid,
  areaList
}) => {
  var Point = BMap.Point;
  var Marker = BMap.Marker;
  var map = new BMap.Map("map"); // 创建Map实例
  map.enableScrollWheelZoom();
  map.enableContinuousZoom();
  var icon = new BMap.Icon(__uri('../../images/marker.png'), new BMap.Size(23, 31));
  var opts = {
    width: 363, // 信息窗口宽度 
  }

  var $list = $('#list');
  var $pg = $list.next().children();
  var fns = [];
  var list = [];
  var curPage = 0;
  var pageLength = 3;
  var pageTotal = 0;
  $list.on('click', '.j-litem', function () {
    var $this = $(this);
    fns[$this.index() + curPage * pageLength]();
    $this.addClass('is-selected').siblings().removeClass('is-selected');
  });
  $pg.filter(':gt(0)').click(function () {
    var $this = $(this);
    if ($this.hasClass('is-disabled')) {
      return;
    }
    var index = $(this).index();
    // 上一页
    if (index === 1) {
      curPage--;
    } else {
      curPage++;
    }
    setPg();
  });

  function setPg() {
    var _list = list.slice(curPage * pageLength, (curPage + 1) * pageLength);
    var html = $.map(_list, (item, index) => tempItem(item, curPage * pageLength + index)).join('');
    $list.html(html);
    if (curPage === 0) {
      $pg.eq(1).addClass('is-disabled');
    } else {
      $pg.eq(1).removeClass('is-disabled');
    }
    if (pageTotal === 0 || curPage === pageTotal - 1) {
      $pg.last().addClass('is-disabled');
    } else {
      $pg.last().removeClass('is-disabled');
    }
    $pg.first().text(`${curPage+1}/${pageTotal}`);
  }

  function update(netList) {
    curPage = 0;
    fns = [];
    $.each(netList, (i, item) => {
      var point = new Point(item.lng, item.lat);
      var mk = new Marker(point, {
        icon
      });
      var infoWindow = new BMap.InfoWindow(tempInfo(item), opts); // 创建信息窗口对象    
      var fn = () => {
        map.openInfoWindow(infoWindow, point);
      };
      mk.addEventListener('click', fn)
      map.addOverlay(mk);
      fns.push(fn);
    });
    list = netList;
    pageTotal = Math.ceil(list.length / pageLength);
    $('.j-spot-num').text(list.length);
    if (netList.length > 0) {
      map.centerAndZoom(new Point(netList[0].lng, netList[0].lat), 12);
    }
    setPg(0);
    $list.children().first().click();
  }

  var $selects = $('.j-select');
  var data = {};
  var provs = [{
    value: '',
    text: '请选择'
  }];
  $.each(areaList, (k, v) => {
    var cities = [{
      value: '',
      text: '请选择'
    }];
    $.each(v.all_son, (k, v) => {
      cities.push({
        text: v.area_name,
        value: k,
        link: v.area_link
      })
    });
    provs.push({
      text: v.area_name,
      value: k
    });
    data[k] = cities;
  })

  var s1 = $selects.eq(0).select({
    initValue: pid,
    items: provs,
    onChange(id) {
      if (!id) {
        return;
      }
      s2.setItems(data[id])
    }
  });
  var $areaText = $('.j-areas-text');
  var s2 = $selects.eq(1).select({
    onChange(id) {
      if (!id) {
        return;
      }
      $areaText.html(`<a href="${s2.getData().link}" target="_blank">${s1.getText()},${s2.getText()}</a>`);
      $.ajax({
        url,
        dataType: 'json',
        method: 'post',
        data: {
          province_id: s1.getValue(),
          city_id: id
        }
      }).then(res => {
        update(res.data.list);
      });
    }
  });
  s1.triggerChange();
  s2.setValue(cid);
  return update;
}