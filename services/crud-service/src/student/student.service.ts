import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentCreateDTO } from './dto/student-create.dto';
import { StudentFindDTO } from './dto/student-find.dto';
import { StudentUpdateDTO } from './dto/student-update.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find({
      order: {
        createdAt: 'ASC',
      },
    });
  }

  async findOne(student: StudentFindDTO): Promise<Student> {
    const _student = await this.studentRepository.findOne(student.id);
    if (!_student) {
      throw new NotFoundException('Student not found');
    }
    return _student;
  }

  async create(student: StudentCreateDTO): Promise<Student> {
    const _student = this.studentRepository.create(student);
    return this.studentRepository.save(_student);
  }

  async update(student: StudentUpdateDTO): Promise<Student> {
    const _studentExists = await this.studentRepository.findOne(student.id);
    if (!_studentExists) {
      throw new NotFoundException('Student not found');
    }
    return this.studentRepository.save(student);
  }
}
