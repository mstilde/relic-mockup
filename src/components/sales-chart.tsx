"use client";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { money } from "@/lib/utils";

export function SalesChart({ data }: { data: { date: string; value: number }[] }) {
  return <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 8, left: 8, bottom: 0 }}>
        <defs><linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#445747" stopOpacity={0.32}/><stop offset="100%" stopColor="#445747" stopOpacity={0}/></linearGradient></defs>
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#a8a29e", fontSize: 10 }} interval={2}/>
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", boxShadow: "0 12px 30px rgba(0,0,0,.08)", fontSize: 12 }} formatter={(value) => money(Number(value))}/>
        <Area type="monotone" dataKey="value" stroke="#445747" strokeWidth={2.5} fill="url(#fillSales)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>;
}
