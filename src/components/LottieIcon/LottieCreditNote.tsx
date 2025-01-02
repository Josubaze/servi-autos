import React from "react";
import Lottie from "lottie-react";
import json from "src/Lotties/lottie-credit-note.json";

const LottieCreditNote = (prop: any) => {
  return <Lottie animationData={json} {...prop} />;
}

export default LottieCreditNote;