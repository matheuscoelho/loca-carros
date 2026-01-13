// Script para atualizar email da conta principal
// Execute com: node scripts/update-email.js

const { MongoClient } = require('mongodb');
require('dotenv').config();

async function updateEmail() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI não definida');
        process.exit(1);
    }

    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('Conectado ao MongoDB');
        
        const db = client.db(process.env.MONGODB_DB || 'test');
        const usersCollection = db.collection('users');
        
        // Encontrar conta admin/principal
        const admin = await usersCollection.findOne({ role: 'admin' });
        
        if (admin) {
            console.log('Conta admin encontrada:', admin.email);
            
            // Atualizar email
            const result = await usersCollection.updateOne(
                { _id: admin._id },
                { $set: { email: 'matheuscoelhoo321@gmail.com' } }
            );
            
            if (result.modifiedCount > 0) {
                console.log('Email atualizado para: matheuscoelhoo321@gmail.com');
            } else {
                console.log('Nenhuma alteração feita');
            }
        } else {
            // Se não tem admin, atualiza o primeiro usuário
            const firstUser = await usersCollection.findOne({});
            if (firstUser) {
                console.log('Primeiro usuário encontrado:', firstUser.email);
                const result = await usersCollection.updateOne(
                    { _id: firstUser._id },
                    { $set: { email: 'matheuscoelhoo321@gmail.com' } }
                );
                if (result.modifiedCount > 0) {
                    console.log('Email atualizado para: matheuscoelhoo321@gmail.com');
                }
            } else {
                console.log('Nenhum usuário encontrado no banco');
            }
        }
        
    } catch (error) {
        console.error('Erro:', error);
    } finally {
        await client.close();
    }
}

updateEmail();
