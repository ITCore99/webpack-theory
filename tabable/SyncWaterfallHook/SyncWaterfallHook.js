let { SyncWaterfallHook }  = require('tapable')

/**
 * SyncWaterfallHook 之前的回调函数执行之间是没有任何的关联的，但是如果你想让回调函数执行相互关联则推荐你使用这个钩子函数。
 * 会将上一个函数执行的结果作为参数传递到下一个钩子函数
 */

class Lesson {
  constructor() {
    // 自定义一些钩子
    this.hooks = {
      arch: new SyncWaterfallHook(['name']) // 标识拥有几个参数
    }
  }
  tap() { // 注册监听函数 启动的时候让注册的函数同步执行
    this.hooks.arch.tap('node',function (name) {
      console.log('node', name)
      return 'node 学的还不错继续加油'
    })
    this.hooks.arch.tap('react',function (data) {
      console.log('react', data)
    })
  }
  start() {
    this.hooks.arch.call('付卓宁') // 触发事件执行
  }
}
const l = new Lesson() 
l.tap()  // 注册这两个事件
l.start() // 启动钩子