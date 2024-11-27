import { 
    Controller, 
    Post, 
    Body, 
    Get, 
    Param, 
    Delete, 
    Put, 
    HttpCode, 
    HttpStatus 
  } from '@nestjs/common';
  import { ConditionService } from '../services/condition.service';
import { ConditionNodeDto } from '../dtos/create-condition.dto';
  
  @Controller('condition-nodes')
  export class ConditionNodeController {
    constructor(private readonly conditionService: ConditionService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createConditionNode(@Body() configDto: ConditionNodeDto) {
      return this.conditionService.createConditionConfig(configDto);
    }
  
    @Get(':id')
    async getConditionNode(@Param('id') id: string) {
      return this.conditionService.findConditionNodeById(id);
    }
  
    @Put(':id')
    async updateConditionNode(
      @Param('id') id: string, 
      @Body() configDto: ConditionNodeDto
    ) {
      return this.conditionService.updateConditionNode(id, configDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteConditionNode(@Param('id') id: string) {
      return this.conditionService.deleteConditionNode(id);
    }
  
    @Post('evaluate')
    async evaluateCondition(
      @Body() context: Record<string, any>
    ) {
      return this.conditionService.evaluateConditionConfig(context);
    }
  }