import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);

  const tenant = await mongoose.connection.db.collection('tenants').findOne({ name: /movseven/i });

  console.log('Tenant MovSeven:');
  console.log(JSON.stringify(tenant, null, 2));

  await mongoose.disconnect();
}
//
check();
