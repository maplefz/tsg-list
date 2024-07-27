// 配置成立计时的注册组件
import { defineClientConfig } from "vuepress/client";
import Days from "./components/tsg_birth/tsg_birth.vue";

export default defineClientConfig({
  enhance: ({ app, router, siteData }) => {
    app.component("Days", Days);
  },
});