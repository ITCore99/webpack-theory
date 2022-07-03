let { AsyncParallelHook }  = require('tapable')

/**
 * 异步并发钩子 等到所有的异步方法执行之后再执行回调
 */

/**
 * 注册方法:
 * 1、tap 同步的  注册的回调是普通函数
 * 2、tapAsync 异步的 注册的回调是普通异步函数 
 * 2、tapPromise 注册的回调返回的是promise
 * 调用方法:
 * 1、call
 * 2、callAsync
 * 3、promsie
 */
class Lesson {
  constructor() {
    // 自定义一些钩子
    this.hooks = {
      arch: new AsyncParallelHook(['name']) // 标识拥有几个参数
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