import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository, getRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepostitory = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepostitory.find();
  const balance = await transactionsRepostitory.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title,type, value, category} = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    type,
    value,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  //return response.status(204).send();
  return response.status(201).json({mesage: 'Transaction deleted with sucess'});



});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const importTransaction = new ImportTransactionsService();

  const transactions = await importTransaction.execute(request.file.path);

  return response.json(transactions);
});

export default transactionsRouter;
