import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { AuthModule } from './auths/auth.module';
import { PrismaService } from './services/prisma/prisma.service';
import { RegisterUserController } from './controllers/user/register-user.controller';
import { LoginUserController } from './controllers/user/login-user.controller';
import { RegisterPokemonController } from './controllers/pokemon/register-pokemon.controller';
import { AxiosService } from './services/axios/axios.service';
import { SearchPokemonController } from './controllers/pokemon/search-pokemon.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true
    }),
    AuthModule,
],
  controllers: [
    RegisterUserController,
    LoginUserController,
    RegisterPokemonController,
    SearchPokemonController
  ],
  providers: [PrismaService, AxiosService],
})
export class AppModule {}
