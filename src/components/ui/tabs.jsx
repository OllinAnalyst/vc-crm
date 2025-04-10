export function Tabs({ children }) { return <div>{children}</div>; }
export function TabsList({ children }) { return <div className="flex gap-2">{children}</div>; }
export function TabsTrigger({ children }) { return <button className="border px-3 py-1">{children}</button>; }
