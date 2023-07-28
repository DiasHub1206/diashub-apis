import { FeedAssetType } from '../../common/enums';

export interface FeedAssetInterface {
  asset: {
    fileId: string;
    filePath: string;
    assetType: FeedAssetType;
  }[];
}
