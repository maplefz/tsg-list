import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "电视剧",
      icon: "tv",
      prefix: "📺电视剧/",
      children: "structure",
    },
    {
      text: "电影",
      icon: "film",
      prefix: "🎞️电影/",
      children: "structure",
    },
    {
      text: "SP",
      icon: "display",
      prefix: "🎬sp/",
      children: "structure",
    },
    {
      text: "其他",
      icon: "video",
      prefix: "🎥其他/",
      children: "structure",
    },
  ],
});
