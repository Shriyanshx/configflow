import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ConditionType } from '../enums/condition-type.enum';
import { LogicalOperator } from '../enums/logical-operator.enum';
import { ComparisonOperator } from '../enums/comparison-operator.enum';

export class ConditionDetailDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  property: string;

  @IsEnum(ComparisonOperator)
  operator: ComparisonOperator;

  @IsOptional()
  value: string | number | boolean | Date | any[];
}

export class ConditionNodeDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsEnum(ConditionType)
  type: ConditionType;

  @IsEnum(LogicalOperator)
  @IsOptional()
  operator?: LogicalOperator;

  @ValidateNested({ each: true })
  @Type(() => ConditionNodeDto)
  @IsOptional()
  conditions?: ConditionNodeDto[];

  @ValidateNested()
  @Type(() => ConditionDetailDto)
  @IsOptional()
  detail?: ConditionDetailDto;
}
