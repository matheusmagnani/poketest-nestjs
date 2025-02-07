import { BadRequestException, Body, Injectable, InternalServerErrorException, NotFoundException, Query } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { z } from 'zod';
import { CurrentUser } from '@/auths/current-user-decorator';
import { TokenPayloadSchema } from '@/auths/jwt-strategy';

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
export class AxiosService {
  constructor(private prisma: PrismaService) {}

  async fetchPokemonData(
    @Body() body: { name: string; imagePokemon?: string }
  ) {

    try {
      // Verifique se o "name" é passado corretamente
      const { name, imagePokemon } = body;
  
      if (!name) {
        throw new BadRequestException("O nome do Pokémon é obrigatório.");
      }
      
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);

      let image;
      if (imagePokemon === "game") {
        image = response.data.sprites.front_default;
      } else if (imagePokemon === "anime") {
        image = response.data.sprites.other.home.front_default;
      } else if (!imagePokemon) {
        image = response.data.sprites.other.home.front_default;
      } else {
        // Caso o valor de imagePokemon seja inválido
        throw new BadRequestException("Imagem solicitada não é válida. Use 'game' ou 'anime'.");
      }
  
      const data = {
        name: response.data.name,
        height: response.data.height,
        weight: response.data.weight,
        abilities: response.data.abilities.map((ability: { ability: { name: string } }) => ability.ability.name),
        image,
        createdAt: new Date(),
        updatedAt: new Date()
      };
  
      const validatedData = registerPokemonBodySchema.parse(data); 
      return validatedData;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new NotFoundException(`Pokémon não encontrado.`);
      } else {
        // Para erros que não sejam de não encontrado
        throw new InternalServerErrorException(`Erro ao buscar o Pokémon: ${error.message}`);
      }
    }
  }

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
    const pokemonData = await this.fetchPokemonData(body);

    return this.prisma.pokemon.create({
      data: {
        name: pokemonData.name,
        height: pokemonData.height,
        weight: pokemonData.weight,
        abilities: pokemonData.abilities,
        image: pokemonData.image,
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