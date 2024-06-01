import jwt from 'jsonwebtoken';
import { Response, NextFunction } from "express";
import { EHTTPCode, ICustomRequest } from '../interfaces/common';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authenticate = async (req: ICustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(EHTTPCode.UNAUTHORIZED).json({
            status: false,
            data: null,
            message: "No token provided"
        });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(EHTTPCode.UNAUTHORIZED).json({
            status: false,
            data: null,
            message: "No token provided"
        });
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        if (!payload) {
            return res.status(EHTTPCode.UNAUTHORIZED).json({
                status: false,
                data: null,
                message: "Failed to authenticate token"
            });
        }
        req.decodedToken = payload;
        next();
    } catch (err) {
        return res.status(EHTTPCode.UNAUTHORIZED).json({
            status: false,
            data: null,
            message: "Failed to authenticate token"
        });
    }
}
