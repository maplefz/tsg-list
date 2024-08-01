import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  //base表示网站的根目录，如果是单独域名则/，如果是github就是“/库名”。
  base: "/",

  //网页标题
  lang: "zh-CN",
  title: "三角小透明",
  description: "这是一个三角字幕组发布作品的列表页面",
  head: [
    // 设置 favor.ico，.vuepress/public 下
    [
        'link', { rel: 'icon', href: '/images/favicon.ico' }
    ],
],

// 载入插件
plugins: [
  // vuepress-plugin-container实现折叠，需要先npm install -D vuepress-plugin-container
  ['vuepress-plugin-container', {
    type: 'details',
    defaultTitle: '',
  }],
],


  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});


