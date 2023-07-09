import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import * as path from 'path';
import { AssetService } from 'src/asset/asset.service';
import { FileEntity } from 'src/asset/entity/file.entity';
import { editFileName } from 'src/common/utils';
import { UserCertificationEntity } from './entity/user-certification.entity';
import { UserEducationEntity } from './entity/user-education.entity';
import { UserExperienceEntity } from './entity/user-experience.entity';
import { UserProjectEntity } from './entity/user-project.entity';
import { UserEntity } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserExperienceEntity,
      UserEducationEntity,
      UserProjectEntity,
      UserCertificationEntity,
      FileEntity,
    ]),
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
  controllers: [UserController],
  providers: [UserService, AssetService],
  exports: [UserService],
})
export class UserModule {}
