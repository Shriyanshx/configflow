import { Module } from '@nestjs/common';
import { OrgService } from './org.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization, OrganizationUser } from './org.entity';
import { OrgController } from './org.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [OrgController],
  imports: [
    TypeOrmModule.forFeature([Organization]),
    TypeOrmModule.forFeature([OrganizationUser]),
    UserModule
  ],
  providers: [OrgService],
  exports: [OrgService],
})
export class OrgModule {}
