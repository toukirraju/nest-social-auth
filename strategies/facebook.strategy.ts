
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-facebook";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
    constructor(
        private authService: AuthService,
        private configService: ConfigService
    ) {
        super({
            clientID: configService.get<string>("FACEBOOK_APP_ID"),
            clientSecret: configService.get<string>("FACEBOOK_APP_SECRET"),
            callbackURL: configService.get<string>("FACEBOOK_CALLBACK_URL"),
            scope: "email",
            profileFields: ["emails", "name"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
    ) {
        const { emails, name } = profile;
        return this.authService.validateSocialUser({
            email: emails[0].value,
            name: `${name.givenName} ${name.familyName}`,
            accessToken,
            refreshToken,
            provider: "facebook",
            id: profile.id,
        });
    }
}