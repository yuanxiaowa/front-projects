"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.default = {
    publicURL: '/activities',
    envs: {
        development: {
            template: {
                getDevDataUrl(p) {
                    var name = path_1.basename(p, '.html');
                    return `../data/${name}.json`;
                }
            }
        },
        production: {
            outDir: 'E:/ecovacs/statics_pre/m/hd/trial-dj35',
            publicURL: '/m/hd/trial-dj35',
            minify: false,
            hashContent: false,
            getOutputMask(name, type) {
                if (type === 'html') {
                    return 'E:/ecovacs/zhangwenlong_20180314/protected/modules/wechat/views/wechat/[-3]/[name].php';
                }
            },
            template: {
                onlyBody: true
            },
            getGeneratedUrl(asset) {
                return `{{${asset.name.endsWith('goods.jpg') ? 'STATIC_URL' : 'WAP_STATIC_URL'}}}` + asset.generatedUrl.replace('/m', '');
            },
            deployer: {
                keepLocal: false
            }
        }
    }
};
