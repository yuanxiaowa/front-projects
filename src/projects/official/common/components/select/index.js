import $ from 'jquery'

function getContent(items) {
  return $.map(items, item => `<li class="select__item" data-id="${item.value}">${item.text}</li>`).join('');
}

$.fn.select = function (opts = {}) {
  if (this.length === 0) {
    return this;
  }
  if (this.length > 1) {
    return this.each(function () {
      $(this).select(opts);
    })
  }
  var __select = this.data('__select');
  if (__select) {
    return __select;
  }
  var $select = this;
  var text;
  var value = opts.initValue;
  var items = opts.items
  var index = 0;
  if (!items) {
    items = $.map(this.children(), ele => ({
      value: ele.value,
      text: ele.textContent
    }));
  } else {
    $select.append($.map(items, item => `<option value="${item.value}">${item.text}</option>`))
  }
  if (!value) {
    value = this.val();
    text = this.find('option:selected').text();
    index = this.prop('selectedIndex');
  } else {
    $.each(items, (i, item) => {
      if (item.value == value) {
        text = item.text;
        index = i;
      }
    })
    if (!text) {
      text = items[0].text;
    }
  }
  var _html = getContent(items);
  var $con = $(`<div class="select">
  <div class="select__text">${text}</div>
  <ul class="select__layer">${_html}</ul>
</div>`);
  var onChange = (v, t) => {
    $select.trigger('blur');
    return (opts.onChange || $.noop)(v, t);
  };
  this.replaceWith($con);
  $con.prepend(this);
  var $text = $con.find('.select__text');
  var $layer = $con.find('.select__layer');
  $text.click(false);
  $text.text(text);
  $text.click(() => {
    $layer.slideDown();
  });
  $layer.on('click', '.select__item', function (e) {
    var $this = $(this);
    var v = $this.data('id');
    e.stopPropagation();
    $layer.hide();
    if (v == value) {
      return;
    }
    index = $this.index();
    value = v;
    text = $this.text();
    $text.text(text);
    $select.val(value);
    $select.trigger('blur');
    onChange(value, text);
  });
  $('body').click(() => $layer.slideUp());
  __select = {
    setItems(_items) {
      if (!_items || _items.length === 0) {
        items = [];
        return __select.clear();
      }
      items = _items;
      var html = getContent(items);
      $select.html($.map(items, item => `<option value="${item.value}">${item.text}</option>`).join(''))
      $layer.html(html);
      $text.text(items[0].text);
      value = items[0].value;
      text = items[0].text;
      onChange(value, text);
    },
    clear() {
      $text.html('请选择');
      $layer.hide().empty();
      $select.empty();
      value = text = undefined;
    },
    getValue() {
      return value;
    },
    getText() {
      return text;
    },
    getData() {
      return items[index];
    },
    setValue(value) {
      $layer.children().each(function () {
        var $this = $(this);
        if ($this.data('id') == value) {
          $text.text($this.text())
          $select.val(value);
          __select.triggerChange();
          return false;
        }
      })
    },
    triggerChange() {
      onChange(value, text);
    }
  }
  this.data('__select', __select);
  return __select;
}