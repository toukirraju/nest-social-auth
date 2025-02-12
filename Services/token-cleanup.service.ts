
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { Repository, LessThan } from 'typeorm';

@Injectable()
export class TokenCleanupService {
  private readonly logger = new Logger(TokenCleanupService.name);

  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) { }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Run daily at midnight
  async cleanUpExpiredTokens() {
    this.logger.log('Cleaning up expired tokens...');

    const deleted = await this.refreshTokenRepository.delete({
      expiresAt: LessThan(new Date()), // Delete tokens that have expired
    });

    this.logger.log(`Deleted ${deleted.affected} expired tokens`);
  }
}