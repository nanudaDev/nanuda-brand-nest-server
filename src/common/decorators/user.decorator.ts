import { createParamDecorator } from '@nestjs/common';
import * as express from 'express';
import { Request } from 'express';

// TODO: SWITCH TO REQUEST FOR REQ
export const UserInfo = createParamDecorator((data: string, req: any) => {
  return data ? req.user && req.user[data] : req.user;
});

export const LegacyUserInfo = createParamDecorator((data: string, req: any) => {
  return data ? req.decoded && req.decoded[data] : req.decoded;
});
