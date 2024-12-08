import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization, OrganizationUser } from './org.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateOrgDto } from './org.dto';

@Injectable()
export class OrgService {
  constructor(
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
    @InjectRepository(OrganizationUser)
    private orgUserRepo: Repository<OrganizationUser>,
  ) {}

  async checkUserOrgAccess(
    userId: number,
    orgId: string,
  ): Promise<OrganizationUser> {

    console.log('checkUserOrgAccess');
    console.log('userId', userId);
    console.log('orgId', orgId);

    const orgUser = await this.orgUserRepo.findOne({
      where: {
        user: { id: userId } as any,
        organization: { id: orgId } as any,
      },
    });

    console.log('orgUser', orgUser);
    return orgUser;
  }

  async createOrg(org: CreateOrgDto): Promise<Organization> {
    return this.orgRepo.save(org);
  }

  async createOrgUser(
    userId: number,
    orgId: number,
  ): Promise<OrganizationUser> {
    const organizationUser = new OrganizationUser();

    // Properly typed references
    organizationUser.user = { id: userId } as any;
    organizationUser.organization = { id: orgId } as any;
    organizationUser.role = 'admin';
    organizationUser.isActive = true;

    return this.orgUserRepo.save(organizationUser);
  }
}
