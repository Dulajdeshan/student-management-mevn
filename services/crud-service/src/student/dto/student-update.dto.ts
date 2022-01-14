import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { StudentCreateDTO } from './student-create.dto';

@InputType('StudentUpdateInput')
export class StudentUpdateDTO extends PartialType(StudentCreateDTO) {
  @Field(() => Int)
  id: number;
}
