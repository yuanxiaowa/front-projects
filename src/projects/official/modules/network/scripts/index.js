import f from '../../../common/scripts/partials/spot'

function get(item) {
  return `<span class="label-rating ${item.star}">${item.star_name}</span>`
}
var update = f({
  tempInfo(item) {
    return `<div class="mb-6">${item.name}${get(item)}</div>
    <div class="text-gray">地址：${item.address}<br>
    ${item.work_time?'营业时间：'+item.work_time+'<br>':''}
    ${item.phone?'电话：'+item.phone:''}</div>
    <p><a href="${item.link_url}" target="_blank">查看详情 &gt;</a></p>`;
  },
  tempItem(item, i) {
    return `<div class="list2__item row j-litem">
      <div class="row__left">${i+1}</div>
      <div class="row__content">
        <div class="mb-6">${item.name}${get(item)}</div>
        <div class="text-gray">${item.address}</div>
        <div class="text-right"><a href="${item.link_url}" target="_blank">查看详情 &gt;</a></div>
      </div>
    </div>`;
  },
  pid,
  cid,
  url: __api('/network/ajax-get-network-list'),
  areaList
});

update(netList);