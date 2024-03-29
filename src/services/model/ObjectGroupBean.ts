/**
 * unknown
 * unknown
 *
 * OpenAPI spec version: last
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import * as models from "./models";

/**
 * @property `code` 对象组标识
 * @property `name` 对象组名称
 */
export interface ObjectGroupBean {
  pkId: number;
  objectCode: string;
  objectName: string;
  objectTime: string;
  objectUser: string;
  objectRemark: string;
}

type SatNetBeanList = {
  ip: string;
  netCode: string;
  netDesc: string;
  netName: string;
  pkId: number;
  port: string;
  satId: string;
  type: string;
};

export interface ObjectSatList {
  pkId: number;
  satCode: string;
  satDesignLife: number;
  satDesigner: string;
  satLaunchTime: string;
  satMid: number;
  satName: string;
  satNetBeanList: SatNetBeanList[];
  satSid: string;
  satUser: string;
}
