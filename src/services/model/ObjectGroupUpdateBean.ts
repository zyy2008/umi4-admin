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
  * @property `[objectCode]` 对象组标识
  * @property `[objectName]` 对象组名称
  * @property `[objectRemark]` 备注
  * @property `[pkId]` 主键
  */
export interface ObjectGroupUpdateBean {
  /**
   * 对象组标识
   */
  "objectCode"?: string;
  /**
   * 对象组名称
   */
  "objectName"?: string;
  /**
   * 备注
   */
  "objectRemark"?: string;
  /**
   * 主键
   */
  "pkId"?: number;
}

