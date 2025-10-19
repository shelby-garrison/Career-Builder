import { TextareaHTMLAttributes } from "react";

export default function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return <textarea {...rest} className={`textarea ${className || ""}`.trim()} />;
}
