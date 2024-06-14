import React, { useMemo } from "react";

export const SectionTitle = ({ children, className }: any) => {
  const classes = useMemo(() => {
    const defaultClassName = "primary-self-text text-lg font-title";

    if (className) {
      return defaultClassName + " " + className;
    }

    return defaultClassName;
  }, [className]);

  return <div className={classes}>{children}</div>;
}

