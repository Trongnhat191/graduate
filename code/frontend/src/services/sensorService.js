import axios from "../axios";

const manualPlateCorrectionEntry = (wrongPlate, correctPlate) => {
  return axios.post("/manual-plate-correction", { wrongPlate, correctPlate });
};

const manualPlateCorrectionExit = (correctPlate) => {
  return axios.post("/manual-plate-correction-exit", { correctPlate });
}
export { 
  manualPlateCorrectionEntry , 
  manualPlateCorrectionExit 
};
