export interface ColumnDefinition {
  name: string;
  type: string;
  primaryKey: boolean;
}

export interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
}

export interface Schema {
  database: string;

  tables: TableDefinition[];
}

export interface Database {
  initialize: () => Promise<void>;

  describe: () => Promise<Schema>;

  query: (query: string) => Promise<object[]>;
}
