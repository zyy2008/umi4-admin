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
  model: {},
  initialState: {},
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
          name: "task",
          entry: "//localhost:8081",
        },
        // {
        //   name: "app2",
        //   entry: "//192.169.7.200:8092/",
        // },
      ],
    },
  },
  proxy: {
    "/atlas": {
      target: "http://192.169.7.200:8079/",
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
    // {
    //   name: "知识管理",
    //   path: "/knowledge",
    //   routes: [
    //     { path: "/knowledge/project/*", name: "知识编辑", microApp: "app1" },
    //   ],
    // },
    {
      name: "任务调度",
      path: "/task",
      routes: [
        { path: "/task/publicTaskMgt", name: "公共任务管理", microApp: "task" },
        { path: "/task/taskMgt", name: "任务管理", microApp: "task" },
        { path: "/task/thresholdDet", name: "门限知识检测", microApp: "task" },
      ],
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
      // layout: false,
    },
    {
      path: "/view",
      name: "知识图谱",
      component: "./view",
    },
    {
      // path: "/task",
      // name: "任务编辑",
      // component: "./task",
      // layout: false,
    },
  ],
  npmClient: "yarn",
});
