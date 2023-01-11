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
 * @description 公共任务
 * @property `createType` 创建类型
 * @property `dagJson` dag json数据
 * @property `taskIdentify` 任务标识
 * @property `taskName` 任务名称
 */
export interface CommonTask01 {
  /**
   * 创建类型
   */
  createType: string;
  /**
   * dag json数据
   */
  dagJson: string;
  /**
   * 任务标识
   */
  taskIdentify: string;
  /**
   * 任务名称
   */
  taskName: string;
}
