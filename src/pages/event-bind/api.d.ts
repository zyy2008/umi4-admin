declare namespace API {
  type BindTag = {
    triggerType: number[];
    topic: string;
    frequency: string[];
  };
  type BindEvent = {
    id: string;
    tag: BindTag[];
  };
  type BindData = {
    mid: string;
    events: BindEvent[];
  };
  type ResultBind = {
    mid: string;
    eventId: string;
    isEffect: number;
  } & BindTag;
}
