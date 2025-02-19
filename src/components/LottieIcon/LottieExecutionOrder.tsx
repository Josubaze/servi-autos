import React from "react";
import Lottie from "lottie-react";
import json from "src/Lotties/lottie-executionOrder.json";

const LottieExecutionOrder = (prop: any) => {
  return <Lottie animationData={json} {...prop} />;
}

export default LottieExecutionOrder;