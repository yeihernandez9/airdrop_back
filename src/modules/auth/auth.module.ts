import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RoleEntity } from '../role/role.entity';
import { AuthService } from './auth.service';
import { UserEntity } from '../user/user.entity';
import { SharedService } from 'src/shared/shared.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory() {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            //expiresIn: 3600,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, JwtStrategy, SharedService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
