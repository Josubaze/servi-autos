import React, { useMemo } from "react";

export const SectionTitle = ({ children, className }: any) => {
  const classes = useMemo(() => {
    const defaultClassName = "font-knewave primary-self-text text-2xl text-center";

    if (className) {
      return defaultClassName + " " + className;
    }

    return defaultClassName;
  }, [className]);

  return <div className={classes}>{children}</div>;
}

