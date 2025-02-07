import { Body, Controller, Get, NotFoundException, Param, Post, Query, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AxiosService } from "@/services/axios/axios.service";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "@/auths/current-user-decorator";
import { TokenPayloadSchema } from "@/auths/jwt-strategy";
import { PrismaService } from "@/services/prisma/prisma.service";
import { JwtAuthGuard } from "@/auths/jwt-auth.guard";


@Controller('/pokemon')
export class SearchPokemonController {
  constructor(
    private api: AxiosService,
    private prisma: PrismaService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(
    @CurrentUser() user: TokenPayloadSchema,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('name') name?: string
  ){


    const pokemonList = await this.api.list(user, page, limit, name)

    if(pokemonList.total === 0){
      throw new UnauthorizedException('Pokemon não encontrado para este usuário.')
    }
    return pokemonList ;
    
  }

  
}