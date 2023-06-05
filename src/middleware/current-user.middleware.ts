import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(
        private authService: AuthService,
        private jwtService: JwtService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            const decodedToken = this.jwtService.decode(token);

            // @ts-ignore
            if (decodedToken && decodedToken.userId) {
                // @ts-ignore
                const user = await this.authService.findOne(decodedToken.userId);

                // @ts-ignore
                req.currentUser = user;
            }
        }

        next();
    }
}