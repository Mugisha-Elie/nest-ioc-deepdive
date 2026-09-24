export class DatabaseConnection {
  private connectionString: string;

  constructor(connectionString: string){
    this.connectionString = connectionString;
  }

  query(sql: string): void {
    console.log(`[DB: ${this.connectionString}] Executing: ${sql}`);
  }
}

export class OrderService {
  private db: DatabaseConnection;

  constructor() {
    this.db = new DatabaseConnection("postgres://user:pass@localhost:5432/orders");
  }

  createOrder(item: string, amount: number): void {
    this.db.query(`INSERT INTO orders (item, amount) VALUES ('${item}', ${amount})`);
    console.log(`Order created for ${item} ($${amount})`)
  }
}

const orderService = new OrderService();
orderService.createOrder("ThinkPad T14", 1200);