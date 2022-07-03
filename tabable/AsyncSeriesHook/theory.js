class SyncSeriesHook {
  constructor(args) {
    this.tasks = []
    this.count = 0  // 计数器
  }
  tapAsync(flag, task) {
    this.tasks.push(task)
  }
  callAsync(...args) {
    const finallyCallback = args.pop()
    const next = () => {
      if (this.count === this.tasks.length) finallyCallback()
      else this.tasks[this.count++](...args, next)
    }
    next()
  }
}

let hook = new SyncSeriesHook(['name'])
hook.tapAsync('react', function(name, cb) {
  setTimeout(() => {
    console.log('react', name)
    cb()
  }, 1000)

})
hook.tapAsync('node', function(name, cb) {
  setTimeout(() => {
    console.log('node', name)
    cb()
  }, 1000)
})
hook.callAsync('fuzhuoning', () => {
  console.log('学的非常好 可以毕业了🎓')
})