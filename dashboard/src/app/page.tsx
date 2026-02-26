"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import AlertPanel from "@/components/AlertPanel";
import TopBar from "@/components/TopBar";
import IncidentDetailPanel from "@/components/IncidentDetailPanel";
import StatsBar from "@/components/StatsBar";

const RadarMap = dynamic(() => import("@/components/RadarMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#060810]">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-blue-400 font-mono text-sm tracking-widest">INICIALIZANDO RADAR...</p>
      </div>
    </div>
  ),
});

export type Incident = {
  id: string;
  victim: string;
  phone: string;
  lat: number;
  lng: number;
  type: "hostage" | "active" | "suspect_pin" | "accident";
  status: "active" | "acknowledged" | "resolved";
  profile: string;
  battery: number;
  protectionOrder: boolean;
  time: string;
  address: string;
  audioLive: boolean;
};

const MOCK_INCIDENTS: Incident[] = [
  { id: "INC-7841", victim: "Maria Silva", phone: "(11) 9 9812-3456", lat: -23.55052, lng: -46.633308, type: "hostage", status: "active", profile: "Violência Doméstica", battery: 62, protectionOrder: true, time: "há 1 min", address: "Rua das Flores, 245 - Centro", audioLive: true },
  { id: "INC-7839", victim: "João Souza", phone: "(21) 9 9234-5678", lat: -23.56052, lng: -46.648308, type: "active", status: "active", profile: "Motorista de App", battery: 35, protectionOrder: false, time: "há 4 min", address: "Av. Paulista, 1500 - Bela Vista", audioLive: false },
  { id: "INC-7836", victim: "Loja Ramirez", phone: "(11) 2234-9090", lat: -23.54052, lng: -46.621308, type: "suspect_pin", status: "acknowledged", profile: "Comércio", battery: 89, protectionOrder: false, time: "há 12 min", address: "Rua Augusta, 890 - Consolação", audioLive: false },
  { id: "INC-7831", victim: "Carlos Melo", phone: "(11) 9 9111-2222", lat: -23.551, lng: -46.657, type: "accident", status: "acknowledged", profile: "Cidadão", battery: 18, protectionOrder: false, time: "há 18 min", address: "BR-116, Km 42 - Zona Norte", audioLive: false },
];

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_INCIDENTS[0].id);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const selected = MOCK_INCIDENTS.find(i => i.id === selectedId) ?? null;

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#060810]">
      <TopBar time={time} activeCount={MOCK_INCIDENTS.filter(i => i.status === "active").length} />
      <StatsBar incidents={MOCK_INCIDENTS} />

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Alert list */}
        <AlertPanel
          incidents={MOCK_INCIDENTS}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        {/* CENTER: Map */}
        <main className="flex-1 relative">
          <RadarMap incidents={MOCK_INCIDENTS} selectedId={selectedId} onSelect={setSelectedId} />
        </main>

        {/* RIGHT: Detail panel */}
        <IncidentDetailPanel incident={selected} />
      </div>
    </div>
  );
}
