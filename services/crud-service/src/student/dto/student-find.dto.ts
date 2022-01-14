import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType('StudentFindInput')
@ArgsType()
export class StudentFindDTO {
  @Field(() => Int)
  @IsNumber()
  id: number;
}
