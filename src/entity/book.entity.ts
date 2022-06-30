import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { Author } from "./author.entity";
import { User } from "./user.entity";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Book extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field(() => Author)
  @ManyToOne(() => Author, (author) => author.books, { onDelete: "CASCADE" })
  author!: Author;

  @Field()
  @Column()
  isOnLoan!: boolean;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.books, { onDelete: "CASCADE" })
  userOwner!: User;

  @Field()
  @Column()
  DateLoan!: string;

  @Field()
  @Column()
  DateBackLoan!: string;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: string;
}