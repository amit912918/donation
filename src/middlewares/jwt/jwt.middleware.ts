import JWT from 'jsonwebtoken';
import moment from 'moment';
import httpErrors from 'http-errors';
import { NextFunction, Response } from 'express';
import { RequestType } from '../../helpers/shared/shared.type';
// import { redisClient } from '../../helpers/common/init_redis';
const notAuthorized = 'Request not Authorized';

type PayloadDataType = {
  requestIP: string;
  appUserId: string;
  DesigId: string;
};

export const verifyApplicationAccessToken = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader: any = req.headers['authorization'];

    let accessToken;
    if (authHeader) {
      accessToken = authHeader.split(' ')[1];
    }
    const decode: any = JWT.verify(accessToken, 'rana');
    console.log(decode, 'decode')
    req.payload = decode;
    next();
  } catch (error) {
    console.log(error, 'attendence log application error jwt')
    res.status(401).json({ error: error });
  }
};

export const verifyAccessToken = async (req: RequestType, res: Response, next: NextFunction): Promise<void> => {
  try {
    const JWT_ACCESS_TOKEN_HEADER = process.env.JWT_ACCESS_TOKEN_HEADER;

    if (!JWT_ACCESS_TOKEN_HEADER)
      throw httpErrors.UnprocessableEntity(`Unable to process Constant [JWT_ACCESS_TOKEN_HEADER]`);

    const refreshTokenHeader = JWT_ACCESS_TOKEN_HEADER;
    if (!req.headers?.[refreshTokenHeader]) throw httpErrors.Unauthorized(notAuthorized);
    const authHeader = req.headers?.[refreshTokenHeader];
    let bearerToken: string[] = [];
    if (typeof authHeader === 'string') {
      bearerToken = authHeader.split(' ');
    }
    const accessToken = bearerToken[1] != undefined ? bearerToken[1] : false;

    if (!accessToken) throw httpErrors.Unauthorized(notAuthorized);

    const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET

    if (!JWT_ACCESS_TOKEN_SECRET)
      throw httpErrors.UnprocessableEntity(`Unable to process Constant [JWT_ACCESS_TOKEN_SECRET]`);

    JWT.verify(accessToken, JWT_ACCESS_TOKEN_SECRET, (error: any, payload: any) => {
      // if (error || payload?.payloadData?.requestIP != req.ip) {
      //   throw httpErrors.Unauthorized(error);
      // }
      if (error) {
        throw httpErrors.Unauthorized(error);
      }
      req.payload = payload.payloadData;
      next();
    });
  } catch (error) {
    console.log("Error in verify access token", error);
    __sendJWTError(error, req, res);
  }
};

const __sendJWTError = async (error: any, req: RequestType, res: Response): Promise<void> => {
  const responseStatus = error.status || 500;
  const responseMessage = error.message || `Cannot resolve request [${req.method}] ${req.url}`;
  if (res.headersSent === false) {
    res.status(responseStatus);
    res.send({
      error: {
        status: responseStatus,
        message: responseMessage
      }
    });
  }
};