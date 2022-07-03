class SyncBailHook {
  constructor(args) {
    this.tasks = []
  }
  tap(flag, task) {
    this.tasks.push(task)
  }
  call(...args) {
    let ret         // 存放执行结果
    let index = 0   // 标识当前要执行的索引
    do {
      ret = this.tasks[index++](...args)
    } while (ret === undefined && index < this.tasks.length);
  }
}

let hook = new SyncBailHook(['name'])
hook.tap('react', function(name) {
  console.log('react', name)
  return 'react 太难了 想先停一停 休息休息'
})
hook.tap('node', function(name) {
  console.log('node', name)
})
hook.call('fuzhuoning')