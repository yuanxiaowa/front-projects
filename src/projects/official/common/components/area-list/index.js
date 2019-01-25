import $ from 'jquery'
import '../select/index'

var $selects = $('.j-select');
$.ajax(API_URL + '/commonApi/region', {
  dataType: 'jsonp',
  jsonp: 'jsonp_callback',
  jsonpCallback: 'shopApi_commonApi_region',
  cache: true
}).then(res => {
  var data = {};
  var provs = $.map(res.p, node => {
    data[node.id] = [];
    return {
      text: node.name,
      value: node.id
    }
  });
  $.each(res.c, (_, node) => {
    data[node.pid].push({
      text: node.name,
      value: node.id
    })
  });
  var cityToAera = {};
  $.each(res.d, (_, node) => {
    var item = {
      text: node.name,
      value: node.id
    };
    if (!cityToAera[node.pid]) {
      cityToAera[node.pid] = [item]
    } else {
      cityToAera[node.pid].push(item)
    }
  })

  var s1 = $selects.eq(0).select({
    // initValue: pid,
    items: provs,
    onChange(id) {
      s2.setItems(data[id])
    }
  });
  var s2 = $selects.eq(1).select({
    onChange(id) {
      s3.setItems(cityToAera[id])
    }
  });
  var s3 = $selects.eq(2).select();
  s1.triggerChange();
});