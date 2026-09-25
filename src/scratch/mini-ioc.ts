import "reflect-metadata"

export type Constructor<T = any> = new (...args: any[]) => T;
export type InjectionToken<T = any> = string | symbol | Constructor<T>;

const CUSTOM_INJECTION_METADATA_KEY = 'custom:param_tokens';

export function Injectable(): ClassDecorator {
  return (target: Function) => {}
}

export function Inject(token: InjectionToken): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    const existingTokens: Record<number, InjectionToken> =
      Reflect.getOwnMetadata(CUSTOM_INJECTION_METADATA_KEY, target) || {};

    existingTokens[parameterIndex] = token;

    Reflect.defineMetadata(CUSTOM_INJECTION_METADATA_KEY, existingTokens, target);
  };
}

export interface ClassProvider<T = any> {
  provide: InjectionToken<T>;
  useClass: Constructor<T>;
}

export interface ValueProvider<T = any> {
  provide: InjectionToken<T>;
  useValue: T;
}

export type Provider<T = any> = ClassProvider<T> | ValueProvider<T> | Constructor<T>;

export class MiniContainer {
  private readonly providers = new Map<InjectionToken, Provider>();
  private readonly instances = new Map<InjectionToken, any>();

  register(provider: Provider): void {
    if (typeof provider === "function") {
      this.providers.set(provider, { provide: provider, useClass: provider });  
    } else {
      this.providers.set(provider.provide, provider);
    }
  }

  resolve<T>(token: InjectionToken<T>): T {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    const provider = this.providers.get(token);
    if (!provider) {
      const tokenName = typeof token === 'function' ? token.name : String(token);
      throw new Error(`[MiniContainer] No provider registered for token: "${tokenName}"`);
    }

    if ("useValue" in provider) {
      this.instances.set(token, provider.useValue);
      return provider.useValue;
    }

    const targetClass = provider.useClass;

    const paramTypes: any[] = Reflect.getMetadata("design:paramtypes", targetClass)

    const customTokens: Record<number, InjectionToken> =
      Reflect.getOwnMetadata(CUSTOM_INJECTION_METADATA_KEY, targetClass) || {};

    const resolvedArgs = paramTypes.map((paramType, index) => {
      const overrideToken = customTokens[index];
      const dependencyToken = overrideToken || paramType;

      if (!dependencyToken || dependencyToken === Object) {
        throw new Error(
          `[MiniContainer] Cannot resolve parameter index ${index} of class ${targetClass.name}.` +
          `The type is erased to Object. Did you forget to use @Inject(TOKEN)?`
        );
      }

      return this.resolve(dependencyToken)
    });

    const instance = new targetClass(...resolvedArgs);

    this.instances.set(token, instance)
    return instance;
  }
}




interface IConfigService {
  get(key: string): string;
}

const CONFIG_TOKEN = Symbol("CONFIG_TOKEN");

@Injectable()
class Logger {
  log(msg: string): void{
    console.log(`[Logger]: ${msg}`);
  }
}

@Injectable()
class OrderApp {
  constructor(
    @Inject(CONFIG_TOKEN) private readonly config: IConfigService,
    private readonly logger: Logger
  ) { }

  run(): void {
    const env = this.config.get("ENV");
    this.logger.log(`OrderApp running in ${env} mode.`);
  }
}

const container = new MiniContainer();

container.register({
  provide: CONFIG_TOKEN,
  useValue: {
    get: (key: string) => (key === "ENV" ? "production" : "unknown"),
  },
});

container.register(Logger);
container.register(OrderApp);

console.log("=== Resolving OrderApp from MiniContainer ===");
const app = container.resolve(OrderApp);
app.run();

const logger1 = container.resolve(Logger);
const logger2 = container.resolve(Logger);
console.log("Is Logger a Singleton?:", logger1 === logger2 ? "YES (PASSED)" : "NO (FAILED)");