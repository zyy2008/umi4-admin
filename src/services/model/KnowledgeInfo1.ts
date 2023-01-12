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
  * @description 知识信息表
  * @property `[createType]` 创建类型
  * @property `[diagnosis]` 参与诊断(0_否, 1_是)
  * @property `[faultDelay]` 故障延迟
  * @property `[faultLevel]` 故障等级(1_一般, 2_严重，3_警告)
  * @property `[faultPart]` 故障部件
  * @property `[id]` 主键id
  * @property `[isUpload]` 是否加载(0_否, 1_是)
  * @property `[returnType]` 返回值类型(0_无, 1_INT，2_FLOAT,3_STRING,4_BOOLEAN)
  * @property `ruleName` 规则名
  * @property `[subsystem]` 分系统
  * @property `[targetCode]` 对象代号
  * @property `[targetId]` 对象ID
  * @property `uuid` 知识唯一标识uuid
  * @property `[version]` 版本号
  */
export interface KnowledgeInfo1 {
  /**
   * 创建类型
   */
  "createType"?: string;
  /**
   * 参与诊断(0_否, 1_是)
   */
  "diagnosis"?: number;
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
   * 主键id
   */
  "id"?: number;
  /**
   * 是否加载(0_否, 1_是)
   */
  "isUpload"?: number;
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
   * 知识唯一标识uuid
   */
  "uuid": string;
  /**
   * 版本号
   */
  "version"?: string;
}

