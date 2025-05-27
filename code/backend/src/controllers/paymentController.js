import { createMomoPaymentService, callbackMomoPaymentService, rechargeBalanceService,callbackRechargeBalanceService } from '../services/paymentService.js';

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

export const rechargeBalance = async (req, res) => {
  try {
    const { amount, userId } = req.body;
    // console.log("check data from rechargeBalance", amount, userId);
    const result = await rechargeBalanceService(amount, userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// ...existing code...
export const callbackRechargeBalance = async (req, res) => {
  try {
    // console.log("Received callback for recharge:", req.body);
    const result = await callbackRechargeBalanceService(req.body);
    // Momo thường mong đợi phản hồi HTTP 204 hoặc 200 với body trống hoặc JSON cụ thể cho IPN.
    // Kiểm tra tài liệu của Momo để biết phản hồi chính xác.
    // Tạm thời trả về kết quả xử lý.
    if (result.errCode === 0) {
      return res.status(200).json(result); // Hoặc res.status(204).send();
    } else {
      // Ngay cả khi có lỗi xử lý ở phía bạn, bạn vẫn nên trả về 2xx cho Momo để tránh retry.
      // Lỗi nên được log và xử lý nội bộ.
      return res.status(200).json(result); // Hoặc res.status(500) nếu bạn muốn Momo biết có lỗi.
    }
  } catch (error) {
    console.error('Critical error in callbackRechargeBalance controller:', error);
    // Phản hồi lỗi cho Momo, nhưng cẩn thận vì có thể gây retry không mong muốn.
    return res.status(500).json({ error: 'Internal Server Error during callback processing' });
  }
};
// ...existing code...