import { defineClientConfig } from "vuepress/client";
import { hasGlobalComponent } from "E:/tsgproject/list/tsg/node_modules/@vuepress/helper/lib/client/index.js";

import { useScriptTag } from "E:/tsgproject/list/tsg/node_modules/@vueuse/core/index.mjs";
import FontIcon from "E:/tsgproject/list/tsg/node_modules/vuepress-plugin-components/lib/client/components/FontIcon.js";
import Badge from "E:/tsgproject/list/tsg/node_modules/vuepress-plugin-components/lib/client/components/Badge.js";
import BiliBili from "E:/tsgproject/list/tsg/node_modules/vuepress-plugin-components/lib/client/components/BiliBili.js";
import VidStack from "E:/tsgproject/list/tsg/node_modules/vuepress-plugin-components/lib/client/components/VidStack.js";

import "E:/tsgproject/list/tsg/node_modules/vuepress-plugin-components/lib/client/styles/sr-only.scss";

export default defineClientConfig({
  enhance: ({ app }) => {
    if(!hasGlobalComponent("FontIcon")) app.component("FontIcon", FontIcon);
    if(!hasGlobalComponent("Badge")) app.component("Badge", Badge);
    if(!hasGlobalComponent("BiliBili")) app.component("BiliBili", BiliBili);
    if(!hasGlobalComponent("VidStack")) app.component("VidStack", VidStack);
    
  },
  setup: () => {
    useScriptTag(
  `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/js/brands.min.js`,
  () => {},
  { attrs: { "data-auto-replace-svg": "nest" } }
);

    useScriptTag(
  `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/js/solid.min.js`,
  () => {},
  { attrs: { "data-auto-replace-svg": "nest" } }
);

    useScriptTag(
  `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/js/fontawesome.min.js`,
  () => {},
  { attrs: { "data-auto-replace-svg": "nest" } }
);

  },
  rootComponents: [

  ],
});
