import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { AuthModule } from './auths/auth.module';
import { UserController } from './controllers/user.controller';
import { PokemonController } from './controllers/pokemon.controller';
import { PrismaService } from './services/prisma/prisma.service';
import { AxiosService } from './services/axios/axios.service';
import { PokemonRepository } from './repositories/pokemon-repository';
import { FetchPokemonUseCaseService } from './services/fetch-pokemon-use-case.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true
    }),
    AuthModule,
    
],
  controllers: [
    UserController,
    PokemonController
  ],
  providers: [PrismaService, AxiosService, FetchPokemonUseCaseService, PokemonRepository],
})
export class AppModule {}
