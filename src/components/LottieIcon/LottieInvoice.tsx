'use client'

import React from "react";
import Lottie from "lottie-react";
import json from "src/Lotties/lottie-invoice.json";

const LottieInvoice = (prop: any) => {
  return <Lottie animationData={json} {...prop} />;
}

export default LottieInvoice;