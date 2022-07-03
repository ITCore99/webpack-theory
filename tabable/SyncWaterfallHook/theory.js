class SyncWaterfallHook {
  constructor(args) {
    this.tasks = []
  }
  tap(flag, task) {
    this.tasks.push(task)
  }
  call(...args) {
    let [first, ...other] = this.tasks
    let ret = first(...args)
    other.reduce((prev, curr) => {
      return curr(prev)
    }, ret)
  }
}

let hook = new SyncWaterfallHook(['name'])
hook.tap('react', function(name) {
  console.log(name)
  return 'react ok'
})
hook.tap('node', function(data) {
  console.log(data)
  return 'node ok'
})
hook.tap('webpack', function(data) {
  console.log(data)
  return 'webpack ok'
})
hook.call('fuzhuoning')