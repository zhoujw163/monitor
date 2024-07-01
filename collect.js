import { upload } from "./upload";

export { collectAppear } from "./intersectionObserver";

// 参数创建前
let beforeCreateParams;
// 上报日志前
let beforeUpload;
// 上报日志后
let afterUpload;
// 异常处理
let onError = function (e) {
  console.error(e);
};

// 采集上报信息
export function collect(customData, eventType) {
  let appId, pageId, timestamp, ua, currentUrl;
  beforeCreateParams && beforeCreateParams();
  // 1.采集页面的基本信息：
  //   a. 应用id（meta标签中获取app-id）
  //   b. 页面id（body标签中获取page-id）
  const metaList = document.getElementsByTagName("meta");
  for (let i = 0; i < metaList.length; i++) {
    const meta = metaList[i];
    if (meta.getAttribute("app-id")) {
      appId = meta.getAttribute("app-id");
    }
  }

  pageId = document.body.getAttribute("page-id");
  if (!appId || !pageId) {
    return;
  }

  // 2.日志上报信息收集
  //   a. 应用id和页面id
  //   b. 访问时间
  //   c. ua
  //   d. 当前页面url
  timestamp = new Date().getTime();
  ua = window.navigator.userAgent;
  currentUrl = window.location.href;
  console.log(appId, pageId, timestamp, ua);
  const params = {
    appId,
    pageId,
    timestamp,
    ua,
    url: currentUrl,
    args: JSON.stringify(customData),
  };
  let data = qs.stringify(params);
  console.log(data);
  // let data = `appId=${appId}&pageId=${pageId}&timestamp=${timestamp}&ua=${ua}`;
  if (beforeUpload) {
    data = beforeUpload(data);
  }

  // 3.调用日志上报API
  let url, uploadData;
  try {
    const ret = upload(data, { eventType });
    url = ret.url;
    uploadData = ret.data;
  } catch (e) {
    onError(e);
  } finally {
    afterUpload && afterUpload(url, uploadData);
  }
}

// 发送PV日志
export function sendPV() {
  collect({}, "PV");
}

// 上报曝光埋点
export function sendExp(data = {}) {
  collect(data, "EXP");
}

// 上报点击埋点
export function sendClick(data = {}) {
  collect(data, "CLICK");
}

// 上报停留时长埋点
export function sendStayTime(data = {}) {
  collect(data, "STAY");
}

// 上报自定义埋点
export function sendCustom(data = {}) {
  collect(data, "CUSTOM");
}

// 上报性能指标
export function sendPerf(data = {}) {
  collect(data, "PERF");
}

// 上报异常监控
export function sendError(data = {}) {
  collect(data, "ERROR");
}

export function registerBeforeCreateParams(fn) {
  beforeCreateParams = fn;
}

export function registerBeforeUpload(fn) {
  beforeUpload = fn;
}

export function registerAfterUpload(fn) {
  afterUpload = fn;
}

export function registerOnError(fn) {
  onError = fn;
}

export default {};
