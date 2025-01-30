import React from "react";
import Lottie from "lottie-react";
import json from "src/Lotties/lottie-money-pending.json";

const LottieMoneyPending = (prop: any) => {
  return <Lottie animationData={json} {...prop} />;
}

export default LottieMoneyPending;