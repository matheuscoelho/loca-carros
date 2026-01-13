import { MongoClient } from 'mongodb';
import { hash } from 'bcryptjs';
import { config } from 'dotenv';

config();

const uri = process.env.MONGODB_URI;

async function createAdmin() {
  const client = new MongoClient(uri);

  try {
    console.log("Conectando ao MongoDB...");
    await client.connect();

    const db = client.db(process.env.MONGODB_DB || "test");
    const usersCollection = db.collection("users");

    const email = "iuri@youbanking.com.br";
    const password = "123456";
    const name = "Iuri Admin";

    // Verificar se usuário já existe
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      // Atualizar para admin
      await usersCollection.updateOne(
        { email: email.toLowerCase() },
        { $set: { role: 'admin', updatedAt: new Date() } }
      );
      console.log("Usuário existente atualizado para admin!");
    } else {
      // Criar novo usuário admin
      const hashedPassword = await hash(password, 12);

      await usersCollection.insertOne({
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role: 'admin',
        emailVerified: true,
        favorites: [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("Usuário admin criado com sucesso!");
    }

    console.log("\nCredenciais:");
    console.log("Email:", email);
    console.log("Senha:", password);

  } catch (error) {
    console.error("Erro:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

createAdmin();
