import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: `${process.env.DATABASE_HOST}`,
  port: Number(process.env.DATABASE_PORT),
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  logging: JSON.parse(process.env.DATABASE_LOGGING),
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: true,
};

export default registerAs('typeorm', () => config);
// eslint-disable-next-line prettier/prettier
export const connectionSource = new DataSource(
  config as DataSourceOptions,
);
