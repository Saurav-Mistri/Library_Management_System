import * as dotenv from "dotenv";

dotenv.config();

const { DB_CONNECT, PORT, SECRET_ACCESS_TOKEN } = process.env;

export { DB_CONNECT, PORT, SECRET_ACCESS_TOKEN };