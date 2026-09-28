import { Injectable } from "@nestjs/common";
import { IDatabaseReader } from "./reader.interface";

@Injectable()
export class AppDatabaseService implements IDatabaseReader {
  private readonly instanceId = Math.floor(Math.random() * 10000);

  constructor() {
    console.log(`[AppDatabaseService]: Initialized new connection instance (#${this.instanceId})`);
  }

  async read(query: string): Promise<string>{
    return `[Instance #${this.instanceId}] Read query executed: "${query}"`;
  }

  async write(data: string): Promise<string> {
    return `[Instance #${this.instanceId}] Write operation persisted: "${data}"`
  }
}