import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ConditionType } from '../enums/condition-type.enum';
import { LogicalOperator } from '../enums/logical-operator.enum';
import { ConditionDetailEntity } from './condition-detail.entity';

@Entity('condition_nodes')
export class ConditionNodeEntity {
  @PrimaryColumn('varchar', { length: 50 })
  id: string;

  @Column('varchar', { length: 50, nullable: true })
  parent_id?: string;

  @Column('enum', { enum: ConditionType })
  type: ConditionType;

  @Column('enum', { enum: LogicalOperator, nullable: true })
  operator?: LogicalOperator;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ManyToOne(() => ConditionNodeEntity, node => node.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent?: ConditionNodeEntity;

  @OneToMany(() => ConditionNodeEntity, node => node.parent)
  children?: ConditionNodeEntity[];

  @OneToMany(() => ConditionDetailEntity, detail => detail.node)
  details?: ConditionDetailEntity[];
}