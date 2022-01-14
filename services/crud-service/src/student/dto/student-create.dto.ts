import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType('StudentCreateInput')
export class StudentCreateDTO {
  @Field()
  @IsString()
  name: string;
  @Field()
  gender: string;
  @Field()
  address: string;
  @Field()
  mobile: string;
  @Field()
  dob: Date;
}
