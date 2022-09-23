import { defineConfig } from "@umijs/max";

export default defineConfig({
  layout: {
    title: "121113",
  },
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      name: "首页",
      path: "/home",
      component: "./index",
    },
    {
      name: "权限演示",
      path: "/access",
      component: "./index",
    },
  ],
  npmClient: "yarn",
});
