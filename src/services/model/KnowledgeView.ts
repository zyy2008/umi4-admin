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
  * @property `[id]` id
  * @property `[mark]` 节点级别(0:根节点,1:节点二,2:节点三,3:节点四)
  * @property `[name]` 节点名
  */
export interface KnowledgeView {
  /**
   * id
   */
  "id"?: number;
  /**
   * 节点级别(0:根节点,1:节点二,2:节点三,3:节点四)
   */
  "mark"?: number;
  /**
   * 节点名
   */
  "name"?: string;
}

