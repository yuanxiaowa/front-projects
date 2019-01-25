"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ody_bundler_1 = require("ody-bundler");
const cssnext = require("postcss-cssnext");
const imageminPngquant = require("imagemin-pngquant");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminSvgo = require("imagemin-svgo");
const Path = require("path");
const fs_1 = require("fs");
var projectName = process.env.name || (() => {
    try {
        return fs_1.readFileSync('.entry', 'utf8');
    }
    catch (e) {
    }
})();
if (!projectName) {
    throw '请先指定入口名';
}
console.log('运行项目', projectName);
// process.env.NODE_ENV = 'production'
var options1 = {
    // env: 'production',
    outDir: 'dist/' + projectName,
    entry: `src/projects/${projectName}/modules/*/templates/*.html`,
    components: {
        g: 'src/common/components',
        c: `src/projects/${projectName}/common/components`
    },
    getOutputMask(name, type) {
        if (type === 'html') {
            return '[-3]/[name][ext]';
        }
    },
    style: {
        plugins: []
    },
    script: {
        globals: {
            jquery: 'jQuery'
        }
    },
    template: {},
    envs: {
        production: {
            image: {
                imageminPlugins: {
                    png: imageminPngquant(),
                    svg: imageminSvgo(),
                    jpg: imageminJpegtran()
                }
            },
            template: {
                type: 'php'
            },
            deployer: {
                keepLocal: true
            }
        }
    }
};
var options2 = (() => {
    try {
        return require('./src/projects/' + projectName + '/config').default;
    }
    catch (e) {
        return {};
    }
})();
var options = ody_bundler_1.mergeOptions(options1, options2);
if (process.env.entry) {
    options.entry = Path.join(`src/projects/${projectName}`, process.env.entry);
}
if (options.template.variables) {
    if (options.template.getStaticData) {
        let prev = options.template.getStaticData;
        options.template.getStaticData = path => Object.assign({}, options.template.variables, prev(name));
    }
    else {
        options.template.getStaticData = path => Object.assign({}, options.template.variables);
    }
}
if (options.script.variables) {
    options.script.uglifyOptions.compress.global_defs = options.script.variables;
}
let styleVariables = {};
flatObject(options.style.variables || {}, styleVariables);
options.style.plugins.unshift(cssnext({
    features: {
        customProperties: {
            variables: styleVariables
        },
        autoprefixer: false
    },
    warnForDuplicates: false
}));
ody_bundler_1.default(options).then(() => {
    // @ts-ignore
    options.onEnd && options.onEnd();
});
function flatObject(obj, ret, keys = []) {
    Object.keys(obj).forEach(key => {
        keys.push(key);
        var v = obj[key];
        if (typeof v === 'object') {
            flatObject(v, ret, keys);
        }
        else {
            let k = '--' + keys[0] + keys.slice(1).filter(Boolean).map(name => name[0].toUpperCase() + name.substring(1)).join('');
            ret[k] = v;
        }
        keys.pop();
    });
}
