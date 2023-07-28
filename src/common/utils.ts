import slugify from 'slugify';
import { extname } from 'path';
import { v1 as uuidv1 } from 'uuid';
import { Request } from 'express';
import { ValidImageFileExtension, ValidImageFileMimeType } from './types';

export const slugifyFileName = (originalName: string): string => {
  // extract original name without ext
  const name = originalName.split('.')[0];

  // slugify original name
  const slug = slugify(name, {
    lower: true,
    replacement: '-',
    trim: true,
  });

  // extract file ext (e.g. ".png")
  const fileExtName = extname(originalName);

  // add universally unique timestamp identifier to the name
  const uuidV1 = uuidv1();

  return `${slug}-${uuidV1}${fileExtName}`;
};

export const feedFileFilter = async (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  const acceptableMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',

    'mp4',
    'webm',
    'mov',
  ];

  if (!acceptableMimeTypes.includes(file.mimetype)) {
    return callback(new Error('File type is not allowed!'), false);
  }

  return callback(null, true);
};

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error, filename: string) => void,
) => {
  callback(null as Error, slugifyFileName(file.originalname));
};

export const imageFileFilter = async (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  const validFileExtensions: string[] = <ValidImageFileExtension[]>[
    'png',
    'jpg',
    'jpeg',
  ];

  // TODO: implement mime type validation
  const validImageFileMimeTypes: string[] = <ValidImageFileMimeType[]>[
    'image/png',
    'image/jpg',
    'image/jpeg',
  ];

  const fileExtension = extname(file.originalname).substring(1);

  const fileMimeType = file.mimetype;

  if (!validFileExtensions.includes(fileExtension)) {
    return callback(new Error('Only image files are allowed!'), false);
  }

  return callback(null, true);
};
