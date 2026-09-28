import "reflect-metadata";

export type Constructor<T = any> = new (...args: any[]) => T;
export type InjectionToken<T = any> = string | symbol | Constructor<T>;

export interface ValueProvider<T = any> {
  provide: InjectionToken<T>;
  useValue: T
}

export interface ClassProvider<T = any> {
  provide: InjectionToken<T>;
  useClass: Constructor<T>
}

export interface FactoryProvider<T = any> {
  provide: InjectionToken<T>;
  useFactory: (...args: any[]) => T;
  inject?: InjectionToken[];
}

export interface ExistingProvider<T = any> {
  provide: InjectionToken<T>;
  useExisting: InjectionToken<T>;
}

export type InternalProvider<T = any> = 
  | ValueProvider<T>
  | ClassProvider<T>
  | FactoryProvider<T>
  | ExistingProvider<T>

export type Provider<T = any> = InternalProvider<T> | Constructor<T>

const PARAM_TOKENS_METADATA_KEY = Symbol("custom:param_tokens");

export function Injectable(): ClassDecorator {
  return (target: Function) => {
    
  }
}

export function Inject(token: InjectionToken): ParameterDecorator {
  return (target: Object, parameterKey: string | symbol | undefined, parameterIndex: number) => {
    const existingTokens = Reflect.getOwnMetadata(PARAM_TOKENS_METADATA_KEY, target) || {};
    existingTokens[parameterIndex] = token;

    Reflect.defineMetadata(PARAM_TOKENS_METADATA_KEY, existingTokens, target)
  }
} 

export { PARAM_TOKENS_METADATA_KEY };


  
  
  





  
