var colorPrimary = '#253746';
var basePath = 'http://json.ecovacs.cn/chenhaigang_20170823/official';
module.exports = {
  mock: {
    url: basePath,
    baseData: {
      SHOP_URL: '//dev-mall.ecovacs.cn',
      API_URL: '//dev-shop-api.ecovacs.cn/shopApi',
      CDN_URL: 'http://qas-static.ecovacs.cn'
    }
  },
  api: {
    target: basePath,
    alltoget: true
  },
  external: {
    variables: {
      STATIC_URL_NAME: 'STATIC_URL'
    },
    template: {
      variables: {
        BAIDU_URL: '//api.map.baidu.com/api?v=2.0&ak=uqLiaegY9PLpFSiyVGehaOR3REwfdyMt',
        teleNum: '{{customer_service_tel}}',
        fontUrl: '//at.alicdn.com/t/font_362422_cs8jiw1j8jxxbt9.css'
      }
    },
    style: {
      variables: {
        w: {
          max: '1200px',
          min: '990px'
        },
        h: {
          input: '46px'
        },
        color: {
          base: '#393939',
          primary: colorPrimary,
          gray: '#999'
        },
        bg: {
          gray: '#e7e7e7'
        },
        pad: '20px',
        lh: '30px',
        fs: {
          '': '14px',
          small: '12px'
        },
        border: {
          '': '1px solid #eaeaea',
          em: '1px solid ' + colorPrimary
        }
      },
      selectors: {
        ':--any-status': ':link,:visited'
      }
    }
  },
  deploy: {
    statics: 'op',
    templates: 'official/views/pc',
    templateType: 'php'
  }
}