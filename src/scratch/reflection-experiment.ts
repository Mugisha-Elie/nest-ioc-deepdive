import 'reflect-metadata'

export const INJECTABLE_WATERMARK = "custom:injectable_watermark";
export const SCOPE_OPTIONS_METADATA = "custom:scope_options";

export interface InjectableOptions {
  scope?: "SINGLETON" | "TRANSIENT" | "REQUEST";
}

function Injectable(options?: InjectableOptions): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(INJECTABLE_WATERMARK, true, target);

    Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, options ?? {scope: "SINGLETON"}, target)
  };
}

@Injectable()
export class LoggerService {
  log(message: string): void {
    console.log(`[LOG]: ${message}`)
  }
}

@Injectable()
export class UserService {
  constructor(private readonly logger: LoggerService) {}

  sayHello(): void {
    this.logger.log("Hello from UserService!");
  }
}

const paramTypes = Reflect.getMetadata("design:paramtypes", UserService)

console.log("=== 1. Inspecting Compiler-Emitted Metadata ===");
const params = Reflect.getMetadata("design:paramtypes", UserService);
console.log("Compiler params:", params.map((p: any) => p.name));

console.log("\n=== 2. Inspecting Custom @Injectable() Metadata ===");
// Ask: Is LoggerService marked as injectable?
const isLoggerInjectable = Reflect.getMetadata(INJECTABLE_WATERMARK, LoggerService);
console.log("Is LoggerService injectable?:", isLoggerInjectable);

// Ask: What are the scope options on UserService?
const userScope = Reflect.getMetadata(SCOPE_OPTIONS_METADATA, UserService);
console.log("UserService Scope Configuration:", userScope);

// Ask: What all metadata keys exist on UserService?
const allKeys = Reflect.getMetadataKeys(UserService);
console.log("\nAll metadata keys present on UserService:", allKeys);