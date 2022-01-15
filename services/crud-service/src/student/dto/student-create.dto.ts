import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength } from 'class-validator';

@InputType('StudentCreateInput')
export class StudentCreateDTO {
  @Field()
  @IsString()
  name: string;
  @IsString()
  @Field()
  gender: string;
  @IsString()
  @Field()
  address: string;
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @Field()
  mobile: string;
  @Field()
  dob: Date;
}
