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
  * @property `[current]` 
  * @property `[pages]` 
  * @property `[records]` 
  * @property `[size]` 
  * @property `[total]` 
  */
export interface IPageKnowledgeDetailInfo {
  "current"?: number;
  "pages"?: number;
  "records"?: Array<models.KnowledgeDetailInfo>;
  "size"?: number;
  "total"?: number;
}
