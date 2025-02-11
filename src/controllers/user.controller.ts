import { Body, UnauthorizedException, UsePipes } from "@nestjs/common";
import { ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Controller, HttpCode, Post } from "@nestjs/common";

import { hash, compare } from "bcrypt";
import { PrismaService } from "../services/prisma/prisma.service";

import { ZodValidationPipe } from "../pipes/zod-validation-pipes";
import { z } from "zod"


const UserBodySchema = z.object({
  email: z.string().email(),
  password: z.string()
})

type UserBodySchema = z.infer<typeof UserBodySchema>

@Controller('/users')
export class UserController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService

  ) {}

  @Post('/register')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(UserBodySchema))
  async register(@Body() body: UserBodySchema){
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

  @Post('/login')
    @UsePipes(new ZodValidationPipe(UserBodySchema))
    async login(@Body() body: UserBodySchema){
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