import { NextFunction, Request, Response } from "express";

export const restrictTo = (roles: string[] | string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!user || !Array.isArray(allowedRoles) || allowedRoles.length === 0) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
