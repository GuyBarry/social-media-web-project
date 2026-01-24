import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { googleOAuthConfig } from "../config/google.config";
import { serverConfig } from "../config/server.config";
import { CreateGoogleUser } from "../entities/dto/user.dto";
import { usersService } from "../users/users.service";

const googleAuth = new GoogleStrategy(
  {
    clientID: googleOAuthConfig.clientId,
    clientSecret: googleOAuthConfig.clientSecret,
    callbackURL: `${serverConfig.serverUrl}${googleOAuthConfig.callbackEndpoint}`,
    proxy: true,
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const existingUser = await usersService.getUserByEmail(profile.email);

      if (existingUser) {
        const { password, googleId, ...otherFields } = existingUser;

        return done(null, { ...otherFields });
      }
    } catch (error) {
      console.log("Existing user not found, creating new user");
    }

    try {
      const newUser: CreateGoogleUser = {
        email: profile.email as string,
        birthDate: profile.birthDate as string,
        username: profile.email as string,
        googleId: profile.id as string,
      };

      const user = await usersService.createUser(newUser);

      done(null, user);
    } catch (error) {
      console.error("error with google user auth", error);
    }
  }
);

passport.use(googleAuth);
