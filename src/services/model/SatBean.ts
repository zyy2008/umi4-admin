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
 * @property `mid` 任务代号
 * @property `satCode` 卫星代号
 * @property `satName` 卫星名称
 * @property `[satSid]`
 */
export interface SatBean {
  /**
   * 任务代号
   */
  mid: number;
  /**
   * 卫星代号
   */
  satCode: string;
  /**
   * 卫星名称
   */
  satName: string;
  satSid?: string;
  pkId?: number;
}
