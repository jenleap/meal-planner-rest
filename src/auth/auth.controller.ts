import { Controller, Post, Body, Get, Param, NotFoundException, Request } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('api/auth')
//@Serialize(UserDto)
export class AuthController {
    constructor(private authService: AuthService,
        private jwtService: JwtService) {}

    @Get('/whoami')
    whoAmI(@Request() request) {
        return request.currentUser;
    }

    @Post('/register')
    async createUser(@Body() body: CreateUserDto) {
        const user = await this.authService.register(body);

        return user;
    }

    @Post('/login')
    async login(@Body() body: LoginUserDto) {
        const user = await this.authService.validateUser(body.username, body.password);

        const jwt = await this.jwtService.signAsync({
            userId: user.id
        });

        return {
            access_token: jwt
        }
    }

    @Get('/:id')
    async getUser(@Param('id') id: string) {
        const user = await this.authService.findOne(parseInt(id));

        if (user) {
            return user;
        } else {
            throw new NotFoundException("User not found.");
        }
    }

}
