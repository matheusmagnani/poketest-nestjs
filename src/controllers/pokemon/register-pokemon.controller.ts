import { Body, Controller, Post, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AxiosService } from "@/services/axios/axios.service";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "@/auths/current-user-decorator";
import { TokenPayloadSchema } from "@/auths/jwt-strategy";
import { JwtAuthGuard } from "@/auths/jwt-auth.guard";


@Controller('/pokemon')
export class RegisterPokemonController {
  constructor(
    private api: AxiosService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body() body: {name: string, imagePokemon?: string},
    @CurrentUser() user: TokenPayloadSchema
  ){
    
    const duplicatePokemon = await this.api.findByNameAndUserId(body.name, user);
  
    if (duplicatePokemon) {
      throw new UnauthorizedException('Pokemon ja cadastrado')
    }

    const pokemon = await this.api.savePokemon(body, user);
    return pokemon ;

    
  }

  
}