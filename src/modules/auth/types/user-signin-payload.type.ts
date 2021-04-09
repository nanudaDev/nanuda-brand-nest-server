import { ACCOUNT_STATUS, ADMIN_ROLES, ADMIN_STATUS } from 'src/shared';
import { UserType } from './role.type';

export interface UserSigninPayload {
  _id: number;
  name: string;
  userStatus?: ADMIN_STATUS;
  userRoles?: ADMIN_ROLES[];
  userType?: UserType;
}

export interface PlatformUserSigninPayload {
  _id: number;
  username: string;
  userType: UserType | string;
  adminRole?: string;
  userStatus?: ADMIN_STATUS;
  userRoles?: ADMIN_ROLES[];
}

export interface PickcookUserSigninPayload {
  _id: number;
  username?: string;
  phone: string;
  email?: string;
  accountStatus: ACCOUNT_STATUS;
  passwordUpdateDate?: Date;
  userType: UserType;
}
