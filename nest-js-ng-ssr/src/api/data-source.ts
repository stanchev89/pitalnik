import { DataSource, DataSourceOptions } from 'typeorm';
import configuration from '../../config/configuration';

const dbConfig = configuration().database;

export const dataSourceOptions: DataSourceOptions = {
  type: dbConfig.type as 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.name,
  synchronize: true
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
