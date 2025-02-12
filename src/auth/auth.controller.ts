import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "guards/jwt-auth.guard";
import { CurrentUser } from "decorators/current-user.decorator";
import { User } from "src/user/entities/user.entity";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  // Google routes
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req) {
    const { accessToken, refreshToken } = await this.authService.generateTokens(req.user);
    return { accessToken, refreshToken };
  }


  // Facebook routes
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() { }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req) {
    return this.authService.generateTokens(req.user);
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.rotateRefreshToken(refreshToken);
  }

  // Protected routes examples
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  protectedRoute(@CurrentUser() user: User) {
    return {
      message: 'This is a protected route',
      user: {
        id: user.id,
        email: user.email
      }
    };
  }
}