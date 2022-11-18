import { defineConfig } from "@umijs/max";

export default defineConfig({
  plugins: [
    require.resolve("@alita/plugins/dist/keepalive"),
    require.resolve("@alita/plugins/dist/tabs-layout"),
  ],
  keepalive: [/./],
  tabsLayout: {
    hasDropdown: true,
  },
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
    },
    {
      path: "/view",
      name: "知识图谱",
      component: "./view",
    },
    {
      path: "/vue3/page1",
      name: "欢迎1",
      microApp: "vue3",
    },
  ],
  npmClient: "yarn",
});
