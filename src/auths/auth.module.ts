import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Env } from "@/env";
import { JwtStrategy } from "./jwt-strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(config: ConfigService<Env, true>){
        const secretKey =config.get('JWT_SECRET', {infer: true})
        
        return {
          signOptions: { algorithm: 'HS256'},
          secret: secretKey,

        }
      },
    }),
  ],
  providers: [JwtStrategy]
})
export class AuthModule {

}