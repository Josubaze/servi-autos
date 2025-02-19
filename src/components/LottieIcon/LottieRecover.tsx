import React from "react";
import Lottie from "lottie-react";
import json from "src/Lotties/lottie-recover.json";

const LottieRecover = (prop: any) => {
  return <Lottie animationData={json} {...prop} />;
}

export default LottieRecover;