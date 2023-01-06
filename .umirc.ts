import { defineConfig } from "@umijs/max";
import path from "path";

function resolve(dir: string) {
  return path.join(__dirname, dir);
}

export default defineConfig({
  plugins: [
    require.resolve("@alita/plugins/dist/keepalive"),
    require.resolve("@alita/plugins/dist/tabs-layout"),
  ],
  keepalive: [/./],
  tabsLayout: {
    hasDropdown: true,
  },
  chainWebpack(memo, { env, webpack }) {
    // 设置 alias
    memo.resolve.alias.set("@ajax", resolve("src/utils/ajax"));
  },
  // mfsu: false,
  request: {},
  qiankun: {
    master: {
      sandbox: {
        strictStyleIsolation: false,
        experimentalStyleIsolation: true,
      },
      apps: [
        {
          name: "vue3",
          entry: "//localhost",
        },
      ],
    },
  },
  proxy: {
    "/atlas": {
      target: "http://192.169.7.12:8079/",
      changeOrigin: true,
      pathRewrite: { "^/atlas": "" },
    },
  },
  clickToComponent: {},
  layout: {},
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      name: "首页",
      path: "/home",
      component: "./home",
    },
    {
      name: "知识编辑",
      path: "/edit",
      component: "./edit",
      // hideInMenu: true,
    },
    {
      path: "/view",
      name: "知识图谱",
      component: "./view",
    },
    {
      path: "/task",
      name: "任务编辑",
      component: "./task",
    },
  ],
  npmClient: "yarn",
});
