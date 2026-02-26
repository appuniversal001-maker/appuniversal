"use client";

import { Incident } from "@/app/page";

type Props = { incidents: Incident[] };

export default function StatsBar({ incidents }: Props) {
    const active = incidents.filter(i => i.status === "active").length;
    const acknowledged = incidents.filter(i => i.status === "acknowledged").length;
    const hostage = incidents.filter(i => i.type === "hostage").length;
    const withProtection = incidents.filter(i => i.protectionOrder).length;

    const stats = [
        { label: "ALERTAS ATIVOS", value: active, color: "text-red-400", bg: "border-red-500/20 bg-red-500/5" },
        { label: "EM ATENDIMENTO", value: acknowledged, color: "text-yellow-400", bg: "border-yellow-500/20 bg-yellow-500/5" },
        { label: "SITUAÇÃO REFÉM", value: hostage, color: "text-red-300", bg: "border-red-500/30 bg-red-900/20" },
        { label: "MEDIDA PROTETIVA", value: withProtection, color: "text-purple-400", bg: "border-purple-500/20 bg-purple-500/5" },
        { label: "VIATURAS AVL", value: 12, color: "text-green-400", bg: "border-green-500/20 bg-green-500/5" },
        { label: "TEMPO RESP. MÉDIO", value: "4′32″", color: "text-blue-400", bg: "border-blue-500/20 bg-blue-500/5" },
    ];

    return (
        <div className="bg-[#080d1e] border-b border-white/5 px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
            {stats.map((s, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-1.5 rounded-lg border ${s.bg} shrink-0`}>
                    <div>
                        <div className={`text-[10px] font-mono tracking-widest text-gray-500 uppercase`}>{s.label}</div>
                        <div className={`text-lg font-bold font-mono ${s.color} leading-none mt-0.5`}>{s.value}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
