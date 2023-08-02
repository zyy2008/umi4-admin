import ajax, { AjaxPromise, ExtraFetchParams } from "@ajax";

const RulePrefix: string = "/rule";
const EventPrefix: string = "/event";

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
    prefix: RulePrefix,
    ...(options || {}),
  });
}

export async function eventToolsSave(
  data: {
    toolId: string;
    toolName: string;
    toolData: string;
  },
  options?: ExtraFetchParams
): AjaxPromise<API.RuleDTO[]> {
  return ajax.ajax({
    method: "POST",
    url: "/flowable/eventToolsSave",
    data,
    prefix: EventPrefix,
    ...(options || {}),
  });
}
