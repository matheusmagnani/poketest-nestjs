import { 
  Body,
  Controller,
  Get,
  Post,
  Query,
  UnauthorizedException,
  UseGuards
 } from "@nestjs/common";
 
import { PokemonRepository } from "@/repositories/pokemon-repository";

import { CurrentUser } from "@/auths/current-user-decorator";
import { TokenPayloadSchema } from "@/auths/jwt-strategy";
import { JwtAuthGuard } from "@/auths/jwt-auth.guard";


@Controller('/pokemon')
export class PokemonController {
  constructor(
    private pokemonRepository: PokemonRepository
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async register(
    @Body() body: {name: string, imagePokemon?: string},
    @CurrentUser() user: TokenPayloadSchema
  ){

     const duplicatePokemon =  await this.pokemonRepository.findByNameAndUserId(body.name, user);
      
     if (duplicatePokemon) {
      throw new UnauthorizedException('Pokemon ja cadastrado')
    }

    const pokemon = await this.pokemonRepository.savePokemon(body, user);
    return pokemon ;
    
  }

  @Get()
    @UseGuards(JwtAuthGuard)
    async search(
      @CurrentUser() user: TokenPayloadSchema,
      @Query('page') page?: string,
      @Query('limit') limit?: string,
      @Query('name') name?: string
    ){
  
  
      const pokemonList = await this.pokemonRepository.list(user, page, limit, name)
  
      if(pokemonList.total === 0){
        throw new UnauthorizedException('Pokemon não encontrado para este usuário.')
      }
      return pokemonList ;
      
    }
  
}