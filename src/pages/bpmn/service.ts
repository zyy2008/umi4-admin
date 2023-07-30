import ajax, { AjaxPromise, ExtraFetchParams } from "@ajax";

const prefix: string = "/rule";

export async function getRulesList(
  params: {
    ruleName?: string;
  },
  options?: ExtraFetchParams
): AjaxPromise<API.RuleDTO[]> {
  return ajax.ajax({
    method: "POST",
    url: "/rules/list",
    params,
    prefix,
    ...(options || {}),
  });
}
