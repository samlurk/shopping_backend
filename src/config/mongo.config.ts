import 'dotenv/config';
import { connect, set } from 'mongoose';

async function dbConnect(): Promise<void> {
  await connect(process.env.DB_URI as string);
}
set('strictQuery', true);

export default dbConnect;
