import { createMomoPaymentService, callbackMomoPaymentService } from '../services/paymentService.js';

export const createMomoPayment = async (req, res) => {
  try {
    // console.log("check data from paymentcontroller", req.body);
    const { month, userId } = req.body;
    const amount = req.body.totalPrice;
    const result = await createMomoPaymentService(amount, userId, month);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const callbackMomoPayment = async (req, res) => {
  try {
    const result = await callbackMomoPaymentService(req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};