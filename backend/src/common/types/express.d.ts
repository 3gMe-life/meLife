import { AuthContext } from "../../modules/auth/auth.types";

declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: AuthContext;
    }
  }
}

export {};
