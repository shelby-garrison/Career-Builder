"use client";

import { useState } from "react";
import Input from "@components/ui/Input";
import TextArea from "@components/ui/TextArea";
import Button from "@components/ui/Button";

export type SectionState = { id: string; title: string; body: string; titleAlign?: "left" | "center" | "right" };

export default function SectionsEditor({ value, onChange }: { value: SectionState[]; onChange: (v: SectionState[]) => void }) {
  const [local, setLocal] = useState<SectionState[]>(value);

  function commit(next: SectionState[]) {
    setLocal(next);
    onChange(next);
  }
  function add() {
    const id = Math.random().toString(36).slice(2, 8);
    commit([...local, { id, title: "New Section", body: "", titleAlign: "left" }]);
  }
  function update(i: number, patch: Partial<Omit<SectionState, "id">>) {
    const next: SectionState[] = local.slice();
    next[i] = { ...next[i]!, ...patch } as SectionState;
    commit(next);
  }
  function remove(i: number) {
    const next = local.slice();
    next.splice(i, 1);
    commit(next);
  }
  function up(i: number) {
    if (i === 0) return;
    const next: SectionState[] = local.slice();
    const tmp = next[i - 1]!; next[i - 1] = next[i]!; next[i] = tmp;
    commit(next);
  }
  function down(i: number) {
    if (i === local.length - 1) return;
    const next: SectionState[] = local.slice();
    const tmp = next[i + 1]!; next[i + 1] = next[i]!; next[i] = tmp;
    commit(next);
  }

  return (
    <div className="grid">
      {local.map((s, i) => (
        <div className="panel" key={s.id}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h3>Section {i + 1}</h3>
            <div className="row">
              <Button variant="secondary" onClick={() => up(i)}>↑</Button>
              <Button variant="secondary" onClick={() => down(i)}>↓</Button>
              <Button variant="danger" onClick={() => remove(i)}>Remove</Button>
            </div>
          </div>
          <div className="grid">
            <div>
              <label>Title</label>
              <Input value={s.title} onChange={(e) => update(i, { title: e.target.value })} />
            </div>
            <div>
              <label>Title Alignment</label>
              <select className="select" value={s.titleAlign || "left"} onChange={(e) => update(i, { titleAlign: e.target.value as any })}>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label>Body</label>
              <TextArea rows={4} value={s.body} onChange={(e) => update(i, { body: e.target.value })} />
            </div>
          </div>
        </div>
      ))}
      <Button onClick={add}>+ Add Section</Button>
    </div>
  );
}
