import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { FileStatus } from 'src/common/types';

export class FileDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  id: string;

  @IsNotEmpty()
  @ApiProperty({ type: String })
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  originalName?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({ type: String })
  url?: string;

  @IsNotEmpty()
  @ApiProperty({ type: String })
  mimeType: string;

  @IsNotEmpty()
  @ApiProperty({ type: String })
  type: string;

  @IsNotEmpty()
  @ApiProperty()
  status: FileStatus;

  @IsNotEmpty()
  @ApiProperty({ type: Number })
  size: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  metadata: unknown;

  @IsNotEmpty()
  @ApiProperty({ type: Date })
  createdAt: Date;
}
