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
  * @property `[data]` 
  * @property `[errorMsg]` 错误信息
  * @property `[success]` 返回状态
  */
export interface BaseResponseParameterOutPo {
  "data"?: models.ParameterOutPo;
  /**
   * 错误信息
   */
  "errorMsg"?: string;
  /**
   * 返回状态
   */
  "success"?: boolean;
}

