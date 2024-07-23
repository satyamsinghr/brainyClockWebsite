import { User } from "./user.model";

export interface AuthenticatedResponse extends User {
  access_token: string;
}
