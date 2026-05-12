// ============================================================
// APP — Rendering & Interaction Logic
// Depends on: data.js (must be loaded first)
// ============================================================

let selectedEst = null;
let map1 = null;

// ============================================================
// TAB SWITCHING
// ============================================================
function switchTab(idx) {
  document.querySelectorAll('.tab-btn').forEach((b,i) => b.classList.toggle('active', i===idx));
  document.querySelectorAll('.tab-content').forEach((c,i) => c.classList.toggle('active', i===idx));
  if (idx===0 && !map1) initMap1();
}

// ============================================================
// TAB 1: OPORTUNIDAD DE MERCADO
// ============================================================
function initMap1() {
  map1 = L.map('map-oportunidad').setView([-34, -62], 5);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '©CartoDB', maxZoom: 18
  }).addTo(map1);
  
  ESTABLECIMIENTOS.forEach(e => {
    const color = e.score >= 70 ? '#22d39a' : e.score >= 50 ? '#ffb547' : '#ff5577';
    const circle = L.circleMarker([e.lat, e.lng], {
      radius: Math.sqrt(e.cabezas) / 8,
      fillColor: color, fillOpacity: 0.7,
      color: color, weight: 1, opacity: 0.9
    }).addTo(map1);
    circle.bindPopup(`<strong>${e.name}</strong><br>${e.depto}, ${e.prov}<br>${e.cabezas.toLocaleString()} cab · ${e.ha.toLocaleString()} ha<br>Score: ${e.score}/100`);
  });
  
  PROVINCIAS.forEach(p => {
    const radius = Math.sqrt(p.cabezas) / 120;
    L.circleMarker([p.lat, p.lng], {
      radius: radius, fillColor: '#06ffe1', fillOpacity: 0.15,
      color: '#06ffe1', weight: 1, opacity: 0.3
    }).addTo(map1);
  });
}

function renderProvTable() {
  const tbody = document.getElementById('prov-table-body');
  const maxCab = PROVINCIAS[0].cabezas;
  tbody.innerHTML = PROVINCIAS.map(p => {
    const pct = (p.cabezas / TOTAL_NACIONAL * 100).toFixed(1);
    const barW = (p.cabezas / maxCab * 100).toFixed(0);
    return `<tr>
      <td style="font-weight:600;">${p.name}</td>
      <td>${(p.cabezas/1e6).toFixed(1)}M</td>
      <td>${pct}%</td>
      <td><div class="prov-bar"><div class="prov-bar-fill" style="width:${barW}%"></div></div></td>
    </tr>`;
  }).join('');
}

