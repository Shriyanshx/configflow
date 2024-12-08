
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => OrganizationUser, orgUser => orgUser.organization)
  users: OrganizationUser[];
}


@Entity('organization_users')
export class OrganizationUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Organization)
  organization: Organization;

  @ManyToOne(() => User)
  user: User;

  @Column()
  role: string; // admin, member, viewer etc.

  @Column({ default: true })
  isActive: boolean;
}