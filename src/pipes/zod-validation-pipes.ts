import {
  PipeTransform,
} from '@nestjs/common'
import { ZodObject } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown){
    try {
      return this.schema.parse(value)
     } catch (error){}
    return value
  }
}