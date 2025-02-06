import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Env } from "@/env";
import { z } from "zod";

const tokenPayloadSchema = z.object({
  sub: z.string().uuid()
})

export type TokenPayloadSchema = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const secretKey = config.get('JWT_SECRET', {infer: true} )
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretKey,
      algorithms: ['HS256']
    })
  }

  async validate(payload: TokenPayloadSchema){
    return tokenPayloadSchema.parse(payload)
  }
}