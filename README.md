# 前端监控平台

## 应用场景

- 流量分析：PV、UV、PV点击率、UV点击率、停留时长、跳失率、IP...
- 行为分析：模块曝光、模块点击率、滑动、表单操作...
- 性能监控：FP、FCP、LCP、TTI...
- 异常监控：JS错误、API错误、业务错误...

## 业内方案

- 百度统计
  - 流量统计和分析免费
  - 行为分析需要覆盖

- 阿里云ARMS
  - 流量分析、性能监控、异常监控

- 友盟
  - 流量分析
  - 行为分析

## 为什么要自建

虽然自建成本很高，但是数据是掌握在自己手中的，后期也能扩展更多的分析维度和能力。

## 架构设计

监控平台由三部分组成：

- 前端监控SDK：采集、上报

- 监控API和大数据仓库：
  - 接收上报的数据
  - 数据仓库：MaxCompute

- 监控数据可视化后台：
  - 日志大数据清洗
  - 大数据回流RDS（非结构化数据=>结构化数据）
  - 对结构化进行运算生成图表

本仓库为前端监控SDK。

曝光情况

通过 IntersectionObserver 监听元素，来触发自定义事件 onAppear
元素监听 onAppear 事件，完成上报

1. dom已渲染，由不可见变为可见;
2. 动态添加元素: dom不存在，未渲染，由不可见变为可见;
   1. 动态添加元素后，需要手动再次调用 observer 监听元素

数据上报性能瓶颈问题

将上传任务在异步插入到上传任务队列中:

在浏览器空闲（requestIdleCallback）时执行上传任务，
在 onbeforeunload 事件中执行上传任务

## 流量指标

### 页面访问行为

- PV：页面浏览量，count(type = pv)

- UV：用户浏览量，count(type = pv, distinct visitor_id)
  - visitor_id 不能 null
  - 对于未登录用户，需要在客户端生成 visitor_id（uuid 持久化存储）
  - 对于已登录用户，需要获取用户的 user_id，并将 user_id 写入 visitor_id

- PV点击率：页面点击率，count(type = click) / PV
  - 可以大于100%

- UV点击率：用户点击率，count(type = click, distinct visitor_id) / UV
  - 不可以大于100%

- 停留时长：用户从打开页面到关闭页面的总时长，leave page time（beforeunonload） - open time（onload）

**可视化**

通过折线图的方式，展示24小时内每小时页面指标
通过表格的方式，展示一定时间段内页面的指标

### 模块访问行为

- 模块曝光：模块显示时发送的埋点，count(type = exp, mod=mod_id)
- 模块点击：模块被点击时发送的埋点，count(type = click, mod=mod_id)

**可视化**

通过表格的方式，展示某个页面中所有模块的曝光和点击数据

### 页面的性能

- 首屏渲染时间：从打开页面到页面完全加载的时间，计算公式：

```js
window.onload = function() {
 new Date().getTime() - performance.timing.navigationStart 
}
```

- API请求时间：API发起，到API响应的时间，计算公式：API响应时间 - API发起时间

**可视化**

折线图
表格

### 页面异常监控

- JS Error：
  - 全局的jserror：window.onerror

```js
  // onerror 无法捕获微任务中的错误，需要使用 onunhandledrejection
  window.onerror = (event, source, lineno, colno, error) => {
    console.log(event.message, source, lineno, colno, error.stack)
  }
```

  - 全局的promise error：window.onunhandledrejection

```js
  window.onunhandledrejection = (e) => {
    console.log(e.reason.message, e.reason.stack)
  }
```

  - 自定义抛出的jserror：自定义上报 stack 和 message
  
- API Error：API响应过程中，出现异常的信息, count(type = api_error)
- 业务异常：完全上报的方式进行实现，count(type = biz_error)

**可视化**

折线图
表格

## 前端性能监控原理

https://developer.mozilla.org/zh-CN/docs/Web/API/Navigation_timing_API

[](./pref.png)
[](./pref2.png)
[](./pref3.png)
[](./pref4.png)

- [FP](https://developer.mozilla.org/zh-CN/docs/Glossary/First_paint)
- [FCP](https://developer.mozilla.org/zh-CN/docs/Glossary/First_contentful_paint)
- [LCP](https://developer.mozilla.org/zh-CN/docs/Glossary/Largest_contentful_paint)
- [DCL](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/DOMContentLoaded_event)
- [L](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/load_event)

## 前端性能采集

PerformanceTiming

```js
window.addEventListener('load', e => {
  // PerformanceTiming 毫秒
  const timing = window.performance.timing;
  const processingTiming = timing.domComplete - timing.domLoading;
  const dnsTiming = timing.domainLookupStart - timing.domainLookupEnd;
  console.log(processingTiming, dnsTiming);
  // PerformanceNavigationTiming 纳秒
  const perfEntries = window.performance.getEntries();
  console.log(perfEntries);
});
```

[获取fp、fcp、fmp（PerformancePaintTiming）](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformancePaintTiming)

```js
// fp
const paint = window.performance.getEntriesByType('paint');
const fp = paint.find(e => e.name === 'first-paint').startTime;
const fcp = paint.find(e => e.name === 'first-contentful-paint').startTime;
console.log(fp, fcp);
```

[获取更多性能指标：PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)
