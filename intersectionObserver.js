export function collectAppear() {
  const appearEvent = new CustomEvent("onAppear");
  const disappearEvent = new CustomEvent("onDisappear");

  let ob;

  // 防止创建多个实例，导致事件多次触发
  if (window.nadoOb) {
    ob = window.nadoOb;
  }

  ob = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        // 触发自定义事件，在目标元素上监听 onAppear 事件，调用后端api上报曝光埋点数据
        entry.target.dispatchEvent(appearEvent);
      } else {
        entry.target.dispatchEvent(disappearEvent);
      }
    });
  });

  let obList = new WeakMap();
  // 监听所有包含 appear 属性的元素
  const eles = document.querySelectorAll("[appear]");

  eles.forEach((ele) => {
    if (!obList.has(ele)) {
      ob.observe(ele);
      obList.set(ele, { appear: ele.getAttribute("appear") });
    }
  });

  window.nadoOb = ob;
  window.nadoObList = obList;
}
