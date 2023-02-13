import { IApi } from "umi";

export default (api: IApi) => {
  api.modifyHTML(($) => {
    $("head").append([`<script src='./config.js'></script>`]);
    return $;
  });
};
