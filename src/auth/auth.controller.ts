import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from 'express';
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "guards/jwt-auth.guard";
import { CurrentUser } from "decorators/current-user.decorator";
import { User } from "src/user/entities/user.entity";
import { SignupDto } from "./dto/signup.dto";
import { SigninDto } from "./dto/signin.dto";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  // local auth routes
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  @UseGuards(AuthGuard('local'))
  async signin(@Req() req, @Body() signinDto: SigninDto) {
    return this.authService.generateTokens(req.user);
  }

  // Google routes
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.generateTokens(req.user);
    // return { accessToken, refreshToken };
    // Redirect to frontend with tokens as query params
    res.redirect(`http://localhost:3000/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);

  }


  // Facebook routes
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() { }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(@Req() req, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.generateTokens(req.user);
    // return { accessToken, refreshToken };
    // Redirect to frontend with tokens as query params
    res.redirect(`http://localhost:3000/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);

  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.rotateRefreshToken(refreshToken);
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