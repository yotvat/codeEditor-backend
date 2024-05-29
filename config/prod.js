export default {
  dbURL:
    process.env.MONGO_URL ||
    'mongodb+srv://idoyotvat:idoyotvat26@cluster0.9yob3ir.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  dbName: process.env.DB_NAME || 'block_db',
}
