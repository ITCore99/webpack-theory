#! /usr/bin/env node 
/**
 * 1、需要找到当前执行名的路径 拿到webpack.config.js
 */
let path = require('path')
// 配置文件
let config = require(path.resolve('webpack.config.js'))

let Complier = require('../lib/Complier.js')
// 进行编译的类
let compiler = new Complier(config)
// 标识运行编译
compiler.run()

