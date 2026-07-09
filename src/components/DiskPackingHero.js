"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const NUM_DISKS = 18;
const BASE_SPEED = 0.22;
const WALL_RESTITUTION = 0.95;
const BOND_HOLD_TIME = 2000;      // ms before auto-unbond timer starts
const BOND_RAND_MIN = 2000;       // min additional ms before auto-unbond
const BOND_RAND_MAX = 4000;       // max additional ms before auto-unbond
const OMEGA_DAMPING = 0.998;      // angular velocity damping per frame
const MAX_OMEGA = 0.008;          // max angular velocity (rad/frame)

export function DiskPackingHero() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const disksRef = useRef([]);
  const bondsRef = useRef(new Map());  // key "i-j" → { createdAt, unbondAt }
  const dragRef = useRef({ idx: -1, startX: 0, startY: 0, moved: false });
  const dragTargetRef = useRef({ x: 0, y: 0 });
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => { themeRef.current = theme; }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const bk = (i, j) => `${Math.min(i, j)}-${Math.max(i, j)}`;

    const getBonds = (i) => {
      const result = [];
      for (const [key] of bondsRef.current) {
        const [a, c] = key.split("-").map(Number);
        if (a === i) result.push(c);
        else if (c === i) result.push(a);
      }
      return result;
    };

    const hasBond = (i) => getBonds(i).length > 0;

    // Get all disks in the same connected cluster
    const getCluster = (i) => {
      const visited = new Set();
      const queue = [i];
      while (queue.length) {
        const cur = queue.pop();
        if (visited.has(cur)) continue;
        visited.add(cur);
        for (const neighbor of getBonds(cur)) {
          if (!visited.has(neighbor)) queue.push(neighbor);
        }
      }
      return Array.from(visited);
    };

    const initDisks = (w, h) => {
      let r = Math.min(w, h) * 0.065;
      r = Math.max(30, Math.min(r, 65));
      const disks = [];
      bondsRef.current = new Map();

      for (let i = 0; i < NUM_DISKS; i++) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 300) {
          const x = r * 2 + Math.random() * (w - r * 4);
          const y = r * 2 + Math.random() * (h - r * 4);
          let tooClose = false;
          for (const d of disks) {
            if (Math.hypot(d.x - x, d.y - y) < r * 2.5) { tooClose = true; break; }
          }
          if (!tooClose) {
            const angle = Math.random() * Math.PI * 2;
            const speed = BASE_SPEED + Math.random() * 0.1;
            disks.push({ x, y, r, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed });
            placed = true;
          }
          attempts++;
        }
        if (!placed) {
          const angle = Math.random() * Math.PI * 2;
          disks.push({
            x: r * 2 + Math.random() * (w - r * 4),
            y: r * 2 + Math.random() * (h - r * 4),
            r, vx: Math.cos(angle) * BASE_SPEED, vy: Math.sin(angle) * BASE_SPEED,
          });
        }
      }
      return disks;
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      disksRef.current = initDisks(rect.width, rect.height);
    };

    resize();
    window.addEventListener("resize", resize);

    // ─── Interaction ───
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: cx - rect.left, y: cy - rect.top };
    };

    const diskAt = (pos) => {
      const disks = disksRef.current;
      for (let i = disks.length - 1; i >= 0; i--) {
        if (Math.hypot(disks[i].x - pos.x, disks[i].y - pos.y) < disks[i].r) return i;
      }
      return -1;
    };

    const onDown = (e) => {
      if (e.button && e.button !== 0) return; // only left-click or touch
      const pos = getPos(e);
      const idx = diskAt(pos);
      if (idx >= 0) {
        e.preventDefault();
        e.stopPropagation();
        dragRef.current = { idx, startX: pos.x, startY: pos.y, moved: false };
        canvas.style.cursor = "grabbing";
      }
    };

    const onMove = (e) => {
      const pos = getPos(e);
      const drag = dragRef.current;
      if (drag.idx >= 0) {
        e.preventDefault();
        const dx = pos.x - drag.startX;
        const dy = pos.y - drag.startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.moved = true;

        if (drag.moved) {
          const dpr = window.devicePixelRatio || 1;
          const w = canvas.width / dpr;
          const h = canvas.height / dpr;
          const r = disksRef.current[drag.idx].r;
          // Just store the target — the draw loop will lerp toward it
          dragTargetRef.current = {
            x: Math.max(r, Math.min(pos.x, w - r)),
            y: Math.max(r, Math.min(pos.y, h - r)),
          };
        }
      } else {
        canvas.style.cursor = diskAt(pos) >= 0 ? "grab" : "default";
      }
    };

    const onUp = (e) => {
      const drag = dragRef.current;
      if (drag.idx < 0) return;

      const disks = disksRef.current;
      const d = disks[drag.idx];
      const r = d.r;
      const now = performance.now();

      if (drag.moved) {
        // Drag release → check for snapping
        let bonded = false;
        for (let i = 0; i < disks.length; i++) {
          if (i === drag.idx) continue;
          const dist = Math.hypot(d.x - disks[i].x, d.y - disks[i].y);
          if (dist < r * 2 + 1) {
            const angle = Math.atan2(d.y - disks[i].y, d.x - disks[i].x);
            d.x = disks[i].x + Math.cos(angle) * r * 2;
            d.y = disks[i].y + Math.sin(angle) * r * 2;

            const key = bk(drag.idx, i);
            if (!bondsRef.current.has(key)) {
              bondsRef.current.set(key, {
                createdAt: now,
                unbondAt: now + BOND_HOLD_TIME + BOND_RAND_MIN + Math.random() * (BOND_RAND_MAX - BOND_RAND_MIN),
                omega: (Math.random() - 0.5) * MAX_OMEGA * 0.6,
                pivot: i, // the disk being snapped to is the pivot
              });
            }

            // Merge velocities for the cluster
            const cluster = getCluster(drag.idx);
            let avgVx = 0, avgVy = 0;
            for (const ci of cluster) { avgVx += disks[ci].vx; avgVy += disks[ci].vy; }
            avgVx /= cluster.length; avgVy /= cluster.length;
            // If cluster was stationary, give random velocity
            if (Math.hypot(avgVx, avgVy) < 0.05) {
              const a2 = Math.random() * Math.PI * 2;
              avgVx = Math.cos(a2) * BASE_SPEED * 0.8;
              avgVy = Math.sin(a2) * BASE_SPEED * 0.8;
            }
            for (const ci of cluster) { disks[ci].vx = avgVx; disks[ci].vy = avgVy; }
            bonded = true;
          }
        }
        if (!bonded) {
          const pos = getPos(e);
          const ddx = pos.x - drag.startX;
          const ddy = pos.y - drag.startY;
          const dist = Math.hypot(ddx, ddy);
          if (dist > 1) { d.vx = (ddx / dist) * BASE_SPEED; d.vy = (ddy / dist) * BASE_SPEED; }
        }
      }
      dragRef.current = { idx: -1, startX: 0, startY: 0, moved: false };
      canvas.style.cursor = "default";
    };

    // Right-click: unbond a bonded disk (suppress menu on any disk)
    const onContext = (e) => {
      const pos = getPos(e);
      const idx = diskAt(pos);
      if (idx >= 0) {
        e.preventDefault();
        if (hasBond(idx)) {
          const disks = disksRef.current;
          const d = disks[idx];
          const toRemove = [];
          for (const [key] of bondsRef.current) {
            const [a, c] = key.split("-").map(Number);
            if (a === idx || c === idx) toRemove.push(key);
          }
          for (const k of toRemove) bondsRef.current.delete(k);
          const angle = Math.random() * Math.PI * 2;
          d.vx = Math.cos(angle) * BASE_SPEED * 1.5;
          d.vy = Math.sin(angle) * BASE_SPEED * 1.5;
        }
      }
    };

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("mouseleave", onUp);
    canvas.addEventListener("contextmenu", onContext);
    canvas.addEventListener("touchstart", onDown, { passive: false });
    canvas.addEventListener("touchmove", onMove, { passive: false });
    canvas.addEventListener("touchend", onUp);

    // ─── Draw loop ───
    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const isDark = themeRef.current === "dark";
      const disks = disksRef.current;
      const bonds = bondsRef.current;
      const now = performance.now();

      if (!disks.length) { animationRef.current = requestAnimationFrame(draw); return; }

      const r = disks[0].r;
      const dragIdx = dragRef.current.idx;
      const dragMoved = dragRef.current.moved;

      // ─── Smooth drag: lerp dragged disk toward target ───
      if (dragIdx >= 0 && dragMoved) {
        const d = disks[dragIdx];
        const target = dragTargetRef.current;
        const LERP = 0.1; // lower = smoother/slower trailing

        let tx = d.x + (target.x - d.x) * LERP;
        let ty = d.y + (target.y - d.y) * LERP;

        // Iterative overlap resolution (multiple passes for dense areas)
        for (let pass = 0; pass < 5; pass++) {
          let resolved = true;
          for (let i = 0; i < disks.length; i++) {
            if (i === dragIdx) continue;
            const dist = Math.hypot(tx - disks[i].x, ty - disks[i].y);
            if (dist < r * 2 && dist > 0.01) {
              const angle = Math.atan2(ty - disks[i].y, tx - disks[i].x);
              tx = disks[i].x + Math.cos(angle) * r * 2;
              ty = disks[i].y + Math.sin(angle) * r * 2;
              resolved = false;
            }
          }
          if (resolved) break;
        }

        d.x = tx;
        d.y = ty;
        d.vx = 0;
        d.vy = 0;
      }

      // ─── Auto-unbond expired bonds ───
      const toRemove = [];
      for (const [key, meta] of bonds) {
        if (now >= meta.unbondAt) toRemove.push(key);
      }
      for (const key of toRemove) {
        bonds.delete(key);
        const [a, c] = key.split("-").map(Number);
        // Give freed disks a slight divergent push
        if (!hasBond(a)) {
          const angle = Math.atan2(disks[a].y - disks[c].y, disks[a].x - disks[c].x);
          disks[a].vx = Math.cos(angle) * BASE_SPEED;
          disks[a].vy = Math.sin(angle) * BASE_SPEED;
        }
        if (!hasBond(c)) {
          const angle = Math.atan2(disks[c].y - disks[a].y, disks[c].x - disks[a].x);
          disks[c].vx = Math.cos(angle) * BASE_SPEED;
          disks[c].vy = Math.sin(angle) * BASE_SPEED;
        }
      }

      // ─── Physics ───
      // Identify clusters (connected components via bonds)
      const visited = new Set();
      const clusters = [];
      for (let i = 0; i < disks.length; i++) {
        if (visited.has(i) || i === dragIdx) continue;
        if (hasBond(i)) {
          const cluster = getCluster(i);
          cluster.forEach(c => visited.add(c));
          clusters.push(cluster);
        }
      }

      // Move clusters as rigid bodies with rotation
      for (const cluster of clusters) {
        if (cluster.some(c => c === dragIdx)) continue;

        // Compute center of mass
        let comX = 0, comY = 0;
        for (const ci of cluster) { comX += disks[ci].x; comY += disks[ci].y; }
        comX /= cluster.length; comY /= cluster.length;

        // Get cluster omega (average from all bonds in this cluster)
        let omega = 0;
        let bondCount = 0;
        for (const [key, meta] of bonds) {
          const [a, c] = key.split("-").map(Number);
          if (cluster.includes(a) || cluster.includes(c)) {
            omega += meta.omega || 0;
            bondCount++;
          }
        }
        if (bondCount > 0) omega /= bondCount;

        // Share velocity (average)
        let avgVx = 0, avgVy = 0;
        for (const ci of cluster) { avgVx += disks[ci].vx; avgVy += disks[ci].vy; }
        avgVx /= cluster.length; avgVy /= cluster.length;

        // Apply central repulsion to cluster center of mass
        const cx = w / 2;
        const cy = h / 2;
        const repellerR = Math.min(380, Math.min(w, h) * 0.45);
        const dx = comX - cx;
        const dy = comY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < repellerR && dist > 0.01) {
          const force = (1 - dist / repellerR) * 0.08;
          avgVx += (dx / dist) * force;
          avgVy += (dy / dist) * force;
        }

        // Translate
        for (const ci of cluster) {
          disks[ci].vx = avgVx;
          disks[ci].vy = avgVy;
          disks[ci].x += avgVx;
          disks[ci].y += avgVy;
        }

        // Rotate: for 2-disk clusters, orbit around pivot; for 3+, around COM
        if (cluster.length >= 2 && Math.abs(omega) > 0.0001) {
          const cosO = Math.cos(omega);
          const sinO = Math.sin(omega);

          if (cluster.length === 2) {
            // Find the pivot disk from the bond between the two
            let pivotIdx = cluster[0]; // default
            for (const [key, meta] of bonds) {
              const [a, c] = key.split("-").map(Number);
              if (cluster.includes(a) && cluster.includes(c) && meta.pivot !== undefined) {
                pivotIdx = meta.pivot;
                break;
              }
            }
            const orbiterIdx = cluster[0] === pivotIdx ? cluster[1] : cluster[0];
            const pivot = disks[pivotIdx];
            const orbiter = disks[orbiterIdx];
            const dx = orbiter.x - pivot.x;
            const dy = orbiter.y - pivot.y;
            orbiter.x = pivot.x + dx * cosO - dy * sinO;
            orbiter.y = pivot.y + dx * sinO + dy * cosO;
          } else {
            // 3+ disks: rotate around COM
            let cx2 = 0, cy2 = 0;
            for (const ci of cluster) { cx2 += disks[ci].x; cy2 += disks[ci].y; }
            cx2 /= cluster.length; cy2 /= cluster.length;

            for (const ci of cluster) {
              const dx = disks[ci].x - cx2;
              const dy = disks[ci].y - cy2;
              disks[ci].x = cx2 + dx * cosO - dy * sinO;
              disks[ci].y = cy2 + dx * sinO + dy * cosO;
            }
          }

          // Damp omega
          omega *= OMEGA_DAMPING;
          for (const [key, meta] of bonds) {
            const [a, c] = key.split("-").map(Number);
            if (cluster.includes(a) || cluster.includes(c)) {
              meta.omega = omega;
            }
          }
        }

        // Wall bounce for cluster: check any member hitting a wall
        let bounceX = false, bounceY = false;
        for (const ci of cluster) {
          const d = disks[ci];
          if (d.x - r < 0 || d.x + r > w) bounceX = true;
          if (d.y - r < 0 || d.y + r > h) bounceY = true;
        }
        if (bounceX) {
          for (const ci of cluster) {
            disks[ci].vx = -disks[ci].vx * WALL_RESTITUTION;
            if (disks[ci].x - r < 0) disks[ci].x = r;
            if (disks[ci].x + r > w) disks[ci].x = w - r;
          }
          // Reverse and damp angular velocity on wall hit
          for (const [key, meta] of bonds) {
            const [a, c] = key.split("-").map(Number);
            if (cluster.includes(a) || cluster.includes(c)) {
              meta.omega = -(meta.omega || 0) * 0.5;
            }
          }
        }
        if (bounceY) {
          for (const ci of cluster) {
            disks[ci].vy = -disks[ci].vy * WALL_RESTITUTION;
            if (disks[ci].y - r < 0) disks[ci].y = r;
            if (disks[ci].y + r > h) disks[ci].y = h - r;
          }
          for (const [key, meta] of bonds) {
            const [a, c] = key.split("-").map(Number);
            if (cluster.includes(a) || cluster.includes(c)) {
              meta.omega = -(meta.omega || 0) * 0.5;
            }
          }
        }

        // Maintain cluster speed
        const speed = Math.hypot(avgVx, avgVy);
        if (speed > 0.01 && speed < 5) {
          const factor = 1 + (BASE_SPEED * 0.8 - speed) / speed * 0.003;
          for (const ci of cluster) { disks[ci].vx *= factor; disks[ci].vy *= factor; }
        }
      }

      // Move free (unbonded) disks
      for (let i = 0; i < disks.length; i++) {
        if (i === dragIdx || visited.has(i)) continue;
        const d = disks[i];

        // Apply central repulsion to free disk
        const cx = w / 2;
        const cy = h / 2;
        const repellerR = Math.min(380, Math.min(w, h) * 0.45);
        const dx = d.x - cx;
        const dy = d.y - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < repellerR && dist > 0.01) {
          const force = (1 - dist / repellerR) * 0.08;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
        }

        d.x += d.vx;
        d.y += d.vy;

        if (d.x - r < 0) { d.x = r; d.vx = Math.abs(d.vx) * WALL_RESTITUTION; }
        if (d.x + r > w) { d.x = w - r; d.vx = -Math.abs(d.vx) * WALL_RESTITUTION; }
        if (d.y - r < 0) { d.y = r; d.vy = Math.abs(d.vy) * WALL_RESTITUTION; }
        if (d.y + r > h) { d.y = h - r; d.vy = -Math.abs(d.vy) * WALL_RESTITUTION; }

        // Maintain speed
        const speed = Math.hypot(d.vx, d.vy);
        if (speed > 0.01 && speed < 5) {
          const factor = 1 + (BASE_SPEED - speed) / speed * 0.003;
          d.vx *= factor;
          d.vy *= factor;
        }
      }

      // ─── Collisions ───
      for (let i = 0; i < disks.length; i++) {
        if (i === dragIdx) continue;
        for (let j = i + 1; j < disks.length; j++) {
          if (j === dragIdx) continue;
          if (bonds.has(bk(i, j))) continue;

          const a = disks[i];
          const b = disks[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const minDist = a.r + b.r;

          if (dist < minDist && dist > 0.01) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = (minDist - dist) * 0.5;

            const aInCluster = visited.has(i);
            const bInCluster = visited.has(j);

            const rvx = b.vx - a.vx;
            const rvy = b.vy - a.vy;
            const velAlongNormal = rvx * nx + rvy * ny;

            // Only respond if moving towards each other
            if (velAlongNormal < 0) {
              const snapThreshold = 0.25;

              if (!aInCluster && !bInCluster) {
                if (Math.abs(velAlongNormal) < snapThreshold) {
                  // Two free disks collide slowly → bond them!
                  a.x -= nx * overlap;
                  a.y -= ny * overlap;
                  b.x += nx * overlap;
                  b.y += ny * overlap;

                  // Compute tangential velocity → angular velocity
                  const tx = -ny;
                  const ty = nx;
                  const relVt = (a.vx - b.vx) * tx + (a.vy - b.vy) * ty;
                  let omega = relVt / (r * 2);
                  omega = Math.max(-MAX_OMEGA, Math.min(MAX_OMEGA, omega));
                  if (Math.abs(omega) < 0.001) omega = (Math.random() - 0.5) * MAX_OMEGA * 0.5;

                  const key = bk(i, j);
                  const speedA = Math.hypot(a.vx, a.vy);
                  const speedB = Math.hypot(b.vx, b.vy);
                  bonds.set(key, {
                    createdAt: now,
                    unbondAt: now + BOND_HOLD_TIME + BOND_RAND_MIN + Math.random() * (BOND_RAND_MAX - BOND_RAND_MIN),
                    omega,
                    pivot: speedA <= speedB ? i : j,
                  });

                  const avgVx = (a.vx + b.vx) / 2;
                  const avgVy = (a.vy + b.vy) / 2;
                  a.vx = avgVx; a.vy = avgVy;
                  b.vx = avgVx; b.vy = avgVy;
                } else {
                  // Bounce elastically!
                  const restitution = 0.8;
                  const impulseScalar = -(1 + restitution) * velAlongNormal;
                  const impulseX = impulseScalar * nx * 0.5;
                  const impulseY = impulseScalar * ny * 0.5;

                  a.vx -= impulseX;
                  a.vy -= impulseY;
                  b.vx += impulseX;
                  b.vy += impulseY;

                  a.x -= nx * overlap;
                  a.y -= ny * overlap;
                  b.x += nx * overlap;
                  b.y += ny * overlap;
                }

              } else if (aInCluster && !bInCluster) {
                if (Math.abs(velAlongNormal) < snapThreshold) {
                  // Free disk hits cluster slowly → bond it to cluster
                  b.x += nx * overlap * 2;
                  b.y += ny * overlap * 2;

                  const tx = -ny;
                  const ty = nx;
                  const relVt = (b.vx - a.vx) * tx + (b.vy - a.vy) * ty;
                  let omega = relVt / (r * 2);
                  omega = Math.max(-MAX_OMEGA, Math.min(MAX_OMEGA, omega));
                  if (Math.abs(omega) < 0.001) omega = (Math.random() - 0.5) * MAX_OMEGA * 0.3;

                  const key = bk(i, j);
                  bonds.set(key, {
                    createdAt: now,
                    unbondAt: now + BOND_HOLD_TIME + BOND_RAND_MIN + Math.random() * (BOND_RAND_MAX - BOND_RAND_MIN),
                    omega,
                    pivot: i,
                  });
                  b.vx = a.vx; b.vy = a.vy;
                } else {
                  // Bounce free disk off cluster (cluster acts as heavier body)
                  b.vx += -velAlongNormal * nx * 1.5;
                  b.vy += -velAlongNormal * ny * 1.5;
                  b.x += nx * overlap * 2;
                  b.y += ny * overlap * 2;
                }

              } else if (!aInCluster && bInCluster) {
                if (Math.abs(velAlongNormal) < snapThreshold) {
                  a.x -= nx * overlap * 2;
                  a.y -= ny * overlap * 2;

                  const tx = -ny;
                  const ty = nx;
                  const relVt = (a.vx - b.vx) * tx + (a.vy - b.vy) * ty;
                  let omega = relVt / (r * 2);
                  omega = Math.max(-MAX_OMEGA, Math.min(MAX_OMEGA, omega));
                  if (Math.abs(omega) < 0.001) omega = (Math.random() - 0.5) * MAX_OMEGA * 0.3;

                  const key = bk(i, j);
                  bonds.set(key, {
                    createdAt: now,
                    unbondAt: now + BOND_HOLD_TIME + BOND_RAND_MIN + Math.random() * (BOND_RAND_MAX - BOND_RAND_MIN),
                    omega,
                    pivot: j,
                  });
                  a.vx = b.vx; a.vy = b.vy;
                } else {
                  // Bounce free disk off cluster
                  a.vx -= -velAlongNormal * nx * 1.5;
                  a.vy -= -velAlongNormal * ny * 1.5;
                  a.x -= nx * overlap * 2;
                  a.y -= ny * overlap * 2;
                }

              } else {
                // Two clusters collide → just separate (no bond between clusters for simplicity)
                const clusterA = getCluster(i);
                const clusterB = getCluster(j);
                for (const ci of clusterA) { disks[ci].x -= nx * overlap; disks[ci].y -= ny * overlap; }
                for (const ci of clusterB) { disks[ci].x += nx * overlap; disks[ci].y += ny * overlap; }
                // Swap velocity component along normal
                const relVn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
                if (relVn > 0) {
                  for (const ci of clusterA) { disks[ci].vx -= relVn * nx * 0.5; disks[ci].vy -= relVn * ny * 0.5; }
                  for (const ci of clusterB) { disks[ci].vx += relVn * nx * 0.5; disks[ci].vy += relVn * ny * 0.5; }
                }
              }
            }
          }
        }
      }

      // Enforce bond distances (keep bonded pairs at exactly 2r)
      for (const [key] of bonds) {
        const [i, j] = key.split("-").map(Number);
        const a = disks[i];
        const b = disks[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.01 && Math.abs(dist - r * 2) > 0.5) {
          const nx = dx / dist;
          const ny = dy / dist;
          const correction = (dist - r * 2) * 0.5;
          if (dragIdx !== i) { a.x += nx * correction; a.y += ny * correction; }
          if (dragIdx !== j) { b.x -= nx * correction; b.y -= ny * correction; }
        }
      }

      // ─── Render ───
      const contactThreshold = r * 2.15;

      // Contact/bond lines
      for (let i = 0; i < disks.length; i++) {
        for (let j = i + 1; j < disks.length; j++) {
          const key = bk(i, j);
          const a = disks[i];
          const b = disks[j];
          const dist = Math.hypot(b.x - a.x, b.y - a.y);

          if (bonds.has(key)) {
            ctx.strokeStyle = isDark ? "rgba(251, 191, 36, 0.55)" : "rgba(217, 119, 6, 0.5)";
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.setLineDash([]);
          } else if (dist < contactThreshold) {
            const closeness = Math.max(0, 1 - (dist - r * 2) / (contactThreshold - r * 2));
            ctx.strokeStyle = isDark
              ? `rgba(251, 191, 36, ${0.3 * closeness})`
              : `rgba(217, 119, 6, ${0.35 * closeness})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      // Disks
      for (let i = 0; i < disks.length; i++) {
        const d = disks[i];
        const bonded = hasBond(i);
        const dragged = i === dragIdx;

        // Halo
        const haloA = isDark ? 0.05 : 0.09;
        const grd = ctx.createRadialGradient(d.x, d.y, r * 0.5, d.x, d.y, r * 1.5);
        grd.addColorStop(0, `rgba(${isDark ? "56, 189, 248" : "2, 132, 199"}, ${haloA})`);
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(d.x, d.y, r * 1.5, 0, Math.PI * 2); ctx.fill();

        // Fill
        const fillA = (isDark ? 0.08 : 0.15) + (bonded ? 0.04 : 0) + (dragged ? 0.04 : 0);
        ctx.fillStyle = `rgba(${isDark ? "56, 189, 248" : "2, 132, 199"}, ${fillA})`;
        ctx.beginPath(); ctx.arc(d.x, d.y, r, 0, Math.PI * 2); ctx.fill();

        // Border
        const borderA = (isDark ? 0.35 : 0.55) + (bonded ? 0.2 : 0) + (dragged ? 0.15 : 0);
        ctx.strokeStyle = `rgba(${isDark ? "56, 189, 248" : "2, 132, 199"}, ${borderA})`;
        ctx.lineWidth = dragged ? 1.8 : 1.2;
        ctx.beginPath(); ctx.arc(d.x, d.y, r, 0, Math.PI * 2); ctx.stroke();

        // Center dot
        const dotA = (isDark ? 0.4 : 0.65) + (bonded ? 0.2 : 0);
        ctx.fillStyle = `rgba(${isDark ? "56, 189, 248" : "2, 132, 199"}, ${dotA})`;
        ctx.beginPath(); ctx.arc(d.x, d.y, 2, 0, Math.PI * 2); ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("mouseleave", onUp);
      canvas.removeEventListener("contextmenu", onContext);
      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-auto"
      aria-hidden="true"
    />
  );
}
