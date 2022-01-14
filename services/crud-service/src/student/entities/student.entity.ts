import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Student {
  @Field()
  @PrimaryGeneratedColumn()
  id?: number;
  @Field()
  @Column()
  name?: string;
  @Field()
  @Column()
  gender?: string;
  @Field()
  @Column()
  address?: string;
  @Field()
  @Column()
  mobile?: string;
  @Field()
  @Column()
  dob?: Date;
  @Field()
  @CreateDateColumn()
  createdAt?: Date;
}
