import {User} from "./user.interface";

export interface UserTokenInterface extends User {
  exp: number;
}
