import ajax, { AjaxPromise, ExtraFetchParams } from "@ajax";

const EventPrefix: string = "/event";

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

export async function eventBind(
  data: API.BindData,
  options?: ExtraFetchParams
): AjaxPromise<string> {
  return ajax.ajax({
    method: "POST",
    url: "/flowable/eventBind",
    data,
    prefix: EventPrefix,
    ...(options || {}),
  });
}

export async function bindEventSearch(
  data: API.ResultBind,
  options?: ExtraFetchParams
): AjaxPromise<API.ResultBind[]> {
  return ajax.ajax({
    method: "POST",
    url: "/flowable/bindEventSearch",
    data,
    prefix: EventPrefix,
    ...(options || {}),
  });
}
