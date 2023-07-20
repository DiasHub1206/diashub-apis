import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  DeleteResult,
  FindOneOptions,
  ILike,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from 'typeorm';
import { SignupPostBodyDto } from './dto/signup-post-body.dto';
import { UserEntity } from './entity/user.entity';
import slugify from 'slugify';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountStatus } from 'src/common/enums';
import { UserEntityType } from 'src/common/types';
import { IdDto } from 'src/common/dto/id.dto';
import { UserExperienceEntity } from './entity/user-experience.entity';
import { UserEducationEntity } from './entity/user-education.entity';
import { UserProjectEntity } from './entity/user-project.entity';
import { UserCertificationEntity } from './entity/user-certification.entity';
import { AddUserExperienceDto } from './dto/add-user-experience.dto';
import { AddUserEducationDto } from './dto/add-user-education.dto';
import { AddUserProjectDto } from './dto/add-user-project.entity';
import { AddUserCertificationDto } from './dto/add-user-certification.entity';
import { UpdateUserExperienceDto } from './dto/update-user-experience.dto';
import { UpdateUserEducationDto } from './dto/update-user-education.dto';
import { UpdateUserProjectDto } from './dto/update-user-project.entity';
import { UpdateUserCertificationDto } from './dto/update-user-certification.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileEntity } from 'src/asset/entity/file.entity';
import imageSize from 'image-size';
import { promisify } from 'util';
import { ConfigService } from '@nestjs/config';
import { AssetService } from 'src/asset/asset.service';
import GCSUtils from 'src/common/gcs-utils';

