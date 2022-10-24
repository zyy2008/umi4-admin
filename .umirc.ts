import { defineConfig } from "@umijs/max";

export default defineConfig({
  clickToComponent: {},
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
  ],
  npmClient: "yarn",
});
