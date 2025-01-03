# AI-SQL Example

## Usage for PostgreSQL

1. Create .env file with the following content:

   ```env
   POSTGRES_URL=postgresql://user:password@localhost:5432/dbname

   OPENAI_API_KEY=your-openai-api-key
   ```

2. Install dependencies:

   ```sh
   bun install
   ```

3. Run the example:

   ```sh
   bun run src/postgres.ts
   ```

## Usage for MySQL

1. Create .env file with the following content:

   ```env
   MYSQL_URL=mysql://user:password@localhost:3306/dbname?multipleStatements=true
   OPENAI_API_KEY=your-openai-api-key
   ```

   > [!IMPORTANT]
   > Add `?multipleStatements=true` to the end of the MySQL URL, the AI commonly sends multiple queries in one request.

2. Install dependencies:

   ```sh
    bun install
   ```

3. Run the example:

   ```sh
   bun run src/mysql.ts
   ```
