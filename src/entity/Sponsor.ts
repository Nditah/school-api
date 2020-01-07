import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  import { Length, IsNotEmpty } from "class-validator";
  import * as bcrypt from "bcryptjs";
  
  @Entity()
  @Unique(["phone"])
  export class Sponsor {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    surname: string;

    @Column()
    otherName: string;

    @Column()
    @Length(4, 20)
    email: string;
  
    @Column()
    @Length(4, 100)
    password: string;
  
    @Column()
    @Length(11, 15)
    phone: string;

    @Column()
    @IsNotEmpty()
    relationship: string;
  
    @Column()
    @Length(10, 200)
    address: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
  
    hashPassword() {
      this.password = bcrypt.hashSync(this.password, 8);
    }
  
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      return bcrypt.compareSync(unencryptedPassword, this.password);
    }
  }