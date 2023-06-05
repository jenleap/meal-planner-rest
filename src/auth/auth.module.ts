import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { secretKey } from 'src/utils/auth-constants';
import { CurrentUserMiddleware } from 'src/middleware/current-user.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: secretKey,
      signOptions: { expiresIn: '30d'}
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService
  ],
  exports: [ AuthService ]
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
