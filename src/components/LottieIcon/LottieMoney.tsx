'use client'

import React from "react";
import Lottie from "lottie-react";
import json from "src/Lotties/lottie-moneyNew.json";

const LottieMoney = (props: any) => {
  return <Lottie animationData={json} {...props} />;
};

export default LottieMoney;
