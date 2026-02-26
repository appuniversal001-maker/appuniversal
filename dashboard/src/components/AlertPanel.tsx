"use client";

import { Incident } from "@/app/page";

type Props = {
    incidents: Incident[];
    selectedId: string | null;
    onSelect: (id: string) => void;
};

const TYPE_CONFIG = {
    hostage: { label: "REFÉM", badge: "badge-red", ring: "border-red-500/30 bg-red-950/30" },
    active: { label: "ATIVO", badge: "badge-yellow", ring: "border-yellow-500/20 bg-yellow-900/10" },
    suspect_pin: { label: "SUSPEITO", badge: "badge-blue", ring: "border-blue-500/20 bg-blue-900/10" },
    accident: { label: "ACIDENTE", badge: "badge-blue", ring: "border-blue-500/20 bg-blue-900/10" },
};

function BatteryIcon({ level }: { level: number }) {
    const color = level > 40 ? "text-green-400" : level > 15 ? "text-yellow-400" : "text-red-400";
    return (
        <div className={`flex items-center gap-1 text-[10px] font-mono ${color}`}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
                <line x1="23" y1="13" x2="23" y2="11" />
                <rect x="3" y="8" width={`${Math.round(level / 100 * 14)}`} height="8" rx="1" fill="currentColor" stroke="none" />
            </svg>
            {level}%
        </div>
    );
}

export default function AlertPanel({ incidents, selectedId, onSelect }: Props) {
    const sorted = [...incidents].sort((a, b) => {
        const p = (i: Incident) => i.type === "hostage" ? 0 : i.type === "active" ? 1 : 2;
        return p(a) - p(b);
    });

    return (
        <aside className="w-80 flex flex-col border-r border-white/5 bg-[#080d1e] overflow-hidden z-20">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Fila de Triage</span>
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-gray-400">{incidents.length} ocorrências</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-white/5">
                {["Todos", "Ativos", "Refém"].map((tab, i) => (
                    <button key={tab} className={`flex-1 text-[10px] font-mono uppercase tracking-wider py-2 transition-colors ${i === 0 ? "text-blue-400 border-b-2 border-blue-500" : "text-gray-600 hover:text-gray-400"}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-2 space-y-1 px-2">
                {sorted.map((inc) => {
                    const cfg = TYPE_CONFIG[inc.type];
                    const isSelected = inc.id === selectedId;

                    return (
                        <button
                            key={inc.id}
                            onClick={() => onSelect(inc.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-all animate-fade-in-up
                ${isSelected
                                    ? "border-blue-500/40 bg-blue-900/20"
                                    : `${cfg.ring} hover:bg-white/5`
                                }
              `}
                        >
                            {/* Top row */}
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {inc.type === "hostage" && (
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    )}
                                    <span className="font-semibold text-sm text-gray-100 truncate max-w-[130px]">{inc.victim}</span>
                                </div>
                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${cfg.badge}`}>{cfg.label}</span>
                            </div>

                            {/* Mid: address */}
                            <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2 truncate">
                                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                <span className="truncate">{inc.address}</span>
                            </div>

                            {/* Bottom row */}
                            <div className="flex items-center justify-between">
                                <BatteryIcon level={inc.battery} />
                                <div className="flex items-center gap-2">
                                    {inc.audioLive && (
                                        <div className="flex items-center gap-1 text-green-400">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" /><line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" /></svg>
                                            <span className="text-[9px] font-mono uppercase">Live</span>
                                        </div>
                                    )}
                                    {inc.protectionOrder && (
                                        <span className="text-[9px] font-mono text-purple-400 border border-purple-500/30 px-1 rounded">MP</span>
                                    )}
                                    <span className="text-[10px] text-gray-600 font-mono">{inc.time}</span>
                                </div>
                            </div>

                            {/* Progress bar / ID */}
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-[9px] font-mono text-gray-700">{inc.id}</span>
                                <div className={`h-1 w-16 rounded-full ${inc.type === "hostage" ? "bg-red-900" : "bg-gray-800"}`}>
                                    <div className={`h-1 rounded-full ${inc.type === "hostage" ? "bg-red-500 glow-red" : "bg-yellow-500"}`} style={{ width: inc.type === "hostage" ? "100%" : "60%" }} />
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </aside>
    );
}
