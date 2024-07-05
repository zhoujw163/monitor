import { UUID } from "uuidjs";
/**
 * 日志数据上报
 *
 * @param {*} data 上报参数
 * @param {*} options 附加属性
 * @param {boolean} isSendBeacon 默认使用img标签上报，如果需要使用sendBeacon上报，请设置为true
 *
 * navigator.sendBeacon(url, data); 关闭页面时，发送数据，浏览器不会中断请求
 *
 * event-type：PV、EXP、CLICK、CUSTOM
 *
 */
export function upload(data, options = {}, isSendBeacon = false) {
  // 获取event_type
  const { eventType = "PV" } = options;

  // 获取 userId, visitorId
  const userId = localStorage.getItem("userId") || "";
  let visitorId = localStorage.getItem("visitorId") || "";
  if (!visitorId) {
    visitorId = UUID.generate();
    localStorage.setItem("visitorId", visitorId);
  }
  if (!userId) {
    userId = visitorId;
  }

  const params = `${data}&eventType=${eventType}&userId=${userId}&visitorId=${visitorId}`;

  const src = "http://book.youbaobao.xyz:7001/monitor/upload?" + params;
  console.log(data, src, eventType);

  if (isSendBeacon) {
    navigator.sendBeacon(src);
  } else {
    let img = new Image();
    img.src = src;
    img = null; // 内存释放
    return {
      url: src,
      data: {
        params,
      },
    };
  }
}

export default {};
