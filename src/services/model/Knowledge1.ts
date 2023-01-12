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
  * @description 知识
  * @property `[createType]` 创建类型
  * @property `[diagnosis]` 参与诊断(0_否, 1_是)
  * @property `[editUser]` 编辑用户
  * @property `[expression]` 知识表达式
  * @property `[faultDelay]` 故障延迟
  * @property `[faultLevel]` 故障等级(1_一般, 2_严重，3_警告)
  * @property `[faultPart]` 故障部件
  * @property `[globalParams]` 全局参数
  * @property `[graphInfo]` 图形信息
  * @property `[returnType]` 返回值类型(0_无, 1_INT，2_FLOAT,3_STRING,4_BOOLEAN)
  * @property `ruleName` 规则名
  * @property `[subsystem]` 分系统
  * @property `[targetCode]` 对象代号
  * @property `[targetId]` 对象ID
  * @property `uuid` 知识唯一标识uuid(新建知识不用填自动生成，更新知识时必填)
  */
export interface Knowledge1 {
  /**
   * 创建类型
   */
  "createType"?: string;
  /**
   * 参与诊断(0_否, 1_是)
   */
  "diagnosis"?: number;
  /**
   * 编辑用户
   */
  "editUser"?: string;
  /**
   * 知识表达式
   */
  "expression"?: string;
  /**
   * 故障延迟
   */
  "faultDelay"?: number;
  /**
   * 故障等级(1_一般, 2_严重，3_警告)
   */
  "faultLevel"?: number;
  /**
   * 故障部件
   */
  "faultPart"?: string;
  /**
   * 全局参数
   */
  "globalParams"?: Array<models.TelemetryParam>;
  /**
   * 图形信息
   */
  "graphInfo"?: string;
  /**
   * 返回值类型(0_无, 1_INT，2_FLOAT,3_STRING,4_BOOLEAN)
   */
  "returnType"?: number;
  /**
   * 规则名
   */
  "ruleName": string;
  /**
   * 分系统
   */
  "subsystem"?: string;
  /**
   * 对象代号
   */
  "targetCode"?: string;
  /**
   * 对象ID
   */
  "targetId"?: number;
  /**
   * 知识唯一标识uuid(新建知识不用填自动生成，更新知识时必填)
   */
  "uuid": string;
}

