import { IApi } from "umi";

export default (api: IApi) => {
  api.modifyHTML(($) => {
    $("head").append([
      `<script async src='/config.js?t=${new Date().getTime()}'></script>`,
    ]);
    return $;
  });
};
