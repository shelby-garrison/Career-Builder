import { SelectHTMLAttributes } from "react";

export default function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, children, ...rest } = props;
  return <select {...rest} className={`select ${className || ""}`.trim()}>{children}</select>;
}
