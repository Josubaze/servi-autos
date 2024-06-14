'use client'

import React from "react";
import Lottie from "lottie-react";
import json from "src/Lotties/lottie-product.json";

const LottieProduct = (prop: any) => {
  return <Lottie animationData={json} {...prop} />;
}

export default LottieProduct;

