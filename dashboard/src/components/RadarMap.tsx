"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Incident } from "@/app/page";

function createIncidentIcon(type: Incident["type"], selected: boolean) {
  const colors = {
    hostage: { bg: "#ef4444", ring: "#dc2626", pulse: "rgba(239,68,68,0.6)" },
    active: { bg: "#f59e0b", ring: "#d97706", pulse: "rgba(245,158,11,0.6)" },
    suspect_pin: { bg: "#3b82f6", ring: "#2563eb", pulse: "rgba(59,130,246,0.5)" },
    accident: { bg: "#8b5cf6", ring: "#7c3aed", pulse: "rgba(139,92,246,0.5)" },
  };
  const c = colors[type];
  const size = selected ? 40 : 32;

  return L.divIcon({
    className: "bg-transparent border-0",
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;">
        <div style="position:absolute;inset:0;border-radius:50%;background:${c.pulse};animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
        <div style="position:relative;width:${selected ? 20 : 14}px;height:${selected ? 20 : 14}px;background:${c.bg};border-radius:50%;border:2px solid ${c.ring};box-shadow:0 0 ${selected ? 20 : 10}px ${c.pulse}"></div>
      </div>
      <style>@keyframes ping{0%,100%{transform:scale(1);opacity:0.8}50%{transform:scale(1.8);opacity:0}}</style>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createViaturaIcon() {
  return L.divIcon({
    className: "bg-transparent border-0",
    html: `
      <div style="background:rgba(16,185,129,0.9);width:28px;height:28px;border-radius:6px;border:1px solid rgba(52,211,153,0.5);display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(52,211,153,0.4)">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

const VIATURAS = [
  { id: "DELTA-4", lat: -23.548, lng: -46.636 },
  { id: "ALPHA-2", lat: -23.557, lng: -46.641 },
  { id: "BRAVO-7", lat: -23.543, lng: -46.628 },
];

const CIRCLE_RADII: Record<Incident["type"], number> = {
  hostage: 350,
  active: 250,
  suspect_pin: 150,
  accident: 200,
};

const CIRCLE_COLORS: Record<Incident["type"], string> = {
  hostage: "#ef4444",
  active: "#f59e0b",
  suspect_pin: "#3b82f6",
  accident: "#8b5cf6",
};

type Props = {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function RadarMap({ incidents, selectedId, onSelect }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return (
    <div className="h-full w-full flex items-center justify-center bg-[#060810]">
      <p className="text-blue-400 font-mono text-sm animate-pulse">Carregando Radar...</p>
    </div>
  );

  const center = incidents.find(i => i.id === selectedId) ?? incidents[0];

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[center?.lat ?? -23.55, center?.lng ?? -46.63]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />
        <ZoomControl position="bottomright" />

        {/* Viaturas */}
        {VIATURAS.map(v => (
          <Marker key={v.id} position={[v.lat, v.lng]} icon={createViaturaIcon()}>
            <Popup>
              <div style={{ padding: "8px 12px" }}>
                <p style={{ color: "#4ade80", fontFamily: "monospace", fontSize: "12px", fontWeight: "bold", margin: 0 }}>
                  {v.id}
                </p>
                <p style={{ color: "#9ca3af", fontSize: "11px", margin: "2px 0 0" }}>Viatura AVL Ativa</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Incidents */}
        {incidents.map(inc => {
          const isSelected = inc.id === selectedId;
          return (
            <div key={inc.id}>
              <Circle
                center={[inc.lat, inc.lng]}
                radius={CIRCLE_RADII[inc.type]}
                pathOptions={{
                  color: CIRCLE_COLORS[inc.type],
                  fillColor: CIRCLE_COLORS[inc.type],
                  fillOpacity: isSelected ? 0.12 : 0.07,
                  weight: isSelected ? 1.5 : 0.8,
                  dashArray: isSelected ? undefined : "4 4",
                }}
              />
              <Marker
                position={[inc.lat, inc.lng]}
                icon={createIncidentIcon(inc.type, isSelected)}
                eventHandlers={{ click: () => onSelect(inc.id) }}
              >
                <Popup>
                  <div style={{ padding: "10px 14px", minWidth: "180px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <span style={{ color: "#fff", fontWeight: "bold", fontSize: "13px" }}>{inc.victim}</span>
                      <span style={{
                        fontSize: "9px", fontFamily: "monospace", padding: "2px 6px", borderRadius: "4px",
                        background: inc.type === "hostage" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)",
                        color: inc.type === "hostage" ? "#f87171" : "#fbbf24",
                        border: `1px solid ${inc.type === "hostage" ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}`,
                      }}>
                        {inc.type === "hostage" ? "REFÉM" : "ATIVO"}
                      </span>
                    </div>
                    <p style={{ color: "#6b7280", fontSize: "11px", marginBottom: "4px" }}>{inc.address}</p>
                    <p style={{ color: "#4b5563", fontSize: "10px", fontFamily: "monospace" }}>{inc.id}</p>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}
      </MapContainer>

      {/* Radar Overlay UI */}
      <div className="absolute top-3 left-3 z-[1000] pointer-events-none">
        <div className="glass rounded-lg px-3 py-2 text-[10px] font-mono text-green-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          RADAR ATIVO · {incidents.length} SINAIS
        </div>
      </div>

      {/* Compass */}
      <div className="absolute bottom-14 left-3 z-[1000] pointer-events-none">
        <div className="w-10 h-10 glass rounded-full flex items-center justify-center">
          <span className="text-xs font-mono text-gray-500">N↑</span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] glass rounded-lg px-3 py-2">
        <div className="space-y-1">
          {[
            { color: "bg-red-500", label: "Refém" },
            { color: "bg-yellow-500", label: "Alerta" },
            { color: "bg-blue-500", label: "Suspeito" },
            { color: "bg-green-500", label: "Viatura" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-[10px] font-mono text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
