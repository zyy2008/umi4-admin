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
  * @property `[satelliteCode]` 卫星代号
  * @property `[ycExist]` 图谱中存在的遥测参数集
  * @property `[ycNoExist]` 图谱中不存在的遥测参数集
  */
export interface ParameterOutPo {
  /**
   * 卫星代号
   */
  "satelliteCode"?: string;
  /**
   * 图谱中存在的遥测参数集
   */
  "ycExist"?: Array<string>;
  /**
   * 图谱中不存在的遥测参数集
   */
  "ycNoExist"?: Array<string>;
}
