declare namespace API {
  type RuleDTO = {
    createBy: string;
    createTime: string;
    createType: number;
    description: string;
    fileName: string;
    id: number;
    projectId: number;
    ruleName: string;
    updateTime: string;
  };

  type EventData = {
    toolId?: string;
    toolName?: string;
    toolData?: string;
  };

  type CustomEvent = {
    eventId?: string;
    eventName?: string;
    eventData?: string;
  };
}
