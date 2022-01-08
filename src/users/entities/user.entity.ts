import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 60 })
  email: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 255 })
  password: string;
}
