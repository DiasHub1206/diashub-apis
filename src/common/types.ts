import { UserEntity } from 'src/user/entity/user.entity';

export type UserEntityType = UserEntity;

export type FileType = 'image' | 'video' | 'text' | 'application' | 'csv';

export enum FileStatusEnum {
  UPLOADED = 'uploaded',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
}

export type FileStatus = `${FileStatusEnum}`;

export type FileObject = {
  file: {
    filename: string;
    mimetype: string;
    originalname: string;
    size: number;
  };
  type: FileType;
  metadata?: unknown;
};

export type ValidImageFileExtension = 'png' | 'jpg' | 'jpeg';

export type ValidImageFileMimeType = 'mage/png' | 'image/jpg' | 'image/jpeg';
