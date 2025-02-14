import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from 'config/ormconfig';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenCleanupService } from 'Services/token-cleanup.service';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { PaymentModule } from './payment/payment.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot(ormConfig),
    ScheduleModule.forRoot(), // Enable task scheduling
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([RefreshToken]),
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService, TokenCleanupService],
})
export class AppModule { }
