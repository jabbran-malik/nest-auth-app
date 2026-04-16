import 'dotenv/config';

import { DataSource } from 'typeorm';
import { User } from './src/user/entity/user.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST as string,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME as string,
  entities: [User],
  migrations: ['src/migrations/*.ts'],
});