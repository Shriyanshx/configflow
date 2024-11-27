import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ComparisonOperator } from '../enums/comparison-operator.enum';
import { ConditionNodeEntity } from './condition-node.entity';

@Entity('condition_details')
export class ConditionDetailEntity {
  @PrimaryColumn('varchar', { length: 50 })
  id: string;

  @Column('varchar', { length: 50 })
  node_id: string;

  @Column('varchar', { length: 100 })
  property: string;

  @Column('enum', { enum: ComparisonOperator })
  comparison_operator: ComparisonOperator;

  @Column('text', { nullable: true })
  value_text?: string;

  @Column('numeric', { nullable: true })
  value_numeric?: number;

  @Column('boolean', { nullable: true })
  value_boolean?: boolean;

  @Column('timestamp', { nullable: true })
  value_date?: Date;

  @Column('jsonb', { nullable: true })
  value_array?: any[];

  @ManyToOne(() => ConditionNodeEntity, node => node.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'node_id' })
  node: ConditionNodeEntity;
}
