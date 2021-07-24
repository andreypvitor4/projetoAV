import { MongoClient } from "mongodb";

export default async function connectDB() {

  const client = new MongoClient(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  await client.connect()

  const db = client.db('projetoAV')
  return { db, client }
}