const sizeOf = promisify(imageSize);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _user: Repository<UserEntity>,
    @InjectRepository(UserExperienceEntity)
    private readonly _userExpe: Repository<UserExperienceEntity>,
    @InjectRepository(UserEducationEntity)
    private readonly _userEduc: Repository<UserEducationEntity>,
    @InjectRepository(UserProjectEntity)
    private readonly _userProj: Repository<UserProjectEntity>,
    @InjectRepository(UserCertificationEntity)
    private readonly _userCert: Repository<UserCertificationEntity>,
    private readonly _assetServ: AssetService,
    private readonly _configServ: ConfigService,
  ) {}
  async create(userDto: SignupPostBodyDto): Promise<UserEntity> {
    const { firstName, lastName, email, password, role } = userDto;

    const userInDb = await this._user.find({ where: { email } });

    // if user exists throw bad request as duplicate users are not allowed
    if (userInDb.length > 0) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    // extract email's username part
    const usernamePart = email.split('@')[0];

    // generate username (lowercase, no special charachters) from email username
    let username = slugify(usernamePart, { lower: true, strict: true });

    /**
     * We need to ensure username is unique across student & teacher tables
     */

    // count the number of users whose username is similar to the generated username
    const count = await this._user.count({
      where: { username: ILike(username) },
    });

    /* If at least one user has the same username, add current user's order
     * surrounded by two single digit random numbers to get a unique username
     */
    if (count) {
      username += `${Math.ceil(Math.random() * 10)}${count + 1}${Math.ceil(
        Math.random() * 10,
      )}`;
    }

    const user = this._user.create({
      firstName,
      lastName,
      username,
      email,
      password,
      accountStatus: AccountStatus.INACTIVE,
      role,
      lastActiveOn: new Date(),
    });

    // save the new user to db
    await user.save();

    // return user
    return user;
  }

  async setAccountActive(id: string): Promise<boolean> {
    const user = await this._user.findOne({ where: { id } });

    user.accountStatus = AccountStatus.ACTIVE;

    await user.save();
    return true;
  }

  async findOne(
    options?: FindOneOptions<UserEntityType>,
  ): Promise<UserEntityType> {
    if ((<ObjectLiteral>options.where).email) {
      // eslint-disable-next-line no-param-reassign
      (<ObjectLiteral>options.where).email = (<ObjectLiteral>(
        options.where
      )).email.toLowerCase();
    }

    // TODO: use a single query to search in user tables (student, teacher)
    const user: UserEntityType = await this._user.findOne(options);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<boolean> {
    const updatedResult = await this._user.update({ id }, { ...updateUserDto });

    if (updatedResult.affected === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return true;
  }

  async findByPayload({ username }): Promise<UserEntityType> {
    return this.findOne({ where: { username } });
  }

  async updateLastActiveOn({ id }: IdDto): Promise<UpdateResult> {
    return await this._user.update({ id }, { lastActiveOn: new Date() });
  }

  async getUserDetails(id: string): Promise<UserEntity> {
    const resultArr = await this._user
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.username',
        'user.email',
        'user.mobileNumber',
        'user.countryCode',
        'user.role',
        'user.lastActiveOn',

        'exp.id',
        'exp.employmentType',
        'exp.companyName',
        'exp.location',
        'exp.workLocationType',
        'exp.isCurrentlyWorking',
        'exp.startDate',
        'exp.endDate',
        'exp.description',

        'edu.id',
        'edu.school',
        'edu.degree',
        'edu.fieldOfStudy',
        'edu.grade',
        'edu.activities',
        'edu.startDate',
        'edu.endDate',
        'edu.description',

        'proj.id',
        'proj.name',
        'proj.description',
        'proj.startDate',
        'proj.endDate',
        'proj.isCurrentlyWorking',

        'cert.id',
        'cert.company',
        'cert.degree',
        'cert.credentialId',
        'cert.credentialUrl',
        'cert.issueDate',
        'cert.expirationDate',

        'sku.id',
        'sku.proficiency',
        'sk.id',
        'sk.name',
      ])
      .leftJoin('user.experiences', 'exp')
      .leftJoin('user.educations', 'edu')
      .leftJoin('user.projects', 'proj')
      .leftJoin('user.certifications', 'cert')
      .leftJoin('user.userSkills', 'sku')
      .leftJoin('sku.skill', 'sk')

      .leftJoinAndMapOne(
        'user.profilePhoto',
        FileEntity,
        'profilePhoto',
        'user.profilePhotoId = profilePhoto.id',
      )

      .where('user.id =:id', { id })
      .getMany();

    const result = resultArr[0];

    if (result.profilePhoto.status === 'processed') {
      result.profilePhoto.name =
        await GCSUtils.getInstance().generateV4ReadSignedUrl(
          this._configServ.get('GCS_BUCKET_NAME'),
          result.profilePhoto.name,
        );
    }

    return result;
  }

  async uploadProfilePhoto(
    { userId }: { userId: string },
    image: Express.Multer.File,
  ): Promise<FileEntity> {
    const dimensions = await sizeOf(image.path);

    const [file] = await this._assetServ.uploadAndSaveFiles([
      {
        file: image,
        type: 'image',
        metadata: {
          height: dimensions.height,
          width: dimensions.width,
          orientation: dimensions.orientation,
        },
      },
    ]);

    await this._user.update({ id: userId }, { profilePhotoId: file.id });

    return file;
  }

  async getUserPublicDetails(id: string): Promise<UserEntity> {
    const resultArr = await this._user
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.username',
        'user.email',
        'user.mobileNumber',
        'user.countryCode',
        'user.role',
        'user.lastActiveOn',

        'exp.id',
        'exp.employmentType',
        'exp.companyName',
        'exp.location',
        'exp.workLocationType',
        'exp.isCurrentlyWorking',
        'exp.startDate',
        'exp.endDate',
        'exp.description',

        'edu.id',
        'edu.school',
        'edu.degree',
        'edu.fieldOfStudy',
        'edu.grade',
        'edu.activities',
        'edu.startDate',
        'edu.endDate',
        'edu.description',

        'proj.id',
        'proj.name',
        'proj.description',
        'proj.startDate',
        'proj.endDate',
        'proj.isCurrentlyWorking',

        'cert.id',
        'cert.company',
        'cert.degree',
        'cert.credentialId',
        'cert.credentialUrl',
        'cert.issueDate',
        'cert.expirationDate',

        'sku.id',
        'sku.proficiency',
        'sk.id',
        'sk.name',
      ])
      .leftJoin('user.experiences', 'exp')
      .leftJoin('user.educations', 'edu')
      .leftJoin('user.projects', 'proj')
      .leftJoin('user.certifications', 'cert')
      .leftJoin('user.userSkills', 'sku')
      .leftJoin('sku.skill', 'sk')

      .leftJoinAndMapOne(
        'user.profilePhoto',
        FileEntity,
        'profilePhoto',
        'user.profilePhotoId = profilePhoto.id',
      )

      .where('user.id =:id', { id })
      .getMany();

    const result = resultArr[0];

    if (result.profilePhoto.status === 'processed') {
      result.profilePhoto.name =
        await GCSUtils.getInstance().generateV4ReadSignedUrl(
          this._configServ.get('GCS_BUCKET_NAME'),
          result.profilePhoto.name,
        );
    }

    return result;
  }

  async createUserExperience(
    userId: string,
    userExperienceDto: AddUserExperienceDto,
  ): Promise<UserExperienceEntity> {
    const experience = this._userExpe.create({
      userId,
      ...userExperienceDto,
    });

    await experience.save();

    return experience;
  }

  async updateUserExperience(
    id: string,
    userId: string,
    userExperienceDto: UpdateUserExperienceDto,
  ): Promise<boolean> {
    const updatedResult = await this._userExpe.update(
      { id, userId },
      { ...userExperienceDto },
    );

    if (updatedResult.affected === 0) {
      throw new HttpException('Experience not found', HttpStatus.NOT_FOUND);
    }

    return true;
  }

  async deleteUserExperience(
    id: string,
    userId: string,
  ): Promise<DeleteResult> {
    return await this._userExpe.delete({ id, userId });
  }

  async createUserEducation(
    userId: string,
    userEducationDto: AddUserEducationDto,
  ): Promise<UserEducationEntity> {
    const education = this._userEduc.create({
      userId,
      ...userEducationDto,
    });

    await education.save();

    return education;
  }

  async updateUserEducation(
    id: string,
    userId: string,
    userEducationDto: UpdateUserEducationDto,
  ): Promise<boolean> {
    const updatedResult = await this._userEduc.update(
      { id, userId },
      { ...userEducationDto },
    );

    if (updatedResult.affected === 0) {
      throw new HttpException('Education not found', HttpStatus.NOT_FOUND);
    }

    return true;
  }

  async deleteUserEducation(id: string, userId: string): Promise<DeleteResult> {
    return await this._userEduc.delete({ id, userId });
  }

  async createUserProject(
    userId: string,
    userProjectDto: AddUserProjectDto,
  ): Promise<UserProjectEntity> {
    const project = this._userProj.create({
      userId,
      ...userProjectDto,
    });

    await project.save();

    return project;
  }

  async updateUserProject(
    id: string,
    userId: string,
    userProjectDto: UpdateUserProjectDto,
  ): Promise<boolean> {
    const updatedResult = await this._userProj.update(
      { id, userId },
      { ...userProjectDto },
    );

    if (updatedResult.affected === 0) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    return true;
  }

  async deleteUserProject(id: string, userId: string): Promise<DeleteResult> {
    return await this._userProj.delete({ id, userId });
  }

  async createUserCertification(
    userId: string,
    userCertificationDto: AddUserCertificationDto,
  ): Promise<UserCertificationEntity> {
    const certification = this._userCert.create({
      userId,
      ...userCertificationDto,
    });

    await certification.save();

    return certification;
  }

  async updateUserCertification(
    id: string,
    userId: string,
    userCertificationDto: UpdateUserCertificationDto,
  ): Promise<boolean> {
    const updatedResult = await this._userCert.update(
      { id, userId },
      { ...userCertificationDto },
    );

    if (updatedResult.affected === 0) {
      throw new HttpException('Certification not found', HttpStatus.NOT_FOUND);
    }

    return true;
  }

  async deleteUserCertification(
    id: string,
    userId: string,
  ): Promise<DeleteResult> {
    return await this._userCert.delete({ id, userId });
  }
}
