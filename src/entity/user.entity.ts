import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, BaseEntity, OneToMany } from 'typeorm';
import { Author } from './author.entity';
import { Book } from './book.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column()
    fullName!: string

    @Field()
    @Column()
    email!: string

    @Field()
    @Column()
    password!: string

    @Field(()=>[Book],{ nullable: true })
    @OneToMany(() => Book, book => book.author, { nullable: true , onDelete: 'CASCADE'})
    books!: Book[]
    
    @Field()
    @Column()
    bookLoan!: boolean;

    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string
}