import React from "react";
import Lottie from "lottie-react";
import json from "src/Lotties/lottie-report.json";

const LottieReport = (prop: any) => {
  return <Lottie animationData={json} {...prop} />;
}

export default LottieReport;