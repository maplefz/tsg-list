import comp from "E:/tsgproject/list/tsg/src/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"主页\",\"lang\":\"zh-CN\",\"frontmatter\":{\"home\":true,\"icon\":\"home\",\"title\":\"主页\",\"heroImage\":\"/assets/image/TSG_logo.svg\",\"heroText\":\"三角小透明\",\"tagline\":\"--记录三角字幕组发布过的作品--\",\"actions\":[{\"text\":\"电视剧\",\"icon\":\"tv\",\"link\":\"./📺电视剧/\",\"type\":\"default\"},{\"text\":\"电影\",\"icon\":\"film\",\"link\":\"./🎞️电影/\"},{\"text\":\"SP\",\"icon\":\"display\",\"link\":\"./🎬sp/\",\"type\":\"default\"},{\"text\":\"其他\",\"icon\":\"video\",\"link\":\"./🎥其他/\",\"type\":\"default\"}],\"highlights\":[{\"header\":\"本页面仅为展示翻译过的节目。\",\"description\":\"若要下载剧集，请自行访问微博或者补档网站。\",\"image\":\"/assets/image/ywj.svg\",\"highlights\":[{\"title\":\"优先推荐通过正版途径观看节目。\",\"icon\":\"exclamation-triangle\"}]}],\"gitInclude\":[],\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://weibo.com/u/2606228641/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"三角小透明\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"主页\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"website\"}],[\"meta\",{\"property\":\"og:image\",\"content\":\"https://weibo.com/u/2606228641/assets/image/20160716zx.png\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"zh-CN\"}],[\"meta\",{\"property\":\"article:author\",\"content\":\"三角小透明\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"WebPage\\\",\\\"name\\\":\\\"主页\\\"}\"]]},\"headers\":[],\"readingTime\":{\"minutes\":0.45,\"words\":134},\"filePathRelative\":\"README.md\"}")
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
