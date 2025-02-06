import { Body, UnauthorizedException, UsePipes } from "@nestjs/common";
import { ConflictException } from "@nestjs/common";
import { Controller, HttpCode, Post } from "@nestjs/common";
import { hash } from "bcrypt";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipes";
import { PrismaService } from "../../services/prisma/prisma.service";
import { z } from "zod"

const registerUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string()
})

type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>

@Controller('/users')
export class RegisterUserController {
  constructor(private prisma: PrismaService) {}

  @Post('/register')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerUserBodySchema))
  async handle(@Body() body: RegisterUserBodySchema){
    const {email, password} = body

    if( !email || !password){
      throw new UnauthorizedException('E-mail ou senha inválidos.')
    }

    const useralreadyexists = await this.prisma.user.findUnique({
      where: {
        email,
      }
    })

    if (useralreadyexists){
      throw new ConflictException('Usuário já cadastrado.')
    }

    const hashedpassword = await hash(password, 8)
  
    await this.prisma.user.create({
        data: {
          email,
          password: hashedpassword
        }
    })

    return {"message": "Usuário cadastrado com sucesso."}
  
  }
}