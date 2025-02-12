// import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as crypto from 'crypto';
// import { InjectRepository } from "@nestjs/typeorm";
// import { User } from "src/user/entities/user.entity";
// import { Repository } from "typeorm";
// import { RefreshToken } from "./entities/refresh-token.entity";
// import { JwtService } from "@nestjs/jwt";
// import { SocialUserDto } from "./dto/social-user.dto";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { RefreshToken } from "./entities/refresh-token.entity";
import { JwtService } from "@nestjs/jwt";
import { SocialUserDto } from "./dto/social-user.dto";

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User) private userRepository: Repository<User>,
//     @InjectRepository(RefreshToken) private refreshTokenRepository: Repository<RefreshToken>,
//     private jwtService: JwtService,
//   ) { }

//   async validateSocialUser(socialUser: SocialUserDto): Promise<User> {
//     const { email, provider, accessToken, refreshToken } = socialUser;
//     const user = await this.userRepository.findOne({ where: { email } });

//     if (user) {
//       user[`${provider}Id`] = socialUser.id;
//       user.tokens = { accessToken, refreshToken };
//       return this.userRepository.save(user);
//     }

//     return this.userRepository.save({
//       email,
//       [provider + 'Id']: socialUser.id,
//       tokens: { accessToken, refreshToken },
//     });
//   }

//   async generateTokens(user: User) {
//     const payload = { email: user.email, sub: user.id };

//     const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
//     const refreshToken = await this.createRefreshToken(user);

//     return { accessToken, refreshToken };
//   }

//   private async createRefreshToken(user: User): Promise<string> {
//     try {
//       const token = crypto.randomBytes(64).toString('hex');
//       const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

//       const refreshToken = this.refreshTokenRepository.create({
//         token,
//         user,
//         userId: user.id,  // Add this line
//         expiresAt,
//       });

//       console.log('Attempting to save refresh token:', refreshToken);
//       const result = await this.refreshTokenRepository.save(refreshToken);
//       console.log('Refresh token saved result:', result);

//       return token;
//     } catch (error) {
//       console.error('Error saving refresh token:', error);
//       throw error;
//     }
//   }

//   async rotateRefreshToken(oldRefreshToken: string) {
//     const refreshToken = await this.refreshTokenRepository.findOne({
//       where: { token: oldRefreshToken },
//       relations: ['user'],
//     });

//     if (!refreshToken || refreshToken.revoked || refreshToken.used || refreshToken.expiresAt < new Date()) {
//       throw new UnauthorizedException('Invalid refresh token');
//     }

//     // Mark old token as used
//     refreshToken.used = true;
//     await this.refreshTokenRepository.save(refreshToken);

//     // Generate new tokens
//     return this.generateTokens(refreshToken.user);
//   }
// }

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(RefreshToken) private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) { }

  async validateSocialUser(socialUser: SocialUserDto): Promise<User> {
    try {
      const { email, provider, accessToken, refreshToken, id } = socialUser;

      let user = await this.userRepository.findOne({
        where: { email },
        relations: ['refreshTokens']
      });

      if (user) {
        // Update existing user
        user[`${provider}Id`] = id;
        user.tokens = { accessToken, refreshToken };

        const updatedUser = await this.userRepository.save(user);

        return updatedUser;
      }

      // Create new user
      const newUser = this.userRepository.create({
        email,
        [`${provider}Id`]: id,
        tokens: { accessToken, refreshToken },
      });

      const savedUser = await this.userRepository.save(newUser);

      return savedUser;
    } catch (error) {
      console.error('Error in validateSocialUser:', error);
      throw error;
    }
  }

  async generateTokens(user: User) {
    try {
      const payload = { email: user.email, sub: user.id };

      // Generate JWT access token
      const accessToken = this.jwtService.sign(payload);

      // Create and save refresh token
      const refreshToken = await this.createRefreshToken(user);

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error generating tokens:', error);
      throw error;
    }
  }

  async rotateRefreshToken(oldRefreshToken: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token: oldRefreshToken },
      relations: ['user'],
    });

    if (!refreshToken || refreshToken.revoked || refreshToken.used || refreshToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Mark old token as used
    refreshToken.used = true;
    await this.refreshTokenRepository.save(refreshToken);

    // Generate new tokens
    return this.generateTokens(refreshToken.user);
  }

  private async createRefreshToken(user: User): Promise<string> {
    try {
      // Verify user has an ID
      if (!user.id) {
        console.error('User has no ID:', user);
        throw new Error('User ID is required to create refresh token');
      }

      const token = crypto.randomBytes(64).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const refreshToken = this.refreshTokenRepository.create({
        token,
        user,
        userId: user.id,
        expiresAt,
        used: false,
        revoked: false
      });

      const savedToken = await this.refreshTokenRepository.save(refreshToken);

      return token;
    } catch (error) {
      console.error('Error creating refresh token:', error);
      throw error;
    }
  }
}