// ============================================================
// TAB 2: SCORING GANADERO
// ============================================================
function renderEstList() {
  const list = document.getElementById('est-list');
  list.innerHTML = ESTABLECIMIENTOS.map(e => {
    const cls = e.score >= 70 ? 'high' : e.score >= 50 ? 'mid' : 'low';
    return `<div class="est-item" id="est-${e.id}" onclick="selectEst(${e.id})">
      <div class="est-score ${cls}">${e.score}</div>
      <div class="est-info">
        <div class="est-name">${e.name}</div>
        <div class="est-loc">${e.depto}, ${e.prov}</div>
        <div class="est-meta">
          <span class="est-tag">${e.cabezas.toLocaleString()} cab</span>
          <span class="est-tag">${e.ha.toLocaleString()} ha</span>
          <span class="est-tag">${e.actividad}</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

function selectEst(id) {
  selectedEst = ESTABLECIMIENTOS.find(e => e.id === id);
  document.querySelectorAll('.est-item').forEach(el => el.classList.remove('active'));
  document.getElementById('est-'+id).classList.add('active');
  renderScoringDetail();
  renderCreditDetail();
  renderMonitoringDetail();
}

function renderScoringDetail() {
  const e = selectedEst;
  if (!e) return;
  const bgColor = e.score >= 70 ? 'var(--gn)' : e.score >= 50 ? 'var(--am)' : 'var(--rd)';
  
  const detail = document.getElementById('scoring-detail');
  detail.innerHTML = `
    <div class="card" style="margin-bottom:20px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <div>
          <div style="font-size:18px;font-weight:800;color:var(--nv-d);">${e.name}</div>
          <div style="font-size:12px;color:var(--g5);">${e.depto}, ${e.prov} · RENSPA: ${e.renspa}</div>
        </div>
        <div class="semaforo ${e.semaforo}">
          <span class="semaforo-dot"></span>
          ${e.semaforo === 'verde' ? 'Riesgo Bajo' : e.semaforo === 'amarillo' ? 'Riesgo Medio' : 'Riesgo Alto'}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;">
        <div style="text-align:center;padding:10px;background:var(--g1);border-radius:var(--radius-sm);">
          <div style="font-size:10px;color:var(--g5);font-weight:600;">CABEZAS</div>
          <div style="font-size:20px;font-weight:800;color:var(--nv-d);">${e.cabezas.toLocaleString()}</div>
        </div>
        <div style="text-align:center;padding:10px;background:var(--g1);border-radius:var(--radius-sm);">
          <div style="font-size:10px;color:var(--g5);font-weight:600;">HECTÁREAS</div>
          <div style="font-size:20px;font-weight:800;color:var(--nv-d);">${e.ha.toLocaleString()}</div>
        </div>
        <div style="text-align:center;padding:10px;background:var(--g1);border-radius:var(--radius-sm);">
          <div style="font-size:10px;color:var(--g5);font-weight:600;">CARGA</div>
          <div style="font-size:20px;font-weight:800;color:var(--nv-d);">${(e.cabezas/e.ha).toFixed(2)}</div>
          <div style="font-size:9px;color:var(--g4);">cab/ha</div>
        </div>
        <div style="text-align:center;padding:10px;background:var(--g1);border-radius:var(--radius-sm);">
          <div style="font-size:10px;color:var(--g5);font-weight:600;">ACTIVIDAD</div>
          <div style="font-size:14px;font-weight:700;color:var(--nv-d);margin-top:4px;">${e.actividad}</div>
        </div>
      </div>
    </div>
    
    <div class="grid-2">
      <div class="card">
        <div class="card-title" style="margin-bottom:16px;">Score BoldOS</div>
        <div class="score-big">
          <div class="score-circle" style="background:${bgColor};">${e.score}</div>
          <div class="score-label">de 100 puntos</div>
        </div>
        <div class="radar-wrap">
          ${renderRadar(e.factors)}
        </div>
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom:16px;">Desglose de Factores</div>
        <div class="factor-list">
          ${Object.entries(e.factors).map(([k,v]) => {
            const color = v >= 70 ? 'var(--gn)' : v >= 50 ? 'var(--am)' : 'var(--rd)';
            return `<div class="factor">
              <div class="factor-name">${FACTOR_NAMES[k]}</div>
              <div class="factor-bar-bg"><div class="factor-bar" style="width:${v}%;background:${color};"></div></div>
              <div class="factor-val" style="color:${color};">${v}</div>
            </div>`;
          }).join('')}
        </div>
        <div style="margin-top:20px;padding:14px;background:var(--g1);border-radius:var(--radius-sm);font-size:11px;color:var(--g6);line-height:1.6;">
          <strong>Análisis BoldOS:</strong> ${generateAnalysis(e)}
        </div>
      </div>
    </div>
  `;
}

function renderRadar(factors) {
  const keys = Object.keys(factors);
  const n = keys.length;
  const cx = 150, cy = 140, R = 80;
  const labels = ['Pasturas','Receptividad','Clima','Superficie','Historial'];
  
  let gridLines = '';
  [0.25, 0.5, 0.75, 1.0].forEach(scale => {
    let pts = [];
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
      pts.push(`${cx + R * scale * Math.cos(angle)},${cy + R * scale * Math.sin(angle)}`);
    }
    gridLines += `<polygon points="${pts.join(' ')}" fill="none" stroke="var(--g2)" stroke-width="1"/>`;
  });
  
  let axes = '';
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    axes += `<line x1="${cx}" y1="${cy}" x2="${cx + R * Math.cos(angle)}" y2="${cy + R * Math.sin(angle)}" stroke="var(--g2)" stroke-width="1"/>`;
  }
  
  let dataPts = [];
  const vals = Object.values(factors);
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    const r = (vals[i] / 100) * R;
    dataPts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  
  let labelEls = '';
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    const lx = cx + (R + 24) * Math.cos(angle);
    const ly = cy + (R + 24) * Math.sin(angle);
    const anchor = Math.abs(Math.cos(angle)) < 0.1 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end';
    labelEls += `<text x="${lx}" y="${ly}" text-anchor="${anchor}" dominant-baseline="middle" fill="var(--g5)" font-size="11" font-weight="600">${labels[i]}</text>`;
  }
  
  return `<svg width="300" height="280" viewBox="0 0 300 280">
    ${gridLines}${axes}
    <polygon points="${dataPts.join(' ')}" fill="rgba(25,115,184,0.15)" stroke="var(--aq)" stroke-width="2"/>
    ${dataPts.map(pt => `<circle cx="${pt.split(',')[0]}" cy="${pt.split(',')[1]}" r="3" fill="var(--aq)"/>`).join('')}
    ${labelEls}
  </svg>`;
}

function generateAnalysis(e) {
  if (e.score >= 70) {
    return `El establecimiento ${e.name} presenta un perfil de riesgo bajo. Las señales de pasturas muestran un NDVI consistente con la época, la carga animal (${(e.cabezas/e.ha).toFixed(2)} cab/ha) se encuentra dentro del rango de receptividad estimado, y el historial climático de la zona no presenta anomalías significativas. Recomendación: apto para línea crediticia estándar.`;
  } else if (e.score >= 50) {
    return `El establecimiento ${e.name} presenta un perfil de riesgo moderado. Se detectan señales de atención en ${e.factors.receptividad < 60 ? 'la relación carga/receptividad' : 'las condiciones climáticas de la zona'}. La carga animal (${(e.cabezas/e.ha).toFixed(2)} cab/ha) requiere monitoreo. Recomendación: evaluar con condiciones ajustadas y seguimiento quincenal reforzado.`;
  } else {
    return `El establecimiento ${e.name} presenta un perfil de riesgo elevado. Se detectan alertas en múltiples factores: ${e.factors.pasturas < 40 ? 'deterioro significativo de pasturas, ' : ''}${e.factors.clima < 40 ? 'riesgo climático severo (sequía), ' : ''}${e.factors.receptividad < 40 ? 'sobrecarga respecto a la receptividad del campo. ' : ''}Recomendación: requiere evaluación presencial antes de precalificación. Monitoreo intensivo si se aprueba.`;
  }
}

// ============================================================
// TAB 3: PRECALIFICACIÓN CREDITICIA
// ============================================================
function renderCreditDetail() {
  const e = selectedEst;
  if (!e) return;
  const c = e.creditLine;
  const percentile = Math.min(95, Math.max(5, e.score + Math.floor(Math.random()*10) - 5));
  
  document.getElementById('credit-content').innerHTML = `
    <div class="grid-2" style="margin-bottom:20px;">
      <div class="credit-box">
        <div class="credit-title">Línea Recomendada para ${e.name}</div>
        <div class="credit-amount">USD ${c.monto.toLocaleString()}</div>
        <div class="credit-detail">${c.tipo} · Score BoldOS: ${e.score}/100</div>
        <div class="credit-grid">
          <div class="credit-metric">
            <div class="credit-metric-label">Plazo</div>
            <div class="credit-metric-val">${c.plazo} meses</div>
          </div>
          <div class="credit-metric">
            <div class="credit-metric-label">Indicador de tasa</div>
            <div class="credit-metric-val" style="display:flex;align-items:center;gap:8px;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${TASA_LABELS[c.tasaIndicador].color};"></span>
              ${TASA_LABELS[c.tasaIndicador].label}
            </div>
          </div>
          <div class="credit-metric">
            <div class="credit-metric-label">Cuota est.</div>
            <div class="credit-metric-val">USD ${Math.round(c.monto / c.plazo).toLocaleString()}/m</div>
          </div>
          <div class="credit-metric">
            <div class="credit-metric-label">Garantía prendaria</div>
            <div class="credit-metric-val">${e.garantia.toLocaleString()} cab</div>
          </div>
        </div>
        <div style="margin-top:14px;padding:12px 14px;background:rgba(255,255,255,.1);border-radius:var(--radius-sm);border-left:3px solid ${TASA_LABELS[c.tasaIndicador].color};">
          <div style="font-size:10px;font-weight:600;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.3px;margin-bottom:4px;">Criterio de tasa BoldOS</div>
          <div style="font-size:11px;color:rgba(255,255,255,.85);line-height:1.5;">${TASA_LABELS[c.tasaIndicador].desc}</div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-title" style="margin-bottom:12px;">Posición en su zona</div>
        <div style="font-size:12px;color:var(--g5);margin-bottom:16px;">
          Este establecimiento está en el <strong style="color:var(--nv-d);">percentil ${percentile}</strong> de los establecimientos ganaderos de ${e.prov} evaluados por BoldOS.
        </div>
        <div class="percentile-bar">
          <div class="percentile-marker" style="left:${percentile}%;">
            <div class="percentile-label">P${percentile} · ${e.name}</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--g4);margin-top:4px;">
          <span>Mayor riesgo</span><span>Menor riesgo</span>
        </div>
        
        <div style="margin-top:24px;">
          <div class="card-title" style="margin-bottom:8px;">Estacionalidad de Ingresos</div>
          <div style="font-size:11px;color:var(--g5);margin-bottom:8px;">
            ${c.tipo === 'Cría' || c.tipo === 'Cría extensiva' ? 'Venta de terneros concentrada en otoño (Abr-May)' : 'Ingresos distribuidos según ciclo de engorde'}
          </div>
          <div class="season-row">
            ${SEASON_DATA.map(s => `<div class="season-month ${s.type}">${s.m}</div>`).join('')}
          </div>
          <div style="display:flex;gap:12px;margin-top:6px;font-size:10px;color:var(--g5);">
            <span>🟢 Ingreso</span><span>🔴 Gasto</span><span>⚪ Neutro</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-title" style="margin-bottom:4px;">Resumen para el Oficial de Crédito</div>
      <div style="font-size:11px;color:var(--g5);margin-bottom:16px;">Información pre-procesada por BoldOS para la evaluación crediticia</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
        <div style="padding:16px;background:var(--g1);border-radius:var(--radius-sm);">
          <div style="font-size:10px;font-weight:600;color:var(--g5);text-transform:uppercase;margin-bottom:6px;">Ratio Carga/Receptividad</div>
          <div style="font-size:24px;font-weight:800;color:${e.factors.receptividad >= 60 ? 'var(--gn-d)' : 'var(--rd)'};">
            ${(e.cabezas/e.ha).toFixed(2)}
          </div>
          <div style="font-size:11px;color:var(--g4);">cab/ha ${e.factors.receptividad >= 60 ? '(dentro del rango)' : '(excede receptividad)'}</div>
        </div>
        <div style="padding:16px;background:var(--g1);border-radius:var(--radius-sm);">
          <div style="font-size:10px;font-weight:600;color:var(--g5);text-transform:uppercase;margin-bottom:6px;">Riesgo de Sequía</div>
          <div style="font-size:24px;font-weight:800;color:${e.factors.clima >= 60 ? 'var(--gn-d)' : e.factors.clima >= 40 ? 'var(--am-d)' : 'var(--rd)'};">
            ${e.factors.clima >= 60 ? 'Bajo' : e.factors.clima >= 40 ? 'Medio' : 'Alto'}
          </div>
          <div style="font-size:11px;color:var(--g4);">Basado en historial + pronóstico</div>
        </div>
        <div style="padding:16px;background:var(--g1);border-radius:var(--radius-sm);">
          <div style="font-size:10px;font-weight:600;color:var(--g5);text-transform:uppercase;margin-bottom:6px;">Superficie Ganadera Efectiva</div>
          <div style="font-size:24px;font-weight:800;color:var(--nv-d);">
            ${Math.round(e.ha * e.factors.superficie / 100).toLocaleString()}
          </div>
          <div style="font-size:11px;color:var(--g4);">ha (${e.factors.superficie}% de ${e.ha.toLocaleString()} ha totales)</div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// TAB 4: MONITOREO QUINCENAL
// ============================================================
function renderMonitoringDetail() {
  const e = selectedEst;
  if (!e) return;
  
  const chartW = 700, chartH = 180, padL = 40, padR = 10, padT = 10, padB = 30;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;
  
  // Build NDVI line
  const points = e.ndvi.map((v, i) => {
    const x = padL + (i / (e.ndvi.length - 1)) * plotW;
    const y = padT + plotH - ((v - 0.15) / (0.75 - 0.15)) * plotH;
    return { x, y, v };
  });
  
  const pathD = 'M' + points.map(p => `${p.x},${p.y}`).join(' L');
  const areaD = pathD + ` L${points[points.length-1].x},${padT + plotH} L${points[0].x},${padT + plotH} Z`;
  
  // Color zones
  const thresholdHigh = padT + plotH - ((0.50 - 0.15) / (0.75 - 0.15)) * plotH;
  const thresholdLow = padT + plotH - ((0.30 - 0.15) / (0.75 - 0.15)) * plotH;
  
  // X labels (quarterly)
  let xLabels = '';
  [0, 6, 12, 18, 23].forEach(i => {
    const x = padL + (i / (e.ndvi.length - 1)) * plotW;
    xLabels += `<text x="${x}" y="${chartH - 5}" text-anchor="middle" fill="var(--g4)" font-size="9">${MONTHS_Q[i]}</text>`;
  });
  
  // Y labels
  let yLabels = '';
  [0.20, 0.30, 0.40, 0.50, 0.60, 0.70].forEach(v => {
    const y = padT + plotH - ((v - 0.15) / (0.75 - 0.15)) * plotH;
    yLabels += `<text x="${padL - 6}" y="${y + 3}" text-anchor="end" fill="var(--g4)" font-size="9">${v.toFixed(1)}</text>`;
    yLabels += `<line x1="${padL}" y1="${y}" x2="${chartW - padR}" y2="${y}" stroke="var(--g2)" stroke-width="0.5"/>`;
  });
  
  const ndviSvg = `<svg width="100%" viewBox="0 0 ${chartW} ${chartH}" preserveAspectRatio="xMidYMid meet">
    <!-- Zones -->
    <rect x="${padL}" y="${padT}" width="${plotW}" height="${thresholdHigh - padT}" fill="rgba(73,169,66,0.06)"/>
    <rect x="${padL}" y="${thresholdHigh}" width="${plotW}" height="${thresholdLow - thresholdHigh}" fill="rgba(245,166,35,0.06)"/>
    <rect x="${padL}" y="${thresholdLow}" width="${plotW}" height="${padT + plotH - thresholdLow}" fill="rgba(230,57,70,0.06)"/>
    <!-- Threshold lines -->
    <line x1="${padL}" y1="${thresholdHigh}" x2="${chartW-padR}" y2="${thresholdHigh}" stroke="var(--gn)" stroke-width="0.5" stroke-dasharray="4,3"/>
    <line x1="${padL}" y1="${thresholdLow}" x2="${chartW-padR}" y2="${thresholdLow}" stroke="var(--rd)" stroke-width="0.5" stroke-dasharray="4,3"/>
    <text x="${chartW-padR-2}" y="${thresholdHigh-3}" text-anchor="end" fill="var(--gn)" font-size="8">Óptimo 0.50</text>
    <text x="${chartW-padR-2}" y="${thresholdLow-3}" text-anchor="end" fill="var(--rd)" font-size="8">Crítico 0.30</text>
    ${yLabels}
    ${xLabels}
    <!-- Area -->
    <path d="${areaD}" fill="rgba(25,115,184,0.1)"/>
    <!-- Line -->
    <path d="${pathD}" fill="none" stroke="var(--aq)" stroke-width="2"/>
    <!-- Dots -->
    ${points.map(p => {
      const c = p.v >= 0.5 ? 'var(--gn)' : p.v >= 0.3 ? 'var(--am)' : 'var(--rd)';
      return `<circle cx="${p.x}" cy="${p.y}" r="3" fill="${c}" stroke="white" stroke-width="1"/>`;
    }).join('')}
  </svg>`;
  
  // Semáforo timeline
  const semStates = e.ndvi.map(v => {
    if (v >= 0.50) return 'verde';
    if (v >= 0.30) return 'amarillo';
    return 'rojo';
  });
  
  document.getElementById('monitoring-content').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
      <div>
        <div style="font-size:16px;font-weight:800;color:var(--nv-d);">${e.name}</div>
        <div style="font-size:12px;color:var(--g5);">${e.depto}, ${e.prov} · RENSPA: ${e.renspa}</div>
      </div>
      <div class="semaforo ${e.semaforo}">
        <span class="semaforo-dot"></span>
        Semáforo actual: ${e.semaforo === 'verde' ? 'Verde' : e.semaforo === 'amarillo' ? 'Amarillo' : 'Rojo'}
      </div>
    </div>
    
    <div class="card" style="margin-bottom:20px;">
      <div class="card-header">
        <div class="card-title">Evolución NDVI de Pasturas — Últimos 12 meses (quincenal)</div>
        <div class="card-badge" style="background:var(--aq-l);color:var(--aq);">Sensorización BoldOS</div>
      </div>
      <div class="ndvi-chart">${ndviSvg}</div>
      <div style="display:flex;gap:16px;margin-top:12px;font-size:10px;color:var(--g5);">
        <span><span style="display:inline-block;width:10px;height:10px;background:var(--gn);border-radius:50%;vertical-align:middle;margin-right:4px;"></span>NDVI ≥ 0.50 (óptimo)</span>
        <span><span style="display:inline-block;width:10px;height:10px;background:var(--am);border-radius:50%;vertical-align:middle;margin-right:4px;"></span>0.30 – 0.50 (atención)</span>
        <span><span style="display:inline-block;width:10px;height:10px;background:var(--rd);border-radius:50%;vertical-align:middle;margin-right:4px;"></span>NDVI < 0.30 (crítico)</span>
      </div>
    </div>
    
    <div class="grid-2">
      <div class="card">
        <div class="card-title" style="margin-bottom:12px;">Alertas del Período</div>
        <div class="alert-list">
          ${e.alerts.map(a => `
            <div class="alert-item ${a.type === 'danger' ? 'danger' : a.type === 'warn' ? 'warn' : 'ok'}">
              <div class="alert-icon">${a.type === 'danger' ? '🔴' : a.type === 'warn' ? '🟡' : '🟢'}</div>
              <div class="alert-text">
                <div class="alert-title">${a.title}</div>
                <div class="alert-desc">${a.desc}</div>
                <div class="alert-date">${a.date}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="card">
        <div class="card-title" style="margin-bottom:12px;">Evolución del Semáforo de Riesgo</div>
        <div style="font-size:11px;color:var(--g5);margin-bottom:12px;">Historial de estados del semáforo quincenal</div>
        <div class="monitoring-timeline">
          ${semStates.map((s, i) => {
            const h = 20 + (e.ndvi[i] - 0.15) / (0.75 - 0.15) * 80;
            const color = s === 'verde' ? 'var(--gn)' : s === 'amarillo' ? 'var(--am)' : 'var(--rd)';
            return `<div class="mt-bar" style="height:${h}%;background:${color};opacity:${0.5 + i/48};" title="${MONTHS_Q[i]}: NDVI ${e.ndvi[i].toFixed(2)}">
              ${i % 4 === 0 ? `<span class="mt-label">${MONTHS_Q[i]}</span>` : ''}
            </div>`;
          }).join('')}
        </div>
        
        <div style="margin-top:28px;padding:14px;background:var(--g1);border-radius:var(--radius-sm);">
          <div style="font-size:11px;font-weight:700;color:var(--g6);margin-bottom:4px;">Resumen para el banco</div>
          <div style="font-size:11px;color:var(--g5);line-height:1.6;">
            ${e.semaforo === 'verde' 
              ? `${e.name} mantiene condiciones estables. No se requieren acciones preventivas. Próxima revisión en 15 días.`
              : e.semaforo === 'amarillo'
              ? `${e.name} presenta señales de atención. Se recomienda seguimiento reforzado y contacto con el productor para evaluar plan de contingencia.`
              : `${e.name} presenta alertas activas en múltiples indicadores. Se recomienda activar protocolo de seguimiento intensivo y evaluar reestructuración si las condiciones persisten en las próximas 2 quincenas.`
            }
          </div>
        </div>
      </div>
    </div>
    
    ${renderCollateralSection(e)}
  `;
}

// ============================================================
// COLLATERAL MONITORING — Cabezas detectadas vs prendadas
// ============================================================
function renderCollateralSection(e) {
  const cd = e.cabezasDetectadas;
  const gar = e.garantia;
  const lastDetected = cd[cd.length - 1];
  const prevDetected = cd[cd.length - 2];
  const ratio = Math.round((lastDetected / gar) * 100);
  const ratioColor = ratio >= 105 ? 'var(--gn)' : ratio >= 95 ? 'var(--am)' : 'var(--rd)';
  const ratioSemaforo = ratio >= 105 ? 'verde' : ratio >= 95 ? 'amarillo' : 'rojo';
  const ratioLabel = ratio >= 105 ? 'Cobertura holgada' : ratio >= 95 ? 'Cobertura ajustada' : 'Cobertura insuficiente';
  
  // ── Cabezas timeline SVG ──
  const chartW = 700, chartH = 180, padL = 50, padR = 10, padT = 15, padB = 30;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;
  
  const allVals = [...cd, gar];
  const yMin = Math.min(...allVals) * 0.92;
  const yMax = Math.max(...allVals) * 1.05;
  
  const toX = (i) => padL + (i / (cd.length - 1)) * plotW;
  const toY = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
  
  const linePath = 'M' + cd.map((v, i) => `${toX(i)},${toY(v)}`).join(' L');
  const areaPath = linePath + ` L${toX(cd.length-1)},${padT + plotH} L${toX(0)},${padT + plotH} Z`;
  const garY = toY(gar);
  
  // X labels
  let xLabels = '';
  [0, 6, 12, 18, 23].forEach(i => {
    xLabels += `<text x="${toX(i)}" y="${chartH - 5}" text-anchor="middle" fill="var(--g4)" font-size="9">${MONTHS_Q[i]}</text>`;
  });
  
  // Y labels
  const range = yMax - yMin;
  const step = range > 1000 ? 500 : range > 500 ? 200 : range > 200 ? 100 : 50;
  const yStart = Math.ceil(yMin / step) * step;
  let yLabels = '';
  for (let v = yStart; v <= yMax; v += step) {
    const y = toY(v);
    yLabels += `<text x="${padL - 6}" y="${y + 3}" text-anchor="end" fill="var(--g4)" font-size="9">${v.toLocaleString()}</text>`;
    yLabels += `<line x1="${padL}" y1="${y}" x2="${chartW - padR}" y2="${y}" stroke="var(--g2)" stroke-width="0.5"/>`;
  }
  
  // Dots colored by coverage status
  const dots = cd.map((v, i) => {
    const c = v >= gar * 1.05 ? 'var(--gn)' : v >= gar ? 'var(--am)' : 'var(--rd)';
    return `<circle cx="${toX(i)}" cy="${toY(v)}" r="3" fill="${c}" stroke="white" stroke-width="1"/>`;
  }).join('');
  
  const cabezasSvg = `<svg width="100%" viewBox="0 0 ${chartW} ${chartH}" preserveAspectRatio="xMidYMid meet">
    <rect x="${padL}" y="${garY}" width="${plotW}" height="${padT + plotH - garY}" fill="rgba(230,57,70,0.04)"/>
    ${yLabels}
    ${xLabels}
    <line x1="${padL}" y1="${garY}" x2="${chartW-padR}" y2="${garY}" stroke="var(--rd)" stroke-width="1.5" stroke-dasharray="6,4"/>
    <text x="${chartW-padR-2}" y="${garY-5}" text-anchor="end" fill="var(--rd)" font-size="9" font-weight="600">Garantía: ${gar.toLocaleString()} cab</text>
    <path d="${areaPath}" fill="rgba(25,115,184,0.08)"/>
    <path d="${linePath}" fill="none" stroke="var(--aq)" stroke-width="2"/>
    ${dots}
  </svg>`;
  
  // ── Heatmap SVG ──
  const heatmapSvg = renderHeatmap(e);
  
  return `
    <div style="margin-top:28px;margin-bottom:8px;">
      <div style="font-size:16px;font-weight:800;color:var(--nv-d);letter-spacing:-.3px;">Auditoría de Colateral</div>
      <div style="font-size:12px;color:var(--g5);">Verificación satelital de cabezas prendadas como garantía del crédito</div>
    </div>
    
    <div style="display:grid;grid-template-columns:1fr 200px;gap:20px;margin-bottom:20px;">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Cabezas Detectadas vs Garantía Prendada</div>
          <div class="card-badge" style="background:var(--aq-l);color:var(--aq);">Sensorización Daredevil</div>
        </div>
        <div class="ndvi-chart">${cabezasSvg}</div>
        <div style="display:flex;gap:16px;margin-top:12px;font-size:10px;color:var(--g5);">
          <span><span style="display:inline-block;width:24px;height:2px;background:var(--aq);vertical-align:middle;margin-right:4px;"></span>Cabezas detectadas</span>
          <span><span style="display:inline-block;width:24px;height:0;border-top:2px dashed var(--rd);vertical-align:middle;margin-right:4px;"></span>Garantía prendada (${gar.toLocaleString()} cab)</span>
        </div>
      </div>
      
      <div class="card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
        <div style="font-size:10px;font-weight:600;color:var(--g5);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;">Ratio de Cobertura</div>
        <div style="width:90px;height:90px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;color:white;background:${ratioColor};">
          ${ratio}%
        </div>
        <div class="semaforo ${ratioSemaforo}" style="margin-top:12px;">
          <span class="semaforo-dot"></span>
          ${ratioLabel}
        </div>
        <div style="font-size:10px;color:var(--g4);margin-top:8px;">${lastDetected.toLocaleString()} de ${gar.toLocaleString()} cab</div>
        <div style="font-size:10px;color:${lastDetected >= prevDetected ? 'var(--gn)' : 'var(--rd)'};margin-top:2px;">
          ${lastDetected >= prevDetected ? '▲' : '▼'} ${Math.abs(lastDetected - prevDetected)} vs quincena ant.
        </div>
      </div>
    </div>
    
    <div class="grid-2">
      <div class="card">
        <div class="card-title" style="margin-bottom:12px;">Alertas de Colateral</div>
        <div class="alert-list">
          ${(e.colateralAlerts || []).map(a => `
            <div class="alert-item ${a.type === 'danger' ? 'danger' : a.type === 'warn' ? 'warn' : 'ok'}">
              <div class="alert-icon">${a.type === 'danger' ? '🔴' : a.type === 'warn' ? '🟡' : '🟢'}</div>
              <div class="alert-text">
                <div class="alert-title">${a.title}</div>
                <div class="alert-desc">${a.desc}</div>
                <div class="alert-date">${a.date}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <div class="card-title">Distribución Espacial del Rodeo</div>
          <div class="card-badge" style="background:var(--aq-l);color:var(--aq);">Última pasada</div>
        </div>
        <div style="font-size:11px;color:var(--g5);margin-bottom:12px;">Mapa de calor de detecciones dentro del establecimiento — confirma presencia real del activo</div>
        ${heatmapSvg}
        <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:9px;color:var(--g4);">
          <div style="display:flex;align-items:center;gap:4px;">
            <div style="width:40px;height:6px;border-radius:3px;background:linear-gradient(90deg,rgba(25,115,184,0.1),rgba(25,115,184,0.4),rgba(73,169,66,0.6),rgba(245,166,35,0.8),rgba(230,57,70,0.9));"></div>
            Baja → Alta concentración
          </div>
          <span>Resolución: ~10m/px (Sentinel-2 + Faster R-CNN)</span>
        </div>
      </div>
    </div>
  `;
}

function renderHeatmap(e) {
  const seed = e.id * 17;
  const w = 280, h = 180;
  const cols = 14, rows = 9;
  const cellW = w / cols, cellH = h / rows;
  
  const baseIntensity = e.score / 100;
  const spread = e.score >= 70 ? 0.7 : e.score >= 50 ? 0.5 : 0.3;
  
  let cells = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const hash = Math.sin(seed + r * 13.7 + c * 7.3) * 43758.5453;
      const rand = hash - Math.floor(hash);
      
      const cx1 = cols * 0.3, cy1 = rows * 0.4;
      const cx2 = cols * 0.7, cy2 = rows * 0.6;
      const d1 = Math.sqrt((c - cx1) ** 2 + (r - cy1) ** 2) / (cols * 0.5);
      const d2 = Math.sqrt((c - cx2) ** 2 + (r - cy2) ** 2) / (cols * 0.5);
      const cluster = Math.max(0, 1 - Math.min(d1, d2));
      
      let intensity = (cluster * spread + rand * (1 - spread) * 0.5) * baseIntensity;
      intensity = Math.max(0, Math.min(1, intensity));
      
      if (intensity > 0.08) {
        const alpha = 0.1 + intensity * 0.7;
        const color = intensity > 0.6 ? `rgba(230,57,70,${alpha.toFixed(2)})` 
                    : intensity > 0.4 ? `rgba(245,166,35,${alpha.toFixed(2)})`
                    : intensity > 0.2 ? `rgba(73,169,66,${alpha.toFixed(2)})`
                    : `rgba(25,115,184,${alpha.toFixed(2)})`;
        cells += `<rect x="${(c * cellW + 1).toFixed(1)}" y="${(r * cellH + 1).toFixed(1)}" width="${(cellW - 2).toFixed(1)}" height="${(cellH - 2).toFixed(1)}" rx="3" fill="${color}"/>`;
      }
    }
  }
  
  return `<svg width="100%" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="border-radius:var(--radius-sm);background:var(--g1);">
    <rect x="0" y="0" width="${w}" height="${h}" rx="8" fill="var(--g1)"/>
    <rect x="4" y="4" width="${w-8}" height="${h-8}" rx="6" fill="none" stroke="var(--g3)" stroke-width="1" stroke-dasharray="4,2"/>
    ${cells}
    <text x="${w/2}" y="${h - 6}" text-anchor="middle" fill="var(--g4)" font-size="8">Perímetro del establecimiento (${e.ha.toLocaleString()} ha)</text>
  </svg>`;
}

// ============================================================
// INIT
// ============================================================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loading').classList.add('hide');
  }, 1200);
  
  renderProvTable();
  renderEstList();
  
  setTimeout(() => {
    initMap1();
  }, 300);
});
