# 前端监控平台

## 应用场景

- 流量分析：PV、UV、IP、PV点击率、UV点击率、停留时长...
- 行为分析：模块曝光、模块点击、滑动、表单操作...
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


[FP](https://developer.mozilla.org/zh-CN/docs/Glossary/First_paint)
[FCP](https://developer.mozilla.org/zh-CN/docs/Glossary/First_contentful_paint)
[LCP](https://developer.mozilla.org/zh-CN/docs/Glossary/Largest_contentful_paint)
[DCL](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/DOMContentLoaded_event)
[L](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/load_event)

曝光情况

通过 IntersectionObserver 监听元素，来触发自定义事件 onAppear
元素监听 onAppear 事件，完成上报

1. dom已渲染，由不可见变为可见;
2. 动态添加元素: dom不存在，未渲染，由不可见变为可见;
   1. 动态添加元素后，需要手动再次调用 observer 监听元素

