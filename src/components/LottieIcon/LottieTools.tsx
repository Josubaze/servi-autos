import React from "react";
import Lottie from "lottie-react";
import json from "src/Lotties/lottie-tools.json";

const LottieTools = (prop: any) => {
  return <Lottie animationData={json} {...prop} />;
}

export default LottieTools;

