async function main() {

  const { MongoClient } = require('mongodb');
  const uri = 'mongodb://localhost:37017,localhost:47017,localhost:57017/txn';
  const client = await MongoClient.connect(uri, { useNewUrlParser: true, replicaSet: 'rs1' });

  const db = client.db();
  await db.dropDatabase();

  // Inserta dinero en las cuentas
  await db.collection('Account').insertMany([
    { name: 'A', balance: 25 },
    { name: 'B', balance: 20 }
  ]);

  await transfer('A', 'B', 4); // Success
  try {
    // Error porque A tiene balance negativo
    await transfer('A', 'B', 2);
  }
  catch (error) {
    console.log(error.message);
    error.message; // "Insuficientes fondos: 1"
  }

  async function transfer(from, to, amount) {

    const session = client.startSession();
    session.startTransaction();

    try {

      const opts = { session, returnOriginal: false };

      const A = await db.collection('Account').
        findOneAndUpdate({ name: from }, { $inc: { balance: -amount } }, opts).
        then(res => res.value);

      if (A.balance < 0) {
        // Si A tiene un balance negativo, se abortará la transacción
        throw new Error('Insuficientes fondos: ' + (A.balance + amount));
      }

      const B = await db.collection('Account').
        findOneAndUpdate({ name: to }, { $inc: { balance: amount } }, opts).
        then(res => res.value);

      await session.commitTransaction();
      session.endSession();
      return { from: A, to: B };
    }

    catch (error) {
      // Si hay un error, se aborta la transacción completa
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}

main()