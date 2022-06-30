import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, BaseEntity } from 'typeorm';
import { Book } from './book.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Author extends BaseEntity{

    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => String)
    @Column()
    fullName!: string

    @Field(()=>[Book],{ nullable: true })
    @OneToMany(() => Book, book => book.author, { nullable: true , onDelete: 'CASCADE'})
    books!: Book[]

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string
}