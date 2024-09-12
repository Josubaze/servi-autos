import React from "react";
import Lottie from "lottie-react";
import json from "src/Lotties/lottie-persons.json";

const LottiePersons = (prop: any) => {
  return <Lottie animationData={json} {...prop} />;
}

export default LottiePersons;