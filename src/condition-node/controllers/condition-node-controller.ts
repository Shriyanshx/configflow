import { 
    Controller, 
    Post, 
    Body, 
    Get, 
    Param, 
    Delete, 
    Put, 
    HttpCode, 
    HttpStatus, 
    Req
  } from '@nestjs/common';
  import { ConditionService } from '../services/condition.service';
import { ConditionNodeDto } from '../dtos/create-condition.dto';
  
  @Controller('condition-nodes')
  export class ConditionNodeController {
    constructor(private readonly conditionService: ConditionService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createConditionNode(@Req() request: Request, @Body() configDto: ConditionNodeDto) {
      return this.conditionService.createConditionConfig(configDto, request['org_id']);
    }
  
    @Get(':id')
    async getConditionNode(@Param('id') id: string) {
      return this.conditionService.findConditionNodeById(id);
    }
  
    @Put(':id')
    async updateConditionNode(
      @Req() request: Request,
      @Param('id') id: string, 
      @Body() configDto: ConditionNodeDto
    ) {
      const org_id = request['org_id'];
      return this.conditionService.updateConditionNode(id, org_id , configDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteConditionNode(@Param('id') id: string) {
      return this.conditionService.deleteConditionNode(id);
    }b
  
    @Post('evaluate')
    async evaluateCondition(
      @Body() context: Record<string, any>
    ) {
      return this.conditionService.evaluateConditionConfig(context);
    }
  }