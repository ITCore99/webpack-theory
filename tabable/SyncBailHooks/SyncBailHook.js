let { SyncHook }  = require('tapable')

class Lesson {
  constructor() {
    // 自定义一些钩子
    this.hooks = {
      arch: new SyncHook(['name']) // 标识拥有几个参数
    }
  }
  tap() { // 注册监听函数 启动的时候让注册的函数同步执行
    this.hooks.arch.tap('node',function (name) {
      console.log('node', name)
    })
    this.hooks.arch.tap('react',function (name) {
      console.log('react', name)
    })
  }
  start() {
    this.hooks.arch.call('付卓宁') // 触发事件执行
  }
}
const l = new Lesson() 
l.tap()  // 注册这两个事件
l.start() // 启动钩子