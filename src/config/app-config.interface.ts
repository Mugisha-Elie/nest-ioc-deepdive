export interface AppConfig {
  environment: 'development' | 'production' | 'test';
  port: number;
  apiPrefix: string;
}

export const APP_CONFIG = Symbol('APP_CONFIG');