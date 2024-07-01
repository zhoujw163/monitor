/**
 * 日志数据上报
 *
 * @param {*} data 上报参数
 * @param {*} options 附加属性
 * event-type：PV、EXP、CLICK、CUSTOM
 *
 */
export function upload(data, options = {}) {
  // 获取event_type
  const { eventType = "PV" } = options;
  const params = data + "&eventType=" + eventType;
  const src = "http://book.youbaobao.xyz:7001/monitor/upload?" + params;
  console.log(data, src, eventType);
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

export default {};
