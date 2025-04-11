import { Request, Response } from 'express';
import Invoice from '../models/invoice.model';

export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      bookingId,
      guestId,
      roomId,
      lineItems,
      subtotal,
      taxAmount,
      totalAmount,
      billing
    } = req.body;

    // Validate essential fields
    if (!bookingId || !guestId || !roomId || !lineItems || !billing) {
      res.status(400).json({ error: 'Missing required invoice fields' });
      return;
    }

    const invoiceData = {
      bookingId,
      guestId,
      roomId,
      lineItems,
      subtotal,
      taxAmount,
      totalAmount,
      billing,
      issuedAt: new Date().toISOString()
    };

    const invoice = await Invoice.create(invoiceData);

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice
    });
  } catch (err: any) {
    console.error('Error creating invoice:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
};
