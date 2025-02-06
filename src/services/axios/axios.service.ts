import { Body, Injectable, NotFoundException } from '@nestjs/common';
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
    @Body() name: string
  ){
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);

      const data = {
        name: response.data.name,
        height: response.data.height,
        weight: response.data.weight,
        abilities: response.data.abilities.map((ability: { ability: { name: string } }) => ability.ability.name),
        image: response.data.sprites.front_default,
        createdAt: new Date(),
        updatedAt: new Date()

      }

      const validatedData = registerPokemonBodySchema.parse(data); 
      return validatedData;
    } catch (error) {
      throw new NotFoundException(`Pokémon "${name}" não encontrado.`);
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
    @Body()name: string,
    @CurrentUser() user: TokenPayloadSchema
  ) {

    const userId = user.sub
    const pokemonData = await this.fetchPokemonData(name);

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
}