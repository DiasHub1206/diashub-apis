import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import GCSUtils from 'src/common/gcs-utils';
import { FileObject } from 'src/common/types';
import { EntityManager, Repository } from 'typeorm';
import { FileEntity } from './entity/file.entity';
import * as path from 'path';
import * as fse from 'fs-extra';
import { File } from '@google-cloud/storage';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly _fileRepo: Repository<FileEntity>,

    private readonly _configServ: ConfigService,
  ) {}
  async uploadAndSaveFiles(
    fileObjs: FileObject[],
    transaction?: EntityManager,
    options: { expiresOn?: Date } = {},
  ): Promise<FileEntity[]> {
    const filesCreated: FileEntity[] = await Promise.all(
      fileObjs.map(async (fileObj) => {
        const { file, type, metadata } = fileObj;

        const { expiresOn } = options;

        // upload file to Google Cloud Storage (GCS) and delete from Local Disk Storage
        const fileName = await this.uploadFile(file.filename, metadata);

        return this._fileRepo.create({
          name: fileName,
          mimeType: file.mimetype,
          type,
          originalName: file.originalname,
          size: file.size,
          metadata,
          status: 'processed',
        });
      }),
    );

    const manager = transaction;

    // save the uploaded files to db
    const filesUploaded: FileEntity[] = await this._fileRepo.save(filesCreated);

    return filesUploaded;
  }

  async uploadFile(fileName: string, metadata?: unknown): Promise<string> {
    let fileOnCloud: File;

    try {
      // upload file to Google Cloud Storage (GCS)
      [fileOnCloud] = await GCSUtils.getInstance().uploadFile(
        path.resolve(__dirname, '..', '..', 'uploads', fileName),
        fileName,
        process.env.GCS_BUCKET_NAME,
        metadata || {},
      );
    } catch (err) {
      console.error(err);
    }

    // delete file on local desk
    await fse.remove(path.resolve(__dirname, '..', '..', 'uploads', fileName));

    return fileOnCloud.name;
  }
}
