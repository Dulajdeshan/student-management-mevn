import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudentCreateDTO } from './dto/student-create.dto';
import { StudentFindDTO } from './dto/student-find.dto';
import { StudentUpdateDTO } from './dto/student-update.dto';
import { Student } from './entities/student.entity';
import { StudentService } from './student.service';

@Resolver(() => Student)
export class StudentResolver {
  constructor(private studentService: StudentService) {}

  @Query(() => [Student], { name: 'getAllStudents' })
  findAll() {
    return this.studentService.findAll();
  }

  @Query(() => Student, { name: 'getStudent' })
  findOne(@Args('student') student: StudentFindDTO) {
    return this.studentService.findOne(student);
  }

  @Mutation(() => Student, { name: 'createStudent' })
  create(@Args('student') student: StudentCreateDTO) {
    return this.studentService.create(student);
  }

  @Mutation(() => Student, { name: 'updateStudent' })
  update(@Args('student') student: StudentUpdateDTO) {
    return this.studentService.update(student);
  }
}
