"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as puppeteer from 'puppeteer'
const request = require("request-promise-native");
// import * as request from 'request'
const fs_1 = require("fs");
const path_1 = require("path");
var url_login = 'https://qas-sso.ecovacs.cn:8443';
var url_op = 'http://qas-shop.ecovacs.cn';
var url_edit = 'http://qas-shop.ecovacs.cn/official-topic/edit?id=21';
var username = 'admin';
var password = 'Eco@MX8BqC';
var url_login = 'https://sso.ecovacs.cn';
var url_op = 'http://shop.ecovacs.cn';
var url_edit = 'http://shop.ecovacs.cn/official-topic/edit?id=29';
var username = 'weina.qiao';
var password = 'Eco@83024';
var jar = request.jar();
var req = request.defaults({
    jar
});
var cache = {};
var exp = {
    entry: path_1.join(__dirname, 'modules/exchange/templates/*.html'),
    publicURL: '/zhuanti/',
    script: {
        uglifyOptions: {
            mangle: { toplevel: true }
        }
    },
    envs: {
        production: {
            async getGeneratedUrl(asset) {
                if (asset.type === 'png' || asset.type === 'jpg' || asset.type === 'gif') {
                    var key = asset.generatedUrl;
                    if (cache[key]) {
                        return cache[key];
                    }
                    await prepare();
                    var { err, url } = await uploadImage({
                        localUrl: key,
                        imgFile: {
                            value: asset.contents,
                            options: {
                                filename: asset.basename,
                                contentType: 'image/' + asset.type
                            }
                        }
                    });
                    if (err) {
                        return console.error(err);
                    }
                    cache[key] = url;
                    writeCache();
                    return url;
                }
            },
            deployer: {
                keepLocal: true,
                handlers: [(name, type) => {
                        if (type === 'html') {
                            return (path, content) => {
                                var str_start = '<body>';
                                var str_end = '</body>';
                                content = content.substring(content.indexOf(str_start) + str_start.length, content.indexOf(str_end));
                                return uploadHtml(url_edit, content, true);
                            };
                        }
                    }]
            },
            template: {
                type: 'vue'
            },
            onEnd() {
                browser.close();
            }
        }
    }
};
exports.default = exp;
/* exp.envs.production.getGeneratedUrl({
  name: 'C:/fakepath/QQ截图20180111093345.png',
  contents: readFileSync('C:/Users/dingyin.ou/Desktop/QQ截图20180111093345.png'),
  basename: 'QQ截图20180111093345.png',
  type: 'png'
}).then((url) => {
  debugger
  console.log(jar.getCookies('http://shop.ecovacs.cn')[0].toString(), url)
}) */
// var browser: puppeteer.Browser
async function uploadHtml(path, content, last = false) {
    var body = await req.get(path);
    var rInput = /<input(?=.*? name="([^"]+)")(?=.*? value="([^"]+)")[^>]+>/g;
    var rTextarea = /<textarea(?=.*? name="([^"]+)")[^>]+>([\s\S]*?)<\/textarea>/mg;
    var data = {};
    // console.log(body)
    while (rInput.test(body)) {
        data[RegExp.$1] = RegExp.$2;
    }
    while (rTextarea.test(body)) {
        data[RegExp.$1] = RegExp.$2;
    }
    var r = /<form(?=.*? action="([^"]+)")(?=.*? method="([^"]+)")/;
    r.test(body);
    var action = RegExp.$1;
    var method = RegExp.$2;
    if (last) {
        data['wap_content'] = content;
        data['pc_content'] = require('he').unescape(data['pc_content']);
    }
    else {
        data['pc_content'] = content;
        data['wap_content'] = require('he').unescape(data['wap_content']);
    }
    var res = await req.post(url_op + action, {
        json: true
    }).form(data);
    console.log(res.msg);
}
function uploadImage(formData) {
    var url = `${url_op}/file/do-kind-upload?dir=image`;
    return req.post(url, {
        json: true,
        formData
    });
}
var logined = false;
var cacheLoaded = false;
var logining = false;
var cbs = [];
async function prepare() {
    if (logining) {
        await new Promise(resolve => {
            cbs.push(resolve);
        });
    }
    else if (!logined) {
        logining = true;
        await login();
        logined = true;
        logining = false;
        if (!cacheLoaded) {
            readCache();
            cacheLoaded = true;
        }
        cbs.forEach(cb => cb());
    }
}
function getValue(name, html) {
    var r = new RegExp(`<input\\s+type="hidden"\\s+name="${name}"\\s+value="([^"]+)`);
    if (r.test(html)) {
        return RegExp.$1;
    }
}
async function login() {
    var url = `${url_login}/login?service=${encodeURIComponent(url_op)}/site/login`;
    var html = await req.get(url);
    var form = {
        lt: getValue('lt', html),
        execution: getValue('execution', html),
        _eventId: getValue('_eventId', html),
        username,
        password
    };
    return req.post(url, {
        form,
        followAllRedirects: true
    });
}
function readCache() {
    try {
        cache = require('./.cache');
    }
    catch (e) { }
}
function writeCache() {
    fs_1.writeFile('./.cache', JSON.stringify(cache), () => { });
}
/* var cookies: {
  name: string,
  value: string
}[]
async function getCookies() {
  if (cookies) {
    return cookies
  }
  var browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage();
  await page.goto('https://sso.ecovacs.cn/login?service=http%3A%2F%2Fshop.ecovacs.cn%2Fsite%2Flogin')
  await page.type('#username', 'weina.qiao')
  await page.type('#password', 'ECo@83024')
  await page.click('#login')
  await new Promise((resolve) => {
    setTimeout(resolve, 3000)
  })
  cookies = await page.cookies()
  return cookies
} */
// exp.getGeneratedUrl('', '') 
