import { NestInterceptor, Injectable, ExecutionContext, CallHandler } from "@nestjs/common";
import { response } from "express";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor( private authService: AuthService) {}

    async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};

        if (userId) {
            const user = await this.authService.findOne(userId);
            request.currentUser = user;
        }

        return handler.handle();
    }
}