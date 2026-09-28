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


  
  
  


export class Container {
  private readonly recipes = new Map<InjectionToken, InternalProvider>();
  private readonly shelf = new Map<InjectionToken, any>();

  register(provider: Provider): void {
    if (typeof provider === "function") {
      this.recipes.set(provider, {
        provide: provider,
        useClass: provider
      })
    } else {
      this.recipes.set(provider.provide, provider)
    }
  }

  resolve<T>(token: InjectionToken<T>): T {
    if (this.shelf.has(token)) {
      return this.shelf.get(token);
    }

    const recipe = this.recipes.get(token);
    if (!recipe) {
      const name = typeof token === "function" ? token.name : String(token);
      throw new Error(`[Container] No provider registered for token: ${name}`)
    }

    if ("useValue" in recipe) {
      this.shelf.set(token, recipe.useValue);
      return recipe.useValue
    }

    if ("useExisting" in recipe) {
      return this.resolve(recipe.useExisting)
    }

    if ("useFactory" in recipe) {
      const injectTokens = recipe.inject || [];
      const resolvedDependencies = injectTokens.map(depToken => this.resolve(depToken));
      const instance = recipe.useFactory(...resolvedDependencies);

      this.shelf.set(token, instance);
      return instance
    }

    if ("useClass" in recipe) {
      const targetClass = recipe.useClass;

      const rawParamTypes = Reflect.getMetadata("design:paramtypes", targetClass);
      const paramTypes: any[] = Array.isArray(rawParamTypes) ? rawParamTypes : [];

      const customTokens: Record<number, InjectionToken> =
        Reflect.getOwnMetadata(PARAM_TOKENS_METADATA_KEY, targetClass) || {};

      const resolvedArgs = paramTypes.map((compilerType, index) => {
        const overrideToken = customTokens[index];
        const dependencyToken = overrideToken || compilerType

        if (!dependencyToken || dependencyToken === Object) {
          throw new Error(
            `[Container] Cannot resolve parameter [${index}] of ${targetClass.name}.` +
            `Type was erased to Object. Did you forget to decorate with @Inject(TOKEN)?`
          );
        }
        return this.resolve(dependencyToken);
      });
      const instance = new targetClass(...resolvedArgs);

      this.shelf.set(token, instance);
      return instance;
    }

    throw new Error(`[Container] Unrecognized recipe structure`);
  }
}




interface IDatabaseConnection {
  query(sql: string): string;
}

const DB_TOKEN = Symbol("IDatabaaseConnection");

const APP_CONFIG_TOKEN = "APP_CONFIG";

class PostgresDatabase implements IDatabaseConnection {
  constructor(private readonly connectionString: string) { }

  query(sql: string): string {
    return `[Postgres: ${this.connectionString}] Query result`;
  }
}

@Injectable()
class LoggerService {
  log(msg: string): void {
    console.log(`[Logger]: ${msg}`);
  }
}  

@Injectable()
class OrderService {
  constructor(
    @Inject(DB_TOKEN) private readonly db: IDatabaseConnection,
    private readonly logger: LoggerService
  ) { }

  checkout(item: string): void {
    this.logger.log(`Processing checkout for "${item}"...`);
    const result = this.db.query("INSERT INTO orders");
    this.logger.log(`DB Output: ${result}`);
  }
}  

const container = new Container();

const CONFIG_TOKEN = Symbol("APP_CONFIG");
const ALIAS_TOKEN = "CONFIG_ALIAS";

container.register({
  provide: CONFIG_TOKEN,
  useValue: { port: 8080, db: "postgres" },
});

container.register({
  provide: ALIAS_TOKEN,
  useExisting: CONFIG_TOKEN
});

container.register({
  provide: APP_CONFIG_TOKEN,
  useValue: {host: "localhost", dbName: "prod_db"},
})

container.register({
  provide: DB_TOKEN,
  inject: [APP_CONFIG_TOKEN],
  useFactory: (config: { host: string; dbName: string }) => {
    return new PostgresDatabase(`postgresql://${config.host}/${config.dbName}`);
  }
})

container.register(LoggerService);
container.register(OrderService);


const orderService = container.resolve(OrderService);
orderService.checkout("ThinkPad T14");

const loggerA = container.resolve(LoggerService);
const loggerB = container.resolve(LoggerService);
console.log("Logger is Singleton?:", loggerA === loggerB ? "YES (PASSED)": "NO (FAILED)")

const originalConfig = container.resolve(CONFIG_TOKEN);
console.log("Original Config:", originalConfig);

const aliasedConfig = container.resolve(ALIAS_TOKEN);
console.log("Aliased Config:", aliasedConfig);

console.log("Are they identical:", originalConfig === aliasedConfig);





  
