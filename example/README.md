# AI-SQL Example

Note: We rely on bun for running these, but not for installing.

## Usage for PostgreSQL

1. Create .env file with the following content:

   ```env
   POSTGRES_URL=postgresql://user:password@localhost:5432/dbname

   OPENAI_API_KEY=your-openai-api-key
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Run the example:

   ```sh
   npm run postgres
   ```

## Usage for SQLite

1. Create .env file with the following content:

   ```env
   OPEN_AI_API_KEY=your-openai-api-key
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Run the example:

   ```sh
   npm run sqlite
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
    npm install
   ```

3. Run the example:

   ```sh
    npm run mysql
   ```
