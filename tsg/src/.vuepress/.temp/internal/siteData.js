export const siteData = JSON.parse("{\"base\":\"/\",\"lang\":\"zh-CN\",\"title\":\"三角小透明\",\"description\":\"这是一个三角字幕组发布作品的列表页面\",\"head\":[[\"link\",{\"rel\":\"icon\",\"href\":\"/images/favicon.ico\"}],[\"link\",{\"rel\":\"icon\",\"href\":\"/assets/image/TSG_logo_n.svg\"}]],\"locales\":{}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}
