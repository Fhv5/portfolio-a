"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "next-themes";

/* ─── Presets from thesis ─── */
const PRESETS = {
  triangle: {
    name: "Triángulo",
    disks: [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: Math.sqrt(3) },
    ],
    edges: [[0, 1], [1, 2], [2, 0]],
    hull: [0, 1, 2],
    eigenvalues: "0, 0, 0",
    conclusion: "Punto crítico: mínimo local (estable).",
    detail:
      "Los 3 autovalores nulos corresponden a las simetrías de traslación (2) y rotación (1). No hay direcciones planas adicionales.",
  },
  square: {
    name: "Cuadrado",
    disks: [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0]],
    hull: [0, 1, 2, 3],
    eigenvalues: "0, 0, 0, 0",
    conclusion: "Punto crítico con dirección plana adicional.",
    detail:
      "4 autovalores nulos: 3 corresponden a simetrías (traslación + rotación) y 1 dirección plana adicional que corresponde a la familia de rombos con el mismo perímetro.",
  },
  rhombus: {
    name: "Rombo",
    disks: [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: Math.sqrt(3) },
      { x: 1, y: Math.sqrt(3) },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 3]],
    hull: [0, 1, 2, 3],
    eigenvalues: "0, 0, 0",
    conclusion: "Punto crítico: mínimo local (estable).",
    detail:
      "3 autovalores nulos que corresponden exactamente a las simetrías de traslación y rotación del sistema. No hay direcciones planas.",
  },
};

/* ─── Math utilities ─── */
function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function convexHull(points) {
  if (points.length < 3) return points.map((_, i) => i);
  const pts = points.map((p, i) => ({ ...p, idx: i }));
  pts.sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (O, A, B) =>
    (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
      lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (const p of pts.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0)
      upper.pop();
    upper.push(p);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper).map((p) => p.idx);
}

function perimeter(disks, hullIndices, r) {
  if (hullIndices.length < 2) return 2 * Math.PI * r;
  let perim = 0;
  for (let i = 0; i < hullIndices.length; i++) {
    const a = disks[hullIndices[i]];
    const b = disks[hullIndices[(i + 1) % hullIndices.length]];
    perim += dist(a, b);
  }
  perim += 2 * Math.PI * r;
  return perim;
}

// Get the unit-space perimeter (undo the RADIUS scaling)
function unitPerimeter(disks, hullIndices, r, scale) {
  if (hullIndices.length < 2) return 2 * Math.PI;
  let perim = 0;
  for (let i = 0; i < hullIndices.length; i++) {
    const a = disks[hullIndices[i]];
    const b = disks[hullIndices[(i + 1) % hullIndices.length]];
    perim += dist(a, b) / scale;
  }
  perim += 2 * Math.PI; // r = 1 in unit space
  return perim;
}

