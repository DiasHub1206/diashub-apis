import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class ListItemsDto {
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  @IsNumber()
  offset: number;

  @Min(1)
  @Max(30)
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  @IsNumber()
  limit: number;
}
