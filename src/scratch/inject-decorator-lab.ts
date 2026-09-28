import 'reflect-metadata'

const PARAM_TOKENS_METADATA_KEY = "custom:param_tokens";

export function Inject(token: string | symbol) {
  return (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    const existingTokens: Record<number, string | symbol> = 
      Reflect.getOwnMetadata(PARAM_TOKENS_METADATA_KEY, target) || {}

    existingTokens[parameterIndex] = token;
    Reflect.defineMetadata(PARAM_TOKENS_METADATA_KEY, existingTokens, target)
  }
} 

class PaymentService {
  constructor(
    @Inject("STRIPE_API_KEY") public apiKey: string,
    @Inject("APP_CURRENCY") public currency: string
  ) {}
}

const stickyNotes = Reflect.getMetadata(PARAM_TOKENS_METADATA_KEY, PaymentService);

console.log("=== Sticky Notes on PaymentService ===");
console.log(stickyNotes);