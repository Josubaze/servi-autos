import React from "react";
import Lottie from "lottie-react";
import json from "src/Lotties/lottie-profile.json";

const LottieProfile = (prop: any) => {
  return <Lottie animationData={json} {...prop} />;
}

export default LottieProfile;