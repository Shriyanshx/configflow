import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConditionService } from '../services/condition.service';
import { ConditionNodeEntity } from '../entities/condition-node.entity';
import { ConditionDetailEntity } from '../entities/condition-detail.entity';
import { ConditionNodeController } from '../controllers/condition-node-controller';

@Module({
    imports: [
      TypeOrmModule.forFeature([
        ConditionNodeEntity, 
        ConditionDetailEntity
      ])
    ],
    controllers: [ConditionNodeController],
    providers: [ConditionService],
    exports: [ConditionService]
  })
  export class ConditionModule {}