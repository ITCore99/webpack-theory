
# webpack原理 及其简易的实现

  webpack 本质是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是Tapable, Tapable有点类似于node.js的events库，核心原理也是依赖于发布订阅模式。

- ## Tapable 介绍
