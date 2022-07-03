const path = require('path')
const fs = require('fs')
const babylon = require('babylon')
const traverse = require('@babel/traverse').default
const types = require('@babel/types')
const generator = require('@babel/generator').default
const  ejs = require('ejs')
const { SyncHook } = require('tapable')
/**
 * babylon 主要就是把源码 转化为ast
 * @babel/traverse  // 遍历ast 节点
 * @babel/types  // 替换 节点
 * @babel/generator 将替换好的模块进行生成
 */
class Compiler {
  constructor(config) {
    this.config = config
    // 需要保存入口文件的路径
    this.entryId;              // ./src/index.js
    // 需要保存所有依赖
    this.modules = {}
    // 入口文件路径
    this.entry = config.entry
    this.root = process.cwd()   // 项目工作路径
    // webpack的钩子函数
    this.hooks = {
      entryOption: new SyncHook(),
      compile: new SyncHook(),
      afterComplie: new SyncHook(),
      afterPlugin: new SyncHook(),
      run: new SyncHook(),
      emit: new SyncHook(),
      done: new SyncHook()
    }
    // 如果传递了plugins 
    const plugins = this.config.plugins
    if(Array.isArray(plugins)) {
      plugins.forEach(plugin => plugin.apply(this))
    }
    this.hooks.afterPlugin.call()

  }
  // 获取源码
  getSource(path) {
    let source = fs.readFileSync(path, 'utf8')
    // 执行loader
    const rules = this.config.module.rules 
    rules.forEach(rule => {
      const { test, use } = rule
      let len = use.length
      if(test.test(path)) { // 这个模块需要通过loader来转换
        function normalLoader() {
          const loader = require(use[--len])
          source = loader(source)
          if(len >= 1) {
            normalLoader()
          }
        }
        normalLoader()
      }
    })
    return source
  }
  // 构建模块
  buildModule(modulePath, isEntry) {
    // 获取到模块的类型
    let source = this.getSource(modulePath)
    // 模块Id modulePath - this.root
    let moduleName = './' + path.relative(this.root, modulePath) // 相关路径
    // console.log(source, moduleName)
    if(isEntry) {
      this.entryId = moduleName // 保存入口名称
    }
    // console.log('parentPath', path.dirname(moduleName))
    // 解析文件内容 需要将source源码进行改造 返回一个依赖列表
    const { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName))
    // 把相对路径和模块中内容对应起来
    this.modules[moduleName] = sourceCode
    // 递归依赖
    dependencies.forEach(dep => { // 附模块加载
      // console.log('dep', dep, path.join(this.root, dep))
      this.buildModule(path.join(this.root, dep), false)
    })
    // console.log('dependencies', dependencies)
  }
  // 解析源码 AST 解析语法树木
  parse(source, parentPath) { 
    const ast = babylon.parse(source)
    const dependencies = [] // 依赖数组
    traverse(ast, {
      CallExpression(p) { // 调用表达式 
        const node = p.node // 获取到节点
        if (node.callee.name === 'require'){ // 筛选出require
          node.callee.name = '__webpack_require__ ' // 替换成webpack 中实现的require方法
          let moduleName = node.arguments[0].value // 获取到require 导入进来的路径
          moduleName = moduleName + (path.extname(moduleName) ? '' : '.js') // 获取引入文件的扩展名 ./a.js
          moduleName = './' + path.join(parentPath, moduleName) // 'src/a.js'
          dependencies.push(moduleName)
          node.arguments = [types.stringLiteral(moduleName)]
        } 
      }
    })
    let sourceCode = generator(ast).code
    return { sourceCode, dependencies }
  }
  emitFile() { // 发射文件
    // 用数据渲染我们的ejs 模板
    // 拿到输出到那个目录下
    const config = this.config
    const main = path.join(config.output.path, config.output.filename) 
    const templateStr = this.getSource(path.join(__dirname, 'main.ejs')) // 读取模板数据
    const code = ejs.render(templateStr, { entryId: this.entryId, modules: this.modules })
    // 存放资源
    this.assets = {}
    // 资源中路径对应的代码
    this.assets[main] = code
    fs.writeFileSync(main, this.assets[main])
  }
  run() {
    this.hooks.compile.call()
    // 执行并创建模块的依赖关系 第三个参数表示当前是一个主模块
    this.buildModule(path.resolve(this.root, this.entry), true) 
    this.hooks.afterComplie.call()
    // console.log('run', this.modules, this.entryId)
    this.hooks.emit.call()
    // 发射一个文件
    this.emitFile()
    this.hooks.done.call()
  }
}
module.exports = Compiler
console.log(process.cwd())