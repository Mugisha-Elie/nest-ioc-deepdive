export interface IDatabaseConnection {
  executeQuery(query: string): Promise<string>;
}

export const DATABASE_CONNECTION = Symbol('DATABASE_CONNECTION');

export class SimulatedDbPool implements IDatabaseConnection {
  constructor(private readonly connectionUri: string) { }

  async executeQuery(query: string): Promise<string> {
    return `[DB URI: ${this.connectionUri}] Executed: "${query}"`
  }
}