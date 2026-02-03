import React from "react";
import Tabs from "@theme-original/Tabs";
import type TabsType from "@theme/Tabs";
import type { WrapperProps } from "@docusaurus/types";

type TabsProps = WrapperProps<typeof TabsType> & {
  variant?: "pill" | "default";
};

export default function TabsWrapper({
  variant,
  className,
  ...rest
}: TabsProps) {
  const variantClassName = variant === "pill" ? "tabs--compact" : undefined;
  const mergedClassName = [className, variantClassName]
    .filter(Boolean)
    .join(" ");

  return <Tabs {...rest} className={mergedClassName} />;
}
