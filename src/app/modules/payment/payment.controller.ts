import { RequestHandler } from 'express';
import { PaymentService } from './payment.service';

const createPayment: RequestHandler = async (req, res, next) => {
  // console.log(req.body, 'payment data');

  try {
    const data = req.body;
    const sessions = await PaymentService.createCheckoutSession(data);
    console.log(sessions);
    res.status(200).json({
      status: 200,
      message: 'payment created successfully',
      data: sessions,
    });
  } catch (err) {
    console.log('error');
    next(err);
  }
};

export const PaymentController = {
  createPayment,
};
