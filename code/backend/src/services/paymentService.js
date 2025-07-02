import axios from 'axios';
import crypto from 'crypto';
import db from '../models/index.js';


// Momo payment 
export const createMomoPaymentService = async (amount, userId, month) => {
    console.log("check data from paymentservice", amount);
  const accessKey = process.env.ACCESSKEY;
  const secretKey = process.env.SECRETKEY;
  const orderInfo = 'pay with MoMo';
  const partnerCode = 'MOMO';
  const redirectUrl = 'http://localhost:3000/home';
  const ipnUrl = 'https://e40f-171-241-3-8.ngrok-free.app/api/momo/callback';
  const requestType = "payWithMethod";
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = Buffer.from(JSON.stringify({ userId, month })).toString('base64');
  const orderGroupId = '';
  const autoCapture = true;
  const lang = 'vi';

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = JSON.stringify({
    partnerCode, partnerName: "Test", storeId: "MomoTestStore", requestId,
    amount, orderId, orderInfo, redirectUrl, ipnUrl, lang, requestType,
    autoCapture, extraData, orderGroupId, signature
  });

  const options = {
    url: 'https://test-payment.momo.vn/v2/gateway/api/create',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    }
  };

  const result = await axios.post(options.url, requestBody, { headers: options.headers });
  return result.data;
};

export const updateMonthTicket = async (userId, month) => {
    // Lấy xe của user
    const car = await db.Car.findOne({ where: { userId } });
    if (!car) return;

    // Kiểm tra vé tháng hiện tại
    let ticket = await db.Ticket.findOne({ 
      where: { 
        carId: car.id, ticketType: 'month' 
      }, 
      raw: false 
  });
    console.log("ticket from payment service", ticket);
    const now = new Date();

    if (ticket) {
        // Nếu còn hạn, cộng thêm tháng, hết hạn thì bắt đầu lại từ hôm nay
        const currentEnd = new Date(ticket.endDate);
        const startDate = currentEnd > now ? currentEnd : now;
        ticket.endDate = new Date(startDate.setMonth(startDate.getMonth() + Number(month)));
        ticket.price += 10000 * Number(month);
        await ticket.save();
    } else {
        // Tạo vé tháng mới
        console.log("Creating new month ticket for car:", car.id);
        const startDate = now;
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + Number(month));
        await db.Ticket.create({
            carId: car.id,
            ticketType: 'month',
            startDate,
            endDate,
            price: 10000 * Number(month),
        });
    }
};

export const callbackMomoPaymentService = async (callbackData) => {
    // console.log("check data from callback backend", callbackData);

    const resultCode = callbackData.resultCode;
    if (resultCode === 0){
      console.log("Payment successful, updating month ticket...");
        const extraData = JSON.parse(Buffer.from(callbackData.extraData, 'base64').toString('utf-8'));
        const userId = extraData.userId;
        const month = extraData.month;
        console.log("check userId from callback", userId);
        console.log("check month from callback", month);
        await updateMonthTicket(userId, month);
    }


    return {message: "ok", data: callbackData};
}

// Recharge balance
export const rechargeBalanceService = async (amount, userId) => {
  // console.log("check data from rechargeBalanceService", amount, userId);
  const accessKey = process.env.ACCESSKEY;
  const secretKey = process.env.SECRETKEY;
  const orderInfo = 'pay with MoMo';
  const partnerCode = 'MOMO';
  const redirectUrl = 'http://localhost:3000/home';
  const ipnUrl = 'https://e40f-171-241-3-8.ngrok-free.app/api/momo/callback-recharge';
  const requestType = "payWithMethod";
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = Buffer.from(JSON.stringify({ userId, amount })).toString('base64');
  const orderGroupId = '';
  const autoCapture = true;
  const lang = 'vi';

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

  const requestBody = JSON.stringify({
    partnerCode, partnerName: "Test", storeId: "MomoTestStore", requestId,
    amount, orderId, orderInfo, redirectUrl, ipnUrl, lang, requestType,
    autoCapture, extraData, orderGroupId, signature
  });

  const options = {
    url: 'https://test-payment.momo.vn/v2/gateway/api/create',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    }
  };

  const result = await axios.post(options.url, requestBody, { headers: options.headers });
  return result.data;
}

// ...existing code...
export const callbackRechargeBalanceService = async (callbackData) => {
  const resultCode = callbackData.resultCode;
  if (resultCode === 0) {
    const extraData = JSON.parse(Buffer.from(callbackData.extraData, 'base64').toString('utf-8'));
    const userId = extraData.userId;
    const amount = Number(extraData.amount);

    console.log("Callback for recharge received for userId:", userId, "amount:", amount);

    try {
      const user = await db.User.findByPk(userId, { raw: false });
      if (user) {
        user.balance = (user.balance || 0) + amount;
        await user.save();
        console.log(`User ${userId} balance updated. New balance: ${user.balance}`);
        return { errCode: 0, message: "Recharge successful and balance updated", data: callbackData };
      } else {
        console.error(`User not found for ID: ${userId} in callbackRechargeBalanceService`);
        return { errCode: 1, message: "User not found", data: callbackData };
      }
    } catch (error) {
      console.error("Error updating user balance in callbackRechargeBalanceService:", error);
      return { errCode: 2, message: "Error updating balance", data: callbackData };
    }
  } else {
    console.log("Recharge callback indicated failure or pending:", callbackData);
    return { errCode: resultCode, message: "Recharge not successful at gateway", data: callbackData };
  }
};
