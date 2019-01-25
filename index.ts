import { default as bundle, mergeOptions } from 'ody-bundler'
import * as cssnext from 'postcss-cssnext'
import * as imageminPngquant from 'imagemin-pngquant'
import * as imageminJpegtran from 'imagemin-jpegtran'
import * as imageminSvgo from 'imagemin-svgo'
import * as Path from 'path'
import { Options } from 'ody-bundler/src/structs';
import { readFileSync } from 'fs';

var projectName = process.env.name || (() => {
  try {
    return readFileSync('.entry', 'utf8')
  } catch(e) {
  }
})()
if (!projectName) {
  throw '请先指定入口名'
}

console.log('运行项目', projectName)
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
      return '[-3]/[name][ext]'
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
}
var options2 = (() => {
  try {
    return require('./src/projects/' + projectName + '/config').default
  } catch (e) {
    return {}
  }
})()
var options: Options = mergeOptions(options1, options2)
if (process.env.entry) {
  options.entry = Path.join(`src/projects/${projectName}`, process.env.entry)
}
if (options.template.variables) {
  if (options.template.getStaticData) {
    let prev = options.template.getStaticData
    options.template.getStaticData = path => Object.assign({}, options.template.variables, prev(name))
  } else {
    options.template.getStaticData = path => Object.assign({}, options.template.variables)
  }
}
if (options.script.variables) {
  options.script.uglifyOptions.compress.global_defs = options.script.variables
}
let styleVariables = {}
flatObject(options.style.variables || {}, styleVariables)
options.style.plugins.unshift(cssnext({
  features: {
    customProperties: {
      variables: styleVariables
    },
    autoprefixer: false
  },
  warnForDuplicates: false
}))

bundle(options).then(() => {
  // @ts-ignore
  options.onEnd && options.onEnd()
})

function flatObject(obj: any, ret: any, keys: string[] = []) {
  Object.keys(obj).forEach(key => {
    keys.push(key)
    var v = obj[key]
    if (typeof v === 'object') {
      flatObject(v, ret, keys)
    } else {
      let k = '--' + keys[0] + keys.slice(1).filter(Boolean).map(name => name[0].toUpperCase() + name.substring(1)).join('')
      ret[k] = v
    }
    keys.pop()
  })
}