export function DiskPackingInteractive() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [preset, setPreset] = useState("triangle");
  const disksRef = useRef([]);
  const dragRef = useRef({ idx: -1, offX: 0, offY: 0 });
  const [info, setInfo] = useState({ perim: 0, hull: [] });
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  const presetRef = useRef(preset);
  const RADIUS = 50;
  const radiusRef = useRef(RADIUS);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  const loadPreset = useCallback(
    (key) => {
      const p = PRESETS[key];
      const r = radiusRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const cw = rect.width;
      const ch = rect.height;

      // Compute bounding box of preset
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const d of p.disks) {
        minX = Math.min(minX, d.x);
        maxX = Math.max(maxX, d.x);
        minY = Math.min(minY, d.y);
        maxY = Math.max(maxY, d.y);
      }
      const presetW = maxX - minX;
      const presetH = maxY - minY;
      const scale = r;
      const offsetX = (cw - presetW * scale) / 2 - minX * scale;
      const offsetY = (ch - presetH * scale) / 2 - minY * scale;

      disksRef.current = p.disks.map((d) => ({
        x: d.x * scale + offsetX,
        y: d.y * scale + offsetY,
      }));

      const hull = convexHull(disksRef.current);
      const perim = unitPerimeter(disksRef.current, hull, r, r);
      setInfo({ perim, hull });
    },
    []
  );

  const switchPreset = useCallback(
    (key) => {
      setPreset(key);
      presetRef.current = key;
      loadPreset(key);
    },
    [loadPreset]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      loadPreset(presetRef.current);
    };

    resize();
    window.addEventListener("resize", resize);

    /* ─── Drag events ─── */
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const onDown = (e) => {
      e.preventDefault();
      const pos = getPos(e);
      const r = radiusRef.current;
      for (let i = disksRef.current.length - 1; i >= 0; i--) {
        const d = disksRef.current[i];
        if (dist(pos, d) < r) {
          dragRef.current = { idx: i, offX: d.x - pos.x, offY: d.y - pos.y };
          canvas.style.cursor = "grabbing";
          return;
        }
      }
    };

    const onMove = (e) => {
      e.preventDefault();
      const pos = getPos(e);
      const r = radiusRef.current;

      if (dragRef.current.idx >= 0) {
        const idx = dragRef.current.idx;
        let nx = pos.x + dragRef.current.offX;
        let ny = pos.y + dragRef.current.offY;

        // Iterative overlap resolution (multiple passes for dense areas)
        for (let pass = 0; pass < 5; pass++) {
          let resolved = true;
          for (let i = 0; i < disksRef.current.length; i++) {
            if (i === idx) continue;
            const o = disksRef.current[i];
            const d = dist({ x: nx, y: ny }, o);
            if (d < r * 2 && d > 0.01) {
              const angle = Math.atan2(ny - o.y, nx - o.x);
              nx = o.x + Math.cos(angle) * r * 2;
              ny = o.y + Math.sin(angle) * r * 2;
              resolved = false;
            }
          }
          if (resolved) break;
        }

        disksRef.current[idx] = { x: nx, y: ny };
        const hull = convexHull(disksRef.current);
        const perim = unitPerimeter(disksRef.current, hull, r, r);
        setInfo({ perim, hull });
      } else {
        // Hover cursor
        let hovering = false;
        for (const d of disksRef.current) {
          if (dist(pos, d) < r) {
            hovering = true;
            break;
          }
        }
        canvas.style.cursor = hovering ? "grab" : "default";
      }
    };

    const onUp = () => {
      dragRef.current = { idx: -1, offX: 0, offY: 0 };
      canvas.style.cursor = "default";
    };

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("mouseleave", onUp);
    canvas.addEventListener("touchstart", onDown, { passive: false });
    canvas.addEventListener("touchmove", onMove, { passive: false });
    canvas.addEventListener("touchend", onUp);

    /* ─── Draw loop ─── */
    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      const isDark = themeRef.current === "dark";
      const accent = isDark ? "56, 189, 248" : "2, 132, 199";
      const accentAlt = isDark ? "125, 211, 252" : "14, 165, 233";
      const disks = disksRef.current;
      const r = radiusRef.current;
      const currentPreset = PRESETS[presetRef.current];

      if (!disks.length) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      // Draw convex hull (Minkowski sum: tangent lines + arcs)
      const hull = convexHull(disks);
      if (hull.length >= 3) {
        ctx.beginPath();
        for (let i = 0; i < hull.length; i++) {
          const curr = disks[hull[i]];
          const next = disks[hull[(i + 1) % hull.length]];
          const nextNext = disks[hull[(i + 2) % hull.length]];

          // Edge from curr to next: outward normal (pointing away from hull interior)
          const edx = next.x - curr.x;
          const edy = next.y - curr.y;
          const eLen = Math.sqrt(edx * edx + edy * edy);
          if (eLen === 0) continue;
          // Outward normal: rotate edge direction 90° clockwise
          const onx = edy / eLen;
          const ony = -edx / eLen;

          // Tangent line endpoints
          const x1 = curr.x + onx * r;
          const y1 = curr.y + ony * r;
          const x2 = next.x + onx * r;
          const y2 = next.y + ony * r;

          if (i === 0) {
            ctx.moveTo(x1, y1);
          }
          ctx.lineTo(x2, y2);

          // Arc around 'next' disk connecting this edge to the next edge
          const edx2 = nextNext.x - next.x;
          const edy2 = nextNext.y - next.y;
          const eLen2 = Math.sqrt(edx2 * edx2 + edy2 * edy2);
          if (eLen2 > 0) {
            const onx2 = edy2 / eLen2;
            const ony2 = -edx2 / eLen2;
            const startAngle = Math.atan2(ony, onx);
            const endAngle = Math.atan2(ony2, onx2);
            ctx.arc(next.x, next.y, r, startAngle, endAngle, false);
          }
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(${accent}, 0.04)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(0, 210, 211, ${isDark ? 0.5 : 0.4})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw contact edges
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 1.5;
      for (const [i, j] of currentPreset.edges) {
        if (i >= disks.length || j >= disks.length) continue;
        const a = disks[i];
        const b = disks[j];
        const d = dist(a, b);
        // Show edges that are near-contact (within 15% tolerance)
        const isContact = Math.abs(d - r * 2) < r * 0.3;
        ctx.strokeStyle = isContact
          ? `rgba(255, 165, 0, ${isDark ? 0.6 : 0.5})`
          : `rgba(255, 165, 0, ${isDark ? 0.2 : 0.15})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Draw disks
      for (let i = 0; i < disks.length; i++) {
        const d = disks[i];

        // Glow
        const grd = ctx.createRadialGradient(d.x, d.y, r * 0.3, d.x, d.y, r * 1.8);
        grd.addColorStop(0, `rgba(${accent}, 0.08)`);
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(d.x, d.y, r * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Disk body
        ctx.fillStyle = `rgba(${accent}, 0.06)`;
        ctx.strokeStyle = `rgba(${accent}, 0.35)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Center dot
        ctx.fillStyle = `rgba(${accent}, 0.6)`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = isDark
          ? "rgba(228, 228, 231, 0.7)"
          : "rgba(24, 24, 27, 0.6)";
        ctx.font = "12px var(--font-inter), sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`c${i + 1}`, d.x, d.y - r - 12);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("mouseleave", onUp);
      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("touchend", onUp);
    };
  }, [loadPreset]);

  const currentPreset = PRESETS[preset];

  return (
    <div className="space-y-6">
      {/* Preset selector */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(PRESETS).map(([key, p]) => (
          <button
            key={key}
            onClick={() => switchPreset(key)}
            className={`px-4 py-2 rounded-lg font-mono text-sm border transition-all ${
              preset === key
                ? "bg-accent/15 text-accent border-accent/40 shadow-sm shadow-accent/10"
                : "bg-bg-surface text-text-muted border-border hover:border-accent/30 hover:text-text-primary"
            }`}
          >
            {p.name} ({p.disks.length})
          </button>
        ))}
        <button
          onClick={() => loadPreset(preset)}
          className="px-4 py-2 rounded-lg font-mono text-sm border border-border text-text-muted hover:border-accent/30 hover:text-accent transition-all ml-auto"
        >
          ↺ Reset
        </button>
      </div>

      {/* Canvas + Info panel */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Canvas */}
        <div className="relative aspect-square lg:aspect-auto lg:min-h-[480px] bg-bg-primary border border-border rounded-xl overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0" />
          <div className="absolute bottom-3 left-3 text-[10px] font-mono text-text-muted/50">
            Arrastra los discos para explorar
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-bg-surface border border-border rounded-xl p-5 space-y-5 h-fit">
          <div>
            <h3 className="text-lg font-bold text-text-primary font-mono mb-1">
              {currentPreset.name}
            </h3>
            <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
              {currentPreset.disks.length} discos · {currentPreset.edges.length} contactos
            </span>
          </div>

          <div className="space-y-3">
            <div className="bg-bg-primary rounded-lg p-3 border border-border/50">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                Perímetro actual
              </span>
              <div className="text-2xl font-bold font-mono text-accent mt-1">
                {info.perim.toFixed(3)}
              </div>
              <span className="text-[10px] font-mono text-text-muted">
                = {(info.perim - 2 * Math.PI).toFixed(3)} + 2π
              </span>
            </div>

            <div className="bg-bg-primary rounded-lg p-3 border border-border/50">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                Autovalores H<sub>intr</sub>
              </span>
              <div className="text-base font-mono text-text-primary mt-1 font-medium">
                {currentPreset.eigenvalues}
              </div>
            </div>

            <div className="bg-bg-primary rounded-lg p-3 border border-border/50">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                Conclusión
              </span>
              <div className="text-sm text-text-primary mt-1 font-medium">
                {currentPreset.conclusion}
              </div>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">
                {currentPreset.detail}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-border/50">
            <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">
              Leyenda
            </div>
            <div className="space-y-1.5 text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-orange-400 inline-block" style={{ borderTop: "2px dashed" }}></span>
                Arista de contacto
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 inline-block" style={{ background: "rgb(0, 210, 211)" }}></span>
                Envolvente convexa
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border border-accent-alt/40 bg-accent-alt/10 inline-block"></span>
                Disco congruente (r=1)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
