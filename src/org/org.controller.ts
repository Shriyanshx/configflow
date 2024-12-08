import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrgService } from './org.service';
import { create } from 'domain';
import { CreateOrgDto } from './org.dto';

@Controller('org')
export class OrgController {
  constructor(private readonly orgService: OrgService) {}

  @Post('createAndJoin')
  async createOrg(@Req() request: Request, @Body() createOrgDto: CreateOrgDto) {
    const org = await this.orgService.createOrg(createOrgDto);
    const orgUser = await this.orgService.createOrgUser(
      request['user'].id,
      org.id,
    );
    return { org, orgUser };
  }
}
