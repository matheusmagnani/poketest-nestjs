import { CurrentUser } from "@/auths/current-user-decorator";
import { TokenPayloadSchema } from "@/auths/jwt-strategy";
import { FetchPokemonUseCaseService } from "@/services/fetch-pokemon-use-case.service";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Body, Injectable, NotFoundException, Query } from "@nestjs/common";
import { z } from "zod";

const registerPokemonBodySchema = z.object({
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  abilities: z.array(z.string()),
  image: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

@Injectable()
export class PokemonRepository {
  constructor(
      private prisma: PrismaService,
      private pokemonData : FetchPokemonUseCaseService
    ) {}
  
    async findByNameAndUserId(
      @Body()name: string,
      @CurrentUser() user: TokenPayloadSchema
    ) {
      const userId = user.sub

      return await this.prisma.pokemon.findFirst({
        where: {
          name,
          userId
        },
      });    
    }
    async savePokemon(
      @Body() body: {name: string; imagePokemon?: string },
      @CurrentUser() user: TokenPayloadSchema
    ) {
  
      const userId = user.sub
      const pokemonData = await this.pokemonData.fetchPokemonData(body);
  
      const data = registerPokemonBodySchema.parse(pokemonData); 

      return this.prisma.pokemon.create({
        data: {
          name: data.name,
          height: data.height,
          weight: data.weight,
          abilities: data.abilities,
          image: data.image,
          user:{
            connect: {id: userId}
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
      });
    }
  
    async list(
      @CurrentUser() user: TokenPayloadSchema,
      @Query('page') page?: string,
      @Query('limit') limit?: string, 
      @Query('name') name?: string
    ) {
      const pageNumber = Number(page) || 1;
      const limitNumber = Number(limit) || 10;
      const offset = (pageNumber - 1) * limitNumber;
      const userId = user.sub;
      
      try {
  
        const pokemonName = Array.isArray(name) ? name[0] : name;
  
  
        const pokemons = await this.prisma.pokemon.findMany({
          where: {
            userId,
            name: {
              contains: pokemonName,
              mode: "insensitive"
            },
          },
          skip: offset,
          take: limitNumber,
        });
  
        const total = await this.prisma.pokemon.count({
          where: {
            userId,
            name: {
              contains: pokemonName,
              mode: "insensitive"
            },
          },
        });
  
        return {
          data: pokemons,
          total,
          currentPage: pageNumber,
          totalPages: Math.ceil(total / limitNumber),
        };
      } catch (error) {
        throw new NotFoundException(`Erro ao buscar Pokémons: ${error.message}`);
      }
    
  }
}
