"use client";

import { Incident } from "@/app/page";

type Props = { time: string; activeCount: number };

export default function TopBar({ time, activeCount }: Props) {
    return (
        <header className="h-14 flex items-center justify-between px-6 bg-[#080d1e] border-b border-white/5 shrink-0 z-30">
            {/* Left: Logo */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="relative w-7 h-7">
                        <div className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-30 animate-ping" />
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-white leading-none tracking-wide">Guardião Universal</h1>
                        <p className="text-[10px] text-blue-400/60 font-mono uppercase tracking-widest">CIOPS Command Center</p>
                    </div>
                </div>

                <div className="h-6 w-px bg-white/10" />

                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-mono font-semibold text-red-400">{activeCount} ALERTAS ATIVOS</span>
                </div>
            </div>

            {/* Center: System Status */}
            <div className="hidden md:flex items-center gap-6">
                {[
                    { label: "API", color: "green" },
                    { label: "RADAR", color: "green" },
                    { label: "AVL VIATURAS", color: "green" },
                    { label: "BACKUP", color: "yellow" },
                ].map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${s.color === "green" ? "bg-green-400 animate-pulse" :
                                s.color === "yellow" ? "bg-yellow-400 animate-pulse" : "bg-red-400"
                            }`} />
                        <span className="text-[10px] font-mono text-gray-500">{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Right: Time + Operator */}
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <div className="text-sm font-mono font-bold text-green-400 tracking-widest">{time}</div>
                    <div className="text-[10px] font-mono text-gray-600">UTC-3 • São Paulo</div>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-xs font-bold text-white">OP</div>
                    <div className="hidden sm:block">
                        <div className="text-xs font-semibold text-white leading-none">Operador 01</div>
                        <div className="text-[10px] text-gray-500">Turno A</div>
                    </div>
                </div>
            </div>
        </header>
    );
}
