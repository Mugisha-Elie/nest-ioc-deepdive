export interface IDatabaseConnection {
  query(sql: string): void;
}

export class PostgresDatabase implements IDatabaseConnection {
  private connectionString: string;
  private poolSize: number;

  constructor(connectionString: string, poolSize: number) {
    this.connectionString = connectionString;
    this.poolSize = poolSize;
  }

  query(sql: string) {
    console.log(`[Postgres (Pool: ${this.poolSize})] Executing: ${sql}`);
  }
}

export class MockDatabase implements IDatabaseConnection {
  public executedQueries: string[] = [];

  query(sql: string) {
    this.executedQueries.push(sql);
    console.log(`[MockDB] Captured query: ${sql}`);
  }
}

export class OrderService {
  private db: IDatabaseConnection;

  constructor(db: IDatabaseConnection) {
    this.db = db;
  }

  createOrder(item: string, amount: number) {
    this.db.query(`INSERT INTO orders (item, amount) VALUES ('${item}', '${amount}')`);
    console.log(`Order processed: ${item} ($${amount})`);
  }
}

const prodDb = new PostgresDatabase("postgres://localhost:5432/orders", 10);
const prodOrderService = new OrderService(prodDb);
prodOrderService.createOrder("ThinkPad T14", 1200);

console.log('\n');

const mockDb = new MockDatabase();
const testOrderService = new OrderService(mockDb);
testOrderService.createOrder("Wireless Mouse", 50);

console.log(`Test verification: ${mockDb.executedQueries.length === 1 ? "PASSED" : "FAILED"}`);