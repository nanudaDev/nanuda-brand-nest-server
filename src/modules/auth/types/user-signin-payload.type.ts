import { ADMIN_ROLES, ADMIN_STATUS } from 'src/shared';
import { UserType } from './role.type';

export interface UserSigninPayload {
  _id: number;
  name: string;
  userStatus?: ADMIN_STATUS;
  userRoles?: ADMIN_ROLES[];
  userType?: UserType;
}

export interface PlatformUserSigninPayload {
  _no: number;
  _id: string;
  username: string;
  userType: UserType | string;
  adminRole?: string;
  userStatus?: ADMIN_STATUS;
  userRoles?: ADMIN_ROLES[];
}
