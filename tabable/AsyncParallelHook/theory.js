class SyncParallelHook {
  constructor(args) {
    this.tasks = []
    this.count = 0  // 计数器
  }
  tapAsync(flag, task) {
    this.tasks.push(task)
  }
  callAsync(...args) {
    const finallyCallback = args.pop()
    const done = () => {
      if(++this.count === this.tasks.length) finallyCallback()
    }
    this.tasks.forEach(task => task(...args, done))
  }
}

let hook = new SyncParallelHook(['name'])
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