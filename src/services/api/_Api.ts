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

import ajax, { AjaxPromise, ExtraFetchParams } from '@ajax';
import * as models from '../model/models';

/* tslint:disable:no-unused-variable member-ordering object-literal-shorthand */

/**
  * 知识函数
  */
export type ParamsBodykmsZsbjServerApiCommonFunctionAddPost = models.KnowledgeFunDto;
/**
  * @description kmsZsbjServerApiCommonFunctionListGet参数
  * @property `[name]` name
  */
export interface ParamskmsZsbjServerApiCommonFunctionListGet {
  // queryParams
  /**
   * name
   */
  name?: string;
}
/**
  * 知识公共函数表
  */
export type ParamsBodykmsZsbjServerApiCommonFunctionUpdatePut = models.KnowledgeFunction;

export class _Api {
  protected $basePath = ''.replace(/\/$/, '');

  public constructor(basePath?: string) {
    if (basePath !== undefined) {
      this.$basePath = basePath.replace(/\/$/, '');
    }
  }

  /**
   * 
   * @summary 新建一个函数
   
   * @param data: ParamsBodykmsZsbjServerApiCommonFunctionAddPost// 知识函数
   * @param opt ajax config
   * @returns models.BaseResponse
   */
  public kmsZsbjServerApiCommonFunctionAddPost = (
    
    data: ParamsBodykmsZsbjServerApiCommonFunctionAddPost,opt?: ExtraFetchParams
  ) : AjaxPromise<models.BaseResponse>  => {
    const url = this.$basePath + `/kms-zsbj-server/api/common/function/add`;
    const p: any = {};
    p.data = data;
    return ajax.ajax({
      ...opt,
      method: 'POST',
      url,
      ...p
    });
  }
  /**
   * 
   * @summary 查询函数列表
   * @param params ParamskmsZsbjServerApiCommonFunctionListGet
   
   * @param opt ajax config
   * @returns models.BaseResponseListKnowledgeFunction
   */
  public kmsZsbjServerApiCommonFunctionListGet = (
    params: ParamskmsZsbjServerApiCommonFunctionListGet,
    opt?: ExtraFetchParams
  ) : AjaxPromise<models.BaseResponseListKnowledgeFunction>  => {
    const url = this.$basePath + `/kms-zsbj-server/api/common/function/list`;
    const p: any = {};
    p.query = {};
    if ('name' in params) p.query.name = params.name;
    return ajax.ajax({
      ...opt,
      method: 'GET',
      url,
      ...p
    });
  }
  /**
   * 
   * @summary 更新函数内容
   
   * @param data: ParamsBodykmsZsbjServerApiCommonFunctionUpdatePut// 知识公共函数表
   * @param opt ajax config
   * @returns models.BaseResponse
   */
  public kmsZsbjServerApiCommonFunctionUpdatePut = (
    
    data: ParamsBodykmsZsbjServerApiCommonFunctionUpdatePut,opt?: ExtraFetchParams
  ) : AjaxPromise<models.BaseResponse>  => {
    const url = this.$basePath + `/kms-zsbj-server/api/common/function/update`;
    const p: any = {};
    p.data = data;
    return ajax.ajax({
      ...opt,
      method: 'PUT',
      url,
      ...p
    });
  }
  /**
   * 
   * @summary 获取分系统列表
   
   
   * @param opt ajax config
   * @returns models.BaseResponseListstring
   */
  public kmsZsbjServerApiCommonSubsystemsGet = (
    
    opt?: ExtraFetchParams
  ) : AjaxPromise<models.BaseResponseListstring>  => {
    const url = this.$basePath + `/kms-zsbj-server/api/common/subsystems`;
    const p: any = {};
    return ajax.ajax({
      ...opt,
      method: 'GET',
      url,
      ...p
    });
  }
}

export default new _Api();