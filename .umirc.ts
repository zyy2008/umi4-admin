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
      name: "页面1",
      path: "/page1",
      component: "./index",
    },
    {
      path: "/vue3/dashboard",
      name: "欢迎",
      microApp: "vue3",
    },
    {
      path: "/vue3/page1",
      name: "欢迎1",
      microApp: "vue3",
    },
  ],
  npmClient: "yarn",
});
