import { ButtonHTMLAttributes } from "react";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  const { className, variant = "primary", ...rest } = props;
  const variantClass = variant === "secondary" ? "secondary" : variant === "danger" ? "danger" : "";
  return <button {...rest} className={`button ${variantClass} ${className || ""}`.trim()} />;
}
