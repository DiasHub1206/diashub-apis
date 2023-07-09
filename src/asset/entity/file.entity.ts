import { ApiProperty } from '@nestjs/swagger';
import { PlatformEntity } from 'src/common/entity/platform.entity';
import { FileStatus, FileType } from 'src/common/types';
import { Column, Entity, Index } from 'typeorm';

@Entity('file')
export class FileEntity extends PlatformEntity {
  // file name stored on disk
  @Column({ type: 'varchar', nullable: false })
  name: string;

  // uploaded file name
  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({ type: String })
  originalName: string;

  // absolute url
  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({ type: String })
  url?: string;

  // file type e.g. image
  @Column({ type: 'varchar', nullable: false })
  @ApiProperty()
  type: FileType;

  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({ type: String })
  mimeType: string;

  // in bytes
  @Column({ type: 'bigint', nullable: false })
  @ApiProperty({ type: Number })
  size: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: unknown;

  /**
   * Status:
   * * "uploaded" - File finished uploading to local desk (Default).
   * * "processing" - File is being processed by scripts.
   * * "processed" - File has been processed by scripts.
   */
  @Index()
  @Column({ type: 'varchar', nullable: false, default: 'uploaded' })
  @ApiProperty()
  status: FileStatus;
}
