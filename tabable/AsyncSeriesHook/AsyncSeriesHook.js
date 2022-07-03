let { AsyncSeriesHook }  = require('tapable')

/**
 * AsyncSeriesHook
 * 异步串行钩子 是第一个异步钩子执行完再去执行第二个钩子函数
 */

class Lesson {
  constructor() {
    // 自定义一些钩子
    this.hooks = {
      arch: new AsyncSeriesHook(['name']) // 标识拥有几个参数
    }
  }
  tap() { // 注册监听函数 启动的时候让注册的函数同步执行
    this.hooks.arch.tapAsync('node',function (name, cb) {
      setTimeout(() => {
        console.log('node', name)
        cb()
      }, 1000)
    })
    this.hooks.arch.tapAsync('react',function (name, cb) {
      setTimeout(() => {
       console.log('react', name)
       cb()
      }, 1000)
    })
  }
  start() {
    this.hooks.arch.callAsync('付卓宁', function () {
      console.log('学习的很好 可以毕业了')
    }) // 触发事件执行
  }
}
const l = new Lesson() 
l.tap()  // 注册这两个事件
l.start() // 启动钩子