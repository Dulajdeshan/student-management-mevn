import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentCreateDTO } from './dto/student-create.input';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  async create(student: StudentCreateDTO): Promise<Student> {
    const _student = this.studentRepository.create(student);
    return this.studentRepository.save(_student);
  }
}
