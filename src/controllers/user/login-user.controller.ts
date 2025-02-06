import { Body, Controller, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipes";
import { PrismaService } from "../../services/prisma/prisma.service";
import { z } from "zod";

const loginUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string()
})

type LoginUserBodySchema = z.infer<typeof loginUserBodySchema>

@Controller('/users')
export class LoginUserController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  @Post('/login')
  @UsePipes(new ZodValidationPipe(loginUserBodySchema))
  async handle(@Body() body: LoginUserBodySchema){
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      }
    })

    if(!user){
      throw new UnauthorizedException('Credenciais inválidas.')
    }

    const isPasswordValid = await compare(password, user.password)

    if(!isPasswordValid){
      throw new UnauthorizedException('Credenciais inválidas.')
      
    }

    const accessToken = this.jwt.sign({ sub: user.id })

    return {
      token: accessToken
    }

  }
}