import { 
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';
import { AxiosService } from './axios/axios.service';

import { z } from 'zod';

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
export class FetchPokemonUseCaseService {
  constructor(
    private axios: AxiosService
  ) {}

  async fetchPokemonData(
    @Body() body: { name: string; imagePokemon?: string }
  ) {

    try {
      const { name, imagePokemon } = body;
  
      if (!name) {
        throw new BadRequestException("O nome do Pokémon é obrigatório.");
      }
      
      const response = await this.axios.get(name);

      let image: string;
      if (imagePokemon === "game") {
        image = response.data.sprites.front_default;
      } else if (imagePokemon === "anime") {
        image = response.data.sprites.other.home.front_default;
      } else if (!imagePokemon) {
        image = response.data.sprites.other.home.front_default;
      } else {
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
}