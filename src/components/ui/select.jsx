export function Select({ value, onChange, children }) {
  return <select value={value} onChange={onChange} className="border px-3 py-2 rounded">{children}</select>;
}
export function SelectTrigger() { return null; }
export function SelectContent({ children }) { return children; }
export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}
