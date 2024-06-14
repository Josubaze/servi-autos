'use client'

import React from "react";
import Lottie from "lottie-react";
import json from "src/Lotties/lottie-budget.json";

const LottieBudget = (prop: any) => {
  return <Lottie animationData={json} {...prop} />;
}

export default LottieBudget;