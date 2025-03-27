// Type definitions for database configuration

export interface DbConfigEnv {
  expressApiBaseUrl: string;
}

export interface DbConfig {
  development: DbConfigEnv;
  production: DbConfigEnv;
  current: 'development' | 'production';
}
