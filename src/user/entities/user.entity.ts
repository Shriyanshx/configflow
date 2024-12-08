import { OrganizationUser } from 'src/org/org.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ unique: true, type: 'varchar', length: 40 })
  email: string;

  @Column({ type: 'varchar', })
  password: string;

  @OneToMany(() => OrganizationUser, (orgUser) => orgUser.user)
  organizations: OrganizationUser[];
}
