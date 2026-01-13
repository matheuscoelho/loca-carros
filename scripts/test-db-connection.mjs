import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config();

const uri = process.env.MONGODB_URI;

async function testConnection() {
  const client = new MongoClient(uri);

  try {
    console.log("🔄 Conectando ao MongoDB Atlas...");

    await client.connect();

    console.log("✅ Conexão estabelecida com sucesso!");

    // Testar ping
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Ping realizado com sucesso!");

    // Listar databases
    const dbs = await client.db().admin().listDatabases();
    console.log("\n📂 Databases disponíveis:");
    dbs.databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024).toFixed(2)} KB)`);
    });

    // Criar/acessar database carento
    const db = client.db("carento");
    console.log("\n✅ Database 'carento' acessado!");

    // Listar collections
    const collections = await db.listCollections().toArray();
    if (collections.length > 0) {
      console.log("\n📁 Collections em 'carento':");
      collections.forEach(col => console.log(`   - ${col.name}`));
    } else {
      console.log("\n📁 Nenhuma collection ainda em 'carento' (será criada ao inserir dados)");
    }

    console.log("\n🎉 Teste de conexão concluído com sucesso!");

  } catch (error) {
    console.error("❌ Erro na conexão:", error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n🔒 Conexão fechada.");
  }
}

testConnection();
