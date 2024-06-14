'use client'

import React from "react";
import Lottie from "lottie-react";
import json from "src/Lotties/lottie-supplier.json";

const LottieSupplier = (prop: any) => {
  return <Lottie animationData={json} {...prop} />;
}

export default LottieSupplier;

