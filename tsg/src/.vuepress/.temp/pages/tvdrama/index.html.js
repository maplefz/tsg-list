import comp from "E:/tsgproject/list/tsg/src/.vuepress/.temp/pages/tvdrama/index.html.vue"
const data = JSON.parse("{\"path\":\"/tvdrama/\",\"title\":\"Tvdrama\",\"lang\":\"zh-CN\",\"frontmatter\":{\"title\":\"Tvdrama\",\"article\":false,\"feed\":false,\"sitemap\":false,\"gitInclude\":[],\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://weibo.com/u/2606228641/tvdrama/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"三角小透明\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Tvdrama\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"article:author\",\"content\":\"三角小透明\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"Tvdrama\\\"}\"]]},\"headers\":[],\"readingTime\":{\"minutes\":0,\"words\":1},\"filePathRelative\":null}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
