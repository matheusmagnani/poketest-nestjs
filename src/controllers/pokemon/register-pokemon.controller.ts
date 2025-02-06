import { Body, Controller, NotFoundException, Post, UseGuards } from "@nestjs/common";
import { AxiosService } from "@/services/axios/axios.service";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "@/auths/current-user-decorator";
import { TokenPayloadSchema } from "@/auths/jwt-strategy";
import { PrismaService } from "@/services/prisma/prisma.service";


@Controller('/pokemon')
export class RegisterPokemonController {
  constructor(
    private api: AxiosService,
    private prisma: PrismaService
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async handle(
    @Body() body: {name: string},
    @CurrentUser() user: TokenPayloadSchema
  ){
    
    const duplicatePokemon = await this.api.findByNameAndUserId(body.name, user);
  
    if (duplicatePokemon) {
      throw new NotFoundException('Pokemon ja cadastrado')
    }

    const pokemon = await this.api.savePokemon(body.name, user);
    return pokemon ;

    
  }

  
}