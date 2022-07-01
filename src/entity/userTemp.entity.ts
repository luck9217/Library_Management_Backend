import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  BaseEntity,
} from "typeorm";

import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class UserTemp extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  fullName!: string;

  @Field()
  @Column()
  email!: string;

  @Field()
  @Column()
  password!: string;

  @Field()
  @Column()
  code!: string;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  inicialDate!: string;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  finalDate!: string;
}
