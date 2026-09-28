export interface IDatabaseReader {
  read(query: string): Promise<string>;
}

export const DATABASE_READER = Symbol('DATABASE_READER')