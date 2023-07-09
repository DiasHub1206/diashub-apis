import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import * as path from 'path';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { FileEntity } from './entity/file.entity';
import { editFileName } from '../common/utils';
/**
 * - MulterModule
 *
 * [1] default configurations for multer, if specified, fields will be overridden individually
 *  on the controller level
 *
 * @export
 * @class AssetModule
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    // [1]
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        return {
          storage: diskStorage({
            destination: path.resolve(path.join(__dirname, '../..', 'uploads')),
            filename: editFileName,
          }),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}
