import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "电视剧",
    icon: "tv",
    link: "/📺电视剧/",
  },
  {
    text: "电影",
    icon: "film",
    link: "/🎞️电影/",
  },
  {
    text: "SP",
    icon: "display",
    link: "/🎬sp/",
  },
  {
    text: "其他",
    icon: "video",
    link: "/🎥其他/",
  },
  {
    text: "微博",
    icon: "/assets/image/weibo.svg",
    link: "https://weibo.com/u/2606228641",
  },
  {
    text: "补档网站",
    icon: "/assets/image/TSG_logo_n.svg",
    link: "https://niwa.tsgsanjiao.com",
  },
  {
    text: "一些有趣的东西",
    icon: "face-grin-tongue-wink",
    link: "fun.md",
  },


]);
