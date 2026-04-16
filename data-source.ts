import { DataSource } from 'typeorm';
import { User } from './src/user/entity/user.entity';

export default new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5433,
  username: 'postgres',
  password: 'pak786@A',
  database: 'nestdb',
  entities: [User],
  migrations: ['src/migrations/*.ts'],
});