import { Request, Response } from 'express';

export const makePayment = async (req: Request, res: Response) => {
  const { cardNumber, expiry, cvv, amount, currency, userId } = req.body;

  // Simple validation
  if (!cardNumber || !expiry || !cvv || !amount || !currency || !userId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  // Simulate payment delay
  setTimeout(() => {
    const transactionId = 'txn_' + Math.random().toString(36).substring(2, 10);

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      transactionId,
      checkinStatus: 'completed',
      userId,
      amount,
      currency
    });
  }, 1000);
};
