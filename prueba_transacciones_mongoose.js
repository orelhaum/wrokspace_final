async function main() {
  const mongoose = require('mongoose');
  const uri = 'mongodb://localhost:37017,localhost:47017,localhost:57017/txn';
  await mongoose.connect(uri, { useNewUrlParser: true, replicaSet: 'rs1' });

  await mongoose.connection.dropDatabase();
  const Account = mongoose.model('Account', new mongoose.Schema({
    name: String, balance: Number
  }));

  // Inserta dinero en las cuentas
  await Account.create([{ name: 'A', balance: 5 }, { name: 'B', balance: 10 }]);

  await transfer('A', 'B', 4); // Success
  try {
    // Error porque A tiene balance negativo
    await transfer('A', 'B', 2);
  } catch (error) {
    console.log(error.message);
    error.message; // "Insuficientes fondos: 1"
  }

  async function transfer(from, to, amount) {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const opts = { session, new: true };

      const A = await Account.
        findOneAndUpdate({ name: from }, { $inc: { balance: -amount } }, opts);

      if (A.balance < 0) {
        // Si A tiene un balance negativo, se abortará la transacción
        throw new Error('Insuficientes fondos: ' + (A.balance + amount));
      }

      const B = await Account.
        findOneAndUpdate({ name: to }, { $inc: { balance: amount } }, opts);

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