/**
 * kms
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
  * @description 算法表
  * @property `[activateVersion]` 活跃版本号
  * @property `[algorithmIdentify]` 算法标识
  * @property `[algorithmName]` 算法名称
  * @property `[assessTime]` 评估时长
  * @property `[createTime]` 创建时间
  * @property `[createUser]` 添加人
  * @property `[id]` 主键id
  * @property `[isLoad]` 是否加载
  * @property `[loadTime]` 加载时间
  * @property `[updateTime]` 编辑时间
  * @property `[updateUser]` 编辑人
  */
export interface Algorithm {
  /**
   * 活跃版本号
   */
  "activateVersion"?: string;
  /**
   * 算法标识
   */
  "algorithmIdentify"?: string;
  /**
   * 算法名称
   */
  "algorithmName"?: string;
  /**
   * 评估时长
   */
  "assessTime"?: number;
  /**
   * 创建时间
   */
  "createTime"?: Date;
  /**
   * 添加人
   */
  "createUser"?: string;
  /**
   * 主键id
   */
  "id"?: number;
  /**
   * 是否加载
   */
  "isLoad"?: number;
  /**
   * 加载时间
   */
  "loadTime"?: Date;
  /**
   * 编辑时间
   */
  "updateTime"?: Date;
  /**
   * 编辑人
   */
  "updateUser"?: string;
}

