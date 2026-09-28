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

    throw new Error(`[Container] Recipe type not yet implemeted.`);
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

const originalConfig = container.resolve(CONFIG_TOKEN);
console.log("Original Config:", originalConfig);

const aliasedConfig = container.resolve(ALIAS_TOKEN);
console.log("Aliased Config:", aliasedConfig);

console.log("Are they identical:", originalConfig === aliasedConfig);


  
