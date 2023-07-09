import {
  CreateBucketResponse,
  DeleteFileResponse,
  GetFilesResponse,
  GetSignedUrlConfig,
  Storage,
  UploadResponse,
} from '@google-cloud/storage';
import * as path from 'path';

class GCSUtils {
  private static _instance: GCSUtils;

  private static _storage: Storage;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    // create a client from Google service account
    GCSUtils._storage = new Storage({
      projectId: process.env.GCS_PROJECT_ID,

      credentials: {
        private_key: process.env.GCS_PRIVATE_KEY,
        client_id: process.env.GCS_CLIENT_ID,
        client_email: process.env.GCS_CLIENT_EMAIL,
        token_url: process.env.GCS_TOKEN_URI,
      },
    });
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): GCSUtils {
    if (!GCSUtils._instance) {
      GCSUtils._instance = new GCSUtils();
    }

    return GCSUtils._instance;
  }
  async uploadFile(
    filePath: string,
    fileName: string,
    bucketName: string,
    metadata: unknown,
  ): Promise<UploadResponse> {
    const result = await GCSUtils._storage.bucket(bucketName).upload(filePath, {
      destination: `${path.basename(
        fileName,
        path.extname(fileName),
      )}${path.extname(fileName)}`,
      metadata,
    });

    return result;
  }

  /**
   * Returns a V4 read signed url which allows limited time access to the file
   *
   * @param {string} bucketName
   * @param {string} fileName
   * @param {number} [expires=Date.now() + 3 * 24 * 60 * 60 * 1000] - defaults to 3 days
   * @returns {Promise<string>}
   * @memberof GCSUtils
   */
  async generateV4ReadSignedUrl(
    bucketName: string,
    fileName: string,
    expires: number = Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days
  ): Promise<string> {
    // set options to allow temporary read access to the file
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'read',
      expires,
    };

    // get a v4 signed URL for reading the file
    const [url] = await GCSUtils._storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);

    return url;
  }

  async replaceWithSignedUrlIfFound(
    bucketName: string,
    sourceObj: unknown,
    fieldName: string,
    expires?: number,
  ) {
    const source = sourceObj;

    if (!Object.prototype.hasOwnProperty.call(source, fieldName)) return;

    const url = await GCSUtils.getInstance().generateV4ReadSignedUrl(
      bucketName,
      source[fieldName],
      expires,
    );

    source[fieldName] = url;
  }

  async deleteFile(
    bucketName: string,
    fileName: string,
  ): Promise<DeleteFileResponse> {
    const result = await GCSUtils._storage
      .bucket(bucketName)
      .file(fileName)
      .delete();

    return result;
  }

  async createBucket(name: string): Promise<CreateBucketResponse | null> {
    let result: CreateBucketResponse = null;

    if (!(await GCSUtils._storage.bucket(name).exists())) {
      result = await GCSUtils._storage.createBucket(name);

      console.log(`Bucket ${name} created.`);
    }

    return result;
  }

  async getBucketFiles(name: string): Promise<GetFilesResponse> {
    const files = await GCSUtils._storage.bucket(name).getFiles();
    return files;
  }

  async deleteBucket(name: string): Promise<unknown> {
    const result = await GCSUtils._storage.bucket(name).delete();

    console.log(`Bucket ${name} deleted.`);

    return result;
  }
}

export default GCSUtils;
