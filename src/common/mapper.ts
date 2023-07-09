import { FileDto } from 'src/asset/dto/file.dto';
import { FileEntity } from 'src/asset/entity/file.entity';
import GCSUtils from './gcs-utils';

export const toFileDto = async (data: FileEntity): Promise<FileDto> => {
  const {
    id,
    name,
    originalName,
    mimeType,
    type,
    status,
    size,
    metadata,
    createdAt,
  } = data;

  let url: string = null;

  if (status === 'processed') {
    url = await GCSUtils.getInstance().generateV4ReadSignedUrl(
      process.env.GCS_BUCKET_NAME,
      name,
    );
  }

  const fileDto: FileDto = {
    id,
    url,
    name,
    originalName,
    mimeType,
    type,
    status,
    size,
    metadata,
    createdAt,
  };

  return fileDto;
};
