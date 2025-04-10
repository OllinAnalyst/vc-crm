import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem } from "./components/ui/select";
import { Input } from "./components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { supabase } from "./supabaseClient";

const defaultStages = [
  "Inbound Deals",
  "Initial Call",
  "Deal Review",
  "Partner Call",
  "Memo",
  "IC",
  "Investment",
  "Freezer",
  "Dumpster",
];

const sourcers = ["Tom", "Stephen", "Ben", "Jameson", "Intern"];
const partners = ["Tom", "Stephen", "Ben"];

const stageColors = {
  "Inbound Deals": "bg-gray-100",
  "Initial Call": "bg-blue-100",
  "Deal Review": "bg-yellow-100",
  "Partner Call": "bg-orange-100",
  Memo: "bg-green-100",
  IC: "bg-indigo-100",
  Investment: "bg-purple-100",
  Freezer: "bg-neutral-200",
  Dumpster: "bg-red-100",
};

export default function CRMBoard() {
  const [deals, setDeals] = useState([]);
  const [stages] = useState(defaultStages);
  const [activeStage, setActiveStage] = useState("All");
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    stage: "Inbound Deals",
    sourcer: "",
    partner: "",
    notes: ""
  });
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserAndDeals = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
      if (user) {
        const { data, error } = await supabase.from("deals").select("*");
        if (!error) {
          const sorted = data.sort(
            (a, b) => stages.indexOf(a.stage) - stages.indexOf(b.stage)
          );
          setDeals(sorted);
        }
      }
    };
    getUserAndDeals();
  }, [stages]);

  const updateField = async (id, field, value) => {
    const { error } = await supabase.from("deals").update({ [field]: value }).eq("id", id);
    if (!error) {
      setDeals((prev) => {
        const updated = prev.map((deal) =>
          deal.id === id ? { ...deal, [field]: value } : deal
        );
        return [...updated].sort(
          (a, b) => stages.indexOf(a.stage) - stages.indexOf(b.stage)
        );
      });
    }
  };

  const handleDelete = async (id) => {
    console.log("Deleting deal with ID:", id);
    const { error, data } = await supabase.from("deals").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete from Supabase:", error.message);
    } else {
      console.log("Deleted successfully:", data);
      setDeals((prev) => prev.filter((deal) => deal.id !== id));
    }
  };
  

  const handleAddDeal = async () => {
    const { data, error } = await supabase
      .from("deals")
      .insert([{ ...formData }])
      .select();
    if (!error && data) {
      setDeals((prev) => {
        const updated = [...prev, ...data];
        return updated.sort(
          (a, b) => stages.indexOf(a.stage) - stages.indexOf(b.stage)
        );
      });
      setFormData({ company: "", stage: "Inbound Deals", sourcer: "", partner: "", notes: "" });
      setShowDialog(false);
    }
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
      const { data: dealsData, error: dealsError } = await supabase.from("deals").select("*");
      if (!dealsError) {
        const sorted = dealsData.sort(
          (a, b) => stages.indexOf(a.stage) - stages.indexOf(b.stage)
        );
        setDeals(sorted);
      }
    }
  };

  const filteredDeals = activeStage === "All"
    ? deals
    : deals.filter((deal) => deal.stage === activeStage);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-6 text-center max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Sign in to your CRM</h2>
        <div className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-red-600">{error}</div>}
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">VC Deal Tracker</h1>

      <div className="mb-6">
        <button
          onClick={() => setShowDialog(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          New Deal
        </button>

        {showDialog && (
          <div className="mt-4 p-4 border rounded bg-white shadow-md max-w-xl">
            <div className="grid grid-cols-1 gap-4">
              <Input
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
              <Select
                value={formData.stage}
                onValueChange={(value) => setFormData({ ...formData, stage: value })}
              >
                <SelectTrigger />
                <SelectContent>
                  {stages.map((s, i) => (
                    <SelectItem key={i} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={formData.sourcer}
                onValueChange={(value) => setFormData({ ...formData, sourcer: value })}
              >
                <SelectTrigger />
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {sourcers.map((s, i) => (
                    <SelectItem key={i} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={formData.partner}
                onValueChange={(value) => setFormData({ ...formData, partner: value })}
              >
                <SelectTrigger />
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {partners.map((p, i) => (
                    <SelectItem key={i} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
              <div className="flex justify-between">
                <button
                  onClick={handleAddDeal}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Add Deal
                </button>
                <button
                  onClick={() => setShowDialog(false)}
                  className="text-gray-500 hover:text-black"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="All" onValueChange={setActiveStage} className="mb-4">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="All">All</TabsTrigger>
          {stages.map((stage, idx) => (
            <TabsTrigger key={idx} value={stage}>
              {stage}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 gap-4">
        {filteredDeals.map((deal) => (
          <Card
            key={deal.id}
            className={`flex flex-col gap-2 p-4 rounded-xl shadow-md ${stageColors[deal.stage]}`}
          >
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
              <Input
                className="col-span-1"
                defaultValue={deal.company}
                onBlur={(e) => updateField(deal.id, "company", e.target.value)}
              />
              <Select value={deal.stage} onValueChange={(value) => updateField(deal.id, "stage", value)}>
                <SelectTrigger className="col-span-1" />
                <SelectContent>
                  {stages.map((stage, i) => (
                    <SelectItem key={i} value={stage}>{stage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={deal.sourcer || ""} onValueChange={(value) => updateField(deal.id, "sourcer", value)}>
                <SelectTrigger className="col-span-1" />
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {sourcers.map((s, i) => (
                    <SelectItem key={i} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={deal.partner || ""} onValueChange={(value) => updateField(deal.id, "partner", value)}>
                <SelectTrigger className="col-span-1" />
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {partners.map((p, i) => (
                    <SelectItem key={i} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="col-span-1"
                defaultValue={deal.notes || ""}
                onBlur={(e) => updateField(deal.id, "notes", e.target.value)}
                placeholder="Notes"
              />
              <div className="text-sm text-gray-600 col-span-1">
                {deal.last_updated ? new Date(deal.last_updated).toLocaleString() : "—"}
              </div>
              <button
                onClick={() => handleDelete(deal.id)}
                className="bg-red-500 text-white px-3 py-1 rounded col-span-1"
              >
                Delete
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}