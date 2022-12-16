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
  * @description 对象任务列表
  * @property `[commonTask]` 
  * @property `[commonTaskId]` 公共任务id
  * @property `[config]` 公共任务配置
  * @property `[id]` 主键id
  * @property `[objId]` 对象id
  */
export interface ObjectCommonTask {
  "commonTask"?: models.CommonTask;
  /**
   * 公共任务id
   */
  "commonTaskId"?: number;
  /**
   * 公共任务配置
   */
  "config"?: string;
  /**
   * 主键id
   */
  "id"?: number;
  /**
   * 对象id
   */
  "objId"?: number;
}

