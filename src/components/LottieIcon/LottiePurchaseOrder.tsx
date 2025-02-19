import React from "react";
import Lottie from "lottie-react";
import json from "src/Lotties/lottie-purchaseOrder.json";

const LottiePurchaseOrder = (prop: any) => {
  return <Lottie animationData={json} {...prop} />;
}

export default LottiePurchaseOrder;