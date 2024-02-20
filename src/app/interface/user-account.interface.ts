import {USER_AUTHORITY} from "../type-declarations";

export interface UserAccount {
  userId: number,
  username: string,
  accountCreationDate: Date,
  authorities: USER_AUTHORITY[]
}
