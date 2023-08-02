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
  data: API.EventData,
  options?: ExtraFetchParams
): AjaxPromise<string> {
  return ajax.ajax({
    method: "POST",
    url: "/flowable/eventToolsSave",
    data,
    prefix: EventPrefix,
    ...(options || {}),
  });
}

export async function eventToolsSearch(
  options?: ExtraFetchParams
): AjaxPromise<API.EventData[]> {
  return ajax.ajax({
    method: "POST",
    url: "/flowable/eventToolsSearch",
    prefix: EventPrefix,
    ...(options || {}),
  });
}

export async function customEventSave(
  data: API.CustomEvent,
  options?: ExtraFetchParams
): AjaxPromise<string> {
  return ajax.ajax({
    method: "POST",
    url: "/flowable/customEventSave",
    data,
    prefix: EventPrefix,
    ...(options || {}),
  });
}

export async function customEventSearch(
  options?: ExtraFetchParams
): AjaxPromise<API.CustomEvent[]> {
  return ajax.ajax({
    method: "POST",
    url: "/flowable/customEventSearch",
    prefix: EventPrefix,
    ...(options || {}),
  });
}
