import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { GoogleStrategy } from 'strategies/google.strategy';
import { UserModule } from 'src/user/user.module';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'strategies/jwt.strategy';
import { FacebookStrategy } from 'strategies/facebook.strategy';
import { LocalStrategy } from 'strategies/local.strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, RefreshToken]),
    ConfigModule.forRoot(), // Load environment variables
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule to use ConfigService
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');

        return {
          secret,
          signOptions: {
            expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRY')

          },

        };
      },
      inject: [ConfigService], // Inject ConfigService
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    GoogleStrategy,
    FacebookStrategy,
    JwtStrategy
  ],
})
export class AuthModule { }
