import axios from "../axios";

const manualPlateCorrectionEntry = (wrongPlate, correctPlate) => {
  return axios.post("/manual-plate-correction", { wrongPlate, correctPlate });
};

const manualPlateCorrectionExit = (correctPlate) => {
  return axios.post("/manual-plate-correction-exit", { correctPlate });
}

const manualPaymentConfirm = (fee, numberPlate) => {
  return axios.post("/api/manual-payment-confirm", { fee, numberPlate });
}
export { 
  manualPlateCorrectionEntry , 
  manualPlateCorrectionExit ,
  manualPaymentConfirm
};
