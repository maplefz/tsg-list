import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://weibo.com/u/2606228641",
  
  //隐藏打印按钮
  print: false,

  //不显示页面信息
  pageInfo: false,  

  //页面信息：作者
  author: {
    name: "三角小透明",
    url: "https://weibo.com/u/2606228641",
  },

   iconAssets: "fontawesome-with-brands",
   
   logo: "/assets/image/TSG_logo_n.svg",

  //用于在导航栏中显示仓库链接，输入github网址。
  // repo: "*",

  favicon: "/assets/image/TSG_logo_n.svg",

  docsDir: "src",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 禁用深色模式
  darkmode: "disable",

  // 页脚
   footer: "感谢：字幕组各位成员 | VuePress项目 | VuePress Theme Hope主题 | Github | CloudFlare | Backblaze | Picgo | 各位观众",

   displayFooter: true,

  // 不显示作者
  copyright: false,

  // 不显示页面最后更新时间
  lastUpdated: false,

  // 不显示页面贡献者
  contributors: false,

  // 不显示编辑此页链接
  editLink: false,

  // 加密配置
  //encrypt: {
  //  config: {
  //    "/demo/encrypt.html": ["1234"],
  //  },
  //},

  // 多语言配置
  // metaLocales: {
  //   editLink: "在 GitHub 上编辑此页",
  // },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 在这里配置主题提供的插件
  plugins: {
    // 注意: 仅用于测试! 你必须自行生成并在生产环境中使用自己的评论服务
    // 不要评论
    // comment: {
    //   provider: "Giscus",
    //   repo: "vuepress-theme-hope/giscus-discussions",
    //   repoId: "R_kgDOG_Pt2A",
    //   category: "Announcements",
    //   categoryId: "DIC_kwDOG_Pt2M4COD69",
    // },
    // 启用内置拓展组件
     components: {
       components: ["Badge", "BiliBili", "VidStack"], //启用Badge、插入Bilibili视频、视频播放器；
    },

      // 启用Algolia搜索
      docsearch:({
        appId: "IHKI4Y4FSF",
        apiKey: "a2e3a050e501cf76d34612e8ac4c2020",
        indexName: "tsg-list",
        disableUserPersonalization: true,  // 不使用收藏和搜索历史
  
        locales: {
          "/": {
            placeholder: "搜索文档",
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                searchBox: {
                  resetButtonTitle: "清除查询条件",
                  resetButtonAriaLabel: "清除查询条件",
                  cancelButtonText: "取消",
                  cancelButtonAriaLabel: "取消",
                },
                // 不使用，故注释搜索历史
                // startScreen: {
                //   recentSearchesTitle: "搜索历史",
                //   noRecentSearchesText: "没有搜索历史",
                //   saveRecentSearchButtonTitle: "保存至搜索历史",
                //   removeRecentSearchButtonTitle: "从搜索历史中移除",
                //   favoriteSearchesTitle: "收藏",
                //   removeFavoriteSearchButtonTitle: "从收藏中移除",
                // },
                errorScreen: {
                  titleText: "无法获取结果",
                  helpText: "你可能需要检查你的网络连接",
                },
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                  searchByText: "搜索提供者",
                },
                noResultsScreen: {
                  noResultsText: "无法找到相关结果",
                },
              },
            },
          },
        },
      }),
      // 启用搜索结束

       
    // 此处开启了很多功能用于演示，你应仅保留用到的功能。
    mdEnhance: {
      revealJs: true,  //启用幻灯片，在启用之前安装 reveal.js
      align: true,
      attrs: true,
      codetabs: true,  // 启用代码块分组
      component: true,
      demo: true,
      figure: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      mark: true,
      plantuml: true,
      spoiler: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      tasklist: true,
      vPre: true,

      // 在启用之前安装 chart.js
      // chart: true,

      // insert component easily

      // 在启用之前安装 echarts
      // echarts: true,

      // 在启用之前安装 flowchart.ts
      // flowchart: true,

      // gfm requires mathjax-full to provide tex support
      // gfm: true,

      // 在启用之前安装 katex
      // katex: true,

      // 在启用之前安装 mathjax-full
      // mathjax: true,

      // 在启用之前安装 mermaid
      // mermaid: true,

      // playground: {
      //   presets: ["ts", "vue"],
      // },

      // 在启用之前安装 reveal.js
      // revealJs: {
      //   plugins: ["highlight", "math", "search", "notes", "zoom"],
      // },

      // 在启用之前安装 @vue/repl
      // vuePlayground: true,

      // install sandpack-vue3 before enabling it
      // sandpack: true,
    },

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
