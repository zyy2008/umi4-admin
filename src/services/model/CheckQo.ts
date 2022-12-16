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

import * as models from './models';

/**
  * @property `[endTime]` 结束时间
  * @property `[paramList]` 遥测参数列表
  * @property `[startTime]` 开始时间
  * @property `[uuid]` 知识唯一标识uuid
  * @property `[version]` 知识版本
  */
export interface CheckQo {
  /**
   * 结束时间
   */
  "endTime"?: Date;
  /**
   * 遥测参数列表
   */
  "paramList"?: Array<models.TelemetryParam>;
  /**
   * 开始时间
   */
  "startTime"?: Date;
  /**
   * 知识唯一标识uuid
   */
  "uuid"?: string;
  /**
   * 知识版本
   */
  "version"?: string;
}

