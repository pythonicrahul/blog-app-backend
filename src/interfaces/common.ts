import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export enum EHTTPCode {
    STATUS_OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    CREATED = 201,
    INTERNAL_SERVER_ERROR = 500,
    NOT_FOUND = 404,
    TOO_MANY_REQUESTS = 429,
    FORBIDDEN = 403
}

export interface CustomJwtPayload extends JwtPayload {
    name?: string;
    email?: string;
}

/**
 * @minimum 1
 */
export type Page = number

/**
  * @minimum 1
  */
export type PageSize = number

export interface IMetaValue {
    items?: number,
    page?: Page,
    pages?: number,
    page_size?: PageSize
}

export interface ICustomRequest extends Request {
    decodedToken?: any;
}

export interface IResponseBase {
    status: boolean;
    data: any;
    meta?: IMetaValue;
    message: string;
    statusCode?: EHTTPCode;
}

export interface ITokenCreationRequest {
    sub: string;
    name: string;
    email: string;
}