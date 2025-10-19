"use client";

import { InputHTMLAttributes } from "react";

export default function ColorPicker(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="color" {...props} className="input" style={{ padding: 0, height: 40 }} />;
}
