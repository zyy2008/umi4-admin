import { defineConfig } from "@umijs/max";
import path from "path";

function resolve(dir: string) {
  return path.join(__dirname, dir);
}

export default defineConfig({
  hash: true,
  antd: {},
  headScripts: [
    // 解决首次加载时白屏的问题
    { src: "/scripts/loading.js", async: true },
  ],
  plugins: [
    require.resolve("@alita/plugins/dist/keepalive"),
    require.resolve("@alita/plugins/dist/tabs-layout"),
  ],
  keepalive: [/./],
  tabsLayout: {
    hasDropdown: true,
  },
  layout: {
    layout: "top",
    contentWidth: "Fluid",
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
      apps: [
        {
          name: "knowledge",
          entry: "//192.169.7.200:8091",
        },
        {
          name: "task",
          entry: "//192.169.7.200:8092",
        },
        {
          name: "arithmetic",
          entry: "//192.169.7.200:8093",
        },
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
      // layout: false,
    },
    {
      name: "知识管理",
      path: "/knowledge",
      routes: [
        { path: "/knowledge/page1", name: "知识编辑", microApp: "knowledge" },
        {
          path: "/knowledge/transfer",
          name: "知识转换",
          microApp: "knowledge",
        },
        {
          path: "/knowledge/view",
          name: "知识图谱",
          component: "./view",
        },
      ],
    },
    {
      name: "任务调度",
      path: "/task",
      routes: [
        {
          path: "/task/page1",
          name: "任务调度",
          redirect: "/arithmetic/page1",
        },
        {
          path: "/task/arithmetic",
          name: "算法管理",
          redirect: "/arithmetic/arithmetic",
        },
        { path: "/task/publicTaskMgt", name: "公共任务管理", microApp: "task" },
        { path: "/task/taskMgt", name: "任务管理", microApp: "task" },
        { path: "/task/thresholdDet", name: "门限知识检测", microApp: "task" },
        { path: "/task/edit", name: "任务编辑", component: "./task" },
      ],
    },
    {
      name: "算法任务",
      path: "/arithmetic",
      menu: false,
      routes: [
        {
          path: "/arithmetic/page1",
          name: "任务调度",
          microApp: "arithmetic",
        },
        {
          path: "/arithmetic/arithmetic",
          name: "算法管理",
          microApp: "arithmetic",
        },
      ],
    },
  ],
  npmClient: "yarn",
});
