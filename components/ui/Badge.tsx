import { HTMLAttributes } from "react";

export default function Badge(props: HTMLAttributes<HTMLSpanElement>) {
  const { className, ...rest } = props;
  return <span {...rest} className={`badge ${className || ""}`.trim()} />;
}
