import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudentCreateDTO } from './dto/student-create.input';
import { Student } from './entities/student.entity';
import { StudentService } from './student.service';

@Resolver(() => Student)
export class StudentResolver {
  constructor(private studentService: StudentService) {}

  @Query(() => [Student], { name: 'getAllStudents' })
  findAll() {
    return this.studentService.findAll();
  }

  @Mutation(() => Student, { name: 'createStudent' })
  create(@Args('student') student: StudentCreateDTO) {
    return this.studentService.create(student);
  }
}
