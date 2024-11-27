import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ConditionNodeEntity } from '../entities/condition-node.entity';
import { ConditionDetailEntity } from '../entities/condition-detail.entity';
import { v4 as uuidv4 } from 'uuid';
import { ConditionType } from '../enums/condition-type.enum';
import { LogicalOperator } from '../enums/logical-operator.enum';
import { ConditionNodeDto } from '../dtos/create-condition.dto';
import { ComparisonOperator } from '../enums/comparison-operator.enum';

@Injectable()
export class ConditionService {
  constructor(
    @InjectRepository(ConditionNodeEntity)
    private conditionNodeRepo: Repository<ConditionNodeEntity>,
    @InjectRepository(ConditionDetailEntity)
    private conditionDetailRepo: Repository<ConditionDetailEntity>,
    private entityManager: EntityManager
  ) {}

  async createConditionConfig(
    conditionConfig: ConditionNodeDto
  ): Promise<ConditionNodeEntity> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      return this.createConditionNode(conditionConfig, null, transactionalEntityManager);
    });
  }

  private async createConditionNode(
    config: ConditionNodeDto, 
    parentId: string | null, 
    entityManager: EntityManager
  ): Promise<ConditionNodeEntity> {
    // Validate config
    if (!config.type) {
      throw new BadRequestException('Condition type is required');
    }

    // Generate or use provided ID
    const nodeId = config.id || uuidv4();

    // Create node entity
    const node = entityManager.create(ConditionNodeEntity, {
      id: nodeId,
      type: config.type,
      operator: config.type === ConditionType.GROUP ? config.operator : null,
      parent_id: parentId
    });

    const savedNode = await entityManager.save(node);

    // Handle nested conditions for GROUP type
    if (config.type === ConditionType.GROUP && config.conditions) {
      for (const childConfig of config.conditions) {
        await this.createConditionNode(childConfig, savedNode.id, entityManager);
      }
    }

    // Create condition detail for CONDITION type
    if (config.type === ConditionType.CONDITION && config.detail) {
      await this.createConditionDetail(savedNode.id, config.detail, entityManager);
    }

    return savedNode;
  }

  private async createConditionDetail(
    nodeId: string, 
    detailConfig: any,
    entityManager: EntityManager
  ): Promise<ConditionDetailEntity> {
    const detail = entityManager.create(ConditionDetailEntity, {
      id: detailConfig.id || uuidv4(),
      node_id: nodeId,
      property: detailConfig.property,
      comparison_operator: detailConfig.operator,
      value_text: typeof detailConfig.value === 'string' ? detailConfig.value : undefined,
      value_numeric: typeof detailConfig.value === 'number' ? detailConfig.value : undefined,
      value_boolean: typeof detailConfig.value === 'boolean' ? detailConfig.value : undefined,
      value_date: detailConfig.value instanceof Date ? detailConfig.value : undefined,
      value_array: Array.isArray(detailConfig.value) ? detailConfig.value : undefined
    });

    return entityManager.save(detail);
  }


  async findConditionNodeById(id: string): Promise<ConditionNodeEntity> {
    return this.conditionNodeRepo.findOne({
      where: { id },
      relations: ['children', 'details']
    });
  }
  
  async updateConditionNode(
    id: string, 
    configDto: ConditionNodeDto
  ): Promise<ConditionNodeEntity> {
    return this.entityManager.transaction(async transactionalEntityManager => {
      // First, delete existing children and details
      await transactionalEntityManager.delete(ConditionDetailEntity, { node_id: id });
      await transactionalEntityManager.delete(ConditionNodeEntity, { parent_id: id });
  
      // Recreate the node with new configuration
      return this.createConditionNode(configDto, null, transactionalEntityManager);
    });
  }
  
  async deleteConditionNode(id: string): Promise<void> {
    await this.conditionNodeRepo.delete(id);
  }
  
  async evaluateConditionConfig(
    context: Record<string, any>
  ): Promise<boolean> {
    // Retrieve the root condition node
    const rootNode = await this.conditionNodeRepo.findOne({
      where: { parent_id: null },
      relations: ['children', 'details']
    });
  
    if (!rootNode) {
      throw new BadRequestException('No root condition found');
    }
  
    return this.evaluateNode(rootNode, context);
  }
  private async evaluateNode(node: ConditionNodeEntity, context: any): Promise<boolean> {
    // For a condition node, evaluate its details
    if (node.type === ConditionType.CONDITION) {
      const detail = await this.conditionDetailRepo.findOne({ 
        where: { node_id: node.id } 
      });
      
      if (!detail) return false;
      
      const value = context[detail.property];
      
      switch (detail.comparison_operator) {
        case ComparisonOperator.EQUALS:
          return value === this.parseValue(detail);
        case ComparisonOperator.NOT_EQUALS:
          return value !== this.parseValue(detail);
        case ComparisonOperator.GREATER_THAN:
          return value > this.parseValue(detail);
        case ComparisonOperator.LESS_THAN:
          return value < this.parseValue(detail);
        case ComparisonOperator.IN:
          return this.parseValue(detail).includes(value);
        case ComparisonOperator.NOT_IN:
          return !this.parseValue(detail).includes(value);
        case ComparisonOperator.BETWEEN:
          const [min, max] = this.parseValue(detail);
          return value >= min && value <= max;
        default:
          return false;
      }
    }
  
    // For a group node, evaluate child conditions
    if (node.type === ConditionType.GROUP) {
      const children = await this.conditionNodeRepo.find({ 
        where: { parent_id: node.id } 
      });
  
      const results = await Promise.all(
        children.map(child => this.evaluateNode(child, context))
      );
  
      return node.operator === LogicalOperator.AND 
        ? results.every(Boolean)
        : results.some(Boolean);
    }
  
    return false;
  }
  
  private parseValue(detail: ConditionDetailEntity): any {
    return detail.value_text ?? 
           detail.value_numeric ?? 
           detail.value_boolean ?? 
           detail.value_date ?? 
           detail.value_array;
  }
}