import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrgDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
