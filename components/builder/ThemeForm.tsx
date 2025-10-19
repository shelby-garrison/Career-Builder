"use client";

import ColorPicker from "@components/ui/ColorPicker";
import Input from "@components/ui/Input";

export type ThemeState = {
  primary: string;
  accent: string;
  textOnPrimary: string;
  logoUrl?: string;
  bannerUrl?: string;
  videoUrl?: string;
};

export default function ThemeForm({ value, onChange }: { value: ThemeState; onChange: (v: ThemeState) => void }) {
  function update<K extends keyof ThemeState>(key: K, v: ThemeState[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="grid">
      <div className="row" style={{ gap: 12 }}>
        <div>
          <label>Primary</label>
          <ColorPicker value={value.primary} onChange={(e) => update("primary", e.target.value)} />
        </div>
        <div>
          <label>Accent</label>
          <ColorPicker value={value.accent} onChange={(e) => update("accent", e.target.value)} />
        </div>
        <div>
          <label>Text on Primary</label>
          <ColorPicker value={value.textOnPrimary} onChange={(e) => update("textOnPrimary", e.target.value)} />
        </div>
      </div>
      <div>
        <label>Logo URL</label>
        <Input placeholder="https://..." value={value.logoUrl || ""} onChange={(e) => update("logoUrl", e.target.value)} />
      </div>
      <div>
        <label>Banner Image URL</label>
        <Input placeholder="https://..." value={value.bannerUrl || ""} onChange={(e) => update("bannerUrl", e.target.value)} />
      </div>
      <div>
        <label>Culture Video Embed URL (e.g., YouTube embed)</label>
        <Input placeholder="https://www.youtube.com/embed/..." value={value.videoUrl || ""} onChange={(e) => update("videoUrl", e.target.value)} />
      </div>

      <div className="panel" style={{ background: value.primary, color: value.textOnPrimary }}>
        <strong>Preview</strong>
        <p>Buttons and accents will use your brand colors.</p>
        <button className="button" style={{ background: value.accent, color: "#000" }}>Accent Button</button>
      </div>
    </div>
  );
}
