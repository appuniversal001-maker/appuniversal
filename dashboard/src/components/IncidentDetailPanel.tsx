"use client";

import { useState } from "react";
import { Incident } from "@/app/page";

type Props = { incident: Incident | null };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="border-b border-white/5 pb-4 mb-4 last:border-0">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-gray-600 mb-3">{title}</h3>
            {children}
        </div>
    );
}

function Row({ label, value, mono, color }: { label: string; value: string | React.ReactNode; mono?: boolean; color?: string }) {
    return (
        <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] text-gray-600">{label}</span>
            <span className={`text-xs font-medium ${mono ? "font-mono" : ""} ${color ?? "text-gray-300"}`}>{value}</span>
        </div>
    );
}

function AudioWave() {
    return (
        <div className="flex items-center gap-[3px] h-6">
            {Array.from({ length: 20 }).map((_, i) => (
                <div
                    key={i}
                    className="w-0.5 bg-green-400 rounded-full"
                    style={{
                        height: `${Math.random() * 20 + 4}px`,
                        animationDelay: `${i * 0.05}s`,
                        animation: "waveBar 0.8s ease-in-out infinite alternate",
                    }}
                />
            ))}
            <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.3); }
          to { transform: scaleY(1); }
        }
      `}</style>
        </div>
    );
}

export default function IncidentDetailPanel({ incident }: Props) {
    const [dispatched, setDispatched] = useState(false);

    if (!incident) {
        return (
            <aside className="w-72 border-l border-white/5 bg-[#080d1e] flex items-center justify-center">
                <p className="text-gray-700 text-xs font-mono text-center">Selecione um alerta<br />para ver detalhes</p>
            </aside>
        );
    }

    const isHostage = incident.type === "hostage";

    return (
        <aside className="w-72 flex flex-col border-l border-white/5 bg-[#080d1e] z-20 overflow-y-auto">
            {/* Header */}
            <div className={`px-4 py-3 border-b border-white/5 ${isHostage ? "bg-red-950/30" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Ocorrência Detalhada</span>
                    <span className="text-[9px] font-mono text-gray-700">{incident.id}</span>
                </div>
                <h2 className="text-base font-bold text-white">{incident.victim}</h2>
                <p className="text-xs text-gray-500">{incident.profile}</p>

                {isHostage && (
                    <div className="mt-2 px-2 py-1.5 rounded bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
                        <span className="text-[10px] font-mono text-red-400 uppercase tracking-wide">⚠ Situação de Refém — Coação</span>
                    </div>
                )}
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                {/* Live Audio Feed */}
                {incident.audioLive && (
                    <Section title="Áudio ao Vivo">
                        <div className="flex items-center justify-between glass rounded-lg px-3 py-2.5 mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[10px] font-mono text-green-400">TRANSMITINDO</span>
                            </div>
                            <span className="text-[10px] text-gray-600 font-mono">00:04:32</span>
                        </div>
                        <AudioWave />
                    </Section>
                )}

                {/* Victim Info */}
                <Section title="Dados da Vítima">
                    <Row label="Telefone" value={incident.phone} mono />
                    <Row label="Perfil" value={incident.profile} />
                    <Row label="Medida Protetiva" value={incident.protectionOrder ? "✓ ATIVA" : "Não"} color={incident.protectionOrder ? "text-purple-400" : "text-gray-500"} />
                    <Row label="Bateria" value={`${incident.battery}%`} mono color={incident.battery > 40 ? "text-green-400" : incident.battery > 15 ? "text-yellow-400" : "text-red-400"} />
                </Section>

                {/* Location */}
                <Section title="Localização">
                    <p className="text-xs text-gray-300 mb-2">{incident.address}</p>
                    <Row label="Latitude" value={incident.lat.toFixed(5)} mono color="text-blue-400" />
                    <Row label="Longitude" value={incident.lng.toFixed(5)} mono color="text-blue-400" />
                    <Row label="Alerta iniciado" value={incident.time} />
                </Section>

                {/* Intelligence */}
                <Section title="Inteligência Algorítmica">
                    <div className="space-y-2">
                        {[
                            { label: "Tornozeleira em raio 200m", value: isHostage ? "DETECTADA" : "Não detectada", alert: isHostage },
                            { label: "Histórico de BO", value: isHostage ? "3 ocorrências" : "Sem histórico", alert: isHostage },
                            { label: "Viatura + próxima", value: "DELTA-4 · 1.2 km", alert: false },
                        ].map((item) => (
                            <div key={item.label} className="flex justify-between">
                                <span className="text-[11px] text-gray-600">{item.label}</span>
                                <span className={`text-[10px] font-mono ${item.alert ? "text-red-400" : "text-gray-400"}`}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Timeline */}
                <Section title="Timeline">
                    <div className="space-y-2">
                        {[
                            { time: incident.time, event: "SOS Acionado", color: "bg-red-500" },
                            { time: "há 30s", event: "Alerta recebido no CIOPS", color: "bg-yellow-500" },
                            { time: "há 20s", event: "Áudio iniciado", color: "bg-green-500" },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <div className={`w-2 h-2 ${item.color} rounded-full mt-1 shrink-0`} />
                                <div>
                                    <p className="text-xs text-gray-300">{item.event}</p>
                                    <p className="text-[10px] text-gray-600 font-mono">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-white/5 space-y-2">
                <button
                    onClick={() => setDispatched(true)}
                    className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2
            ${dispatched
                            ? "bg-green-900/30 border border-green-500/30 text-green-400 cursor-default"
                            : "bg-blue-600 hover:bg-blue-500 text-white glow-blue"
                        }`}
                >
                    {dispatched ? "✓ Viatura Despachada" : "Despachar Viatura Mais Próxima"}
                </button>
                <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-lg text-xs font-mono border border-white/10 text-gray-400 hover:bg-white/5 transition-colors">
                        Ack
                    </button>
                    <button className="flex-1 py-2 rounded-lg text-xs font-mono border border-green-500/30 text-green-400 hover:bg-green-900/20 transition-colors">
                        Resolver
                    </button>
                    <button className="flex-1 py-2 rounded-lg text-xs font-mono border border-red-500/30 text-red-400 hover:bg-red-900/20 transition-colors">
                        Falso
                    </button>
                </div>
            </div>
        </aside>
    );
}
