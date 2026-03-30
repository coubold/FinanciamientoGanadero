// ============================================================
// DATA — Provincias, Establecimientos, Constantes
// ============================================================

const PROVINCIAS = [
  { name:'Buenos Aires', cabezas:19400000, code:'BA', lat:-36.6, lng:-60.0 },
  { name:'Santa Fe', cabezas:6000000, code:'SF', lat:-31.6, lng:-60.7 },
  { name:'Corrientes', cabezas:4500000, code:'COR', lat:-28.8, lng:-57.9 },
  { name:'Córdoba', cabezas:4300000, code:'CBA', lat:-31.4, lng:-64.2 },
  { name:'Entre Ríos', cabezas:4300000, code:'ER', lat:-31.7, lng:-59.7 },
  { name:'La Pampa', cabezas:2800000, code:'LP', lat:-36.6, lng:-64.3 },
  { name:'Chaco', cabezas:2300000, code:'CHA', lat:-27.4, lng:-59.0 },
  { name:'Santiago del Estero', cabezas:1600000, code:'SDE', lat:-27.8, lng:-64.3 },
  { name:'Formosa', cabezas:1400000, code:'FOR', lat:-25.5, lng:-59.5 },
  { name:'Salta', cabezas:1200000, code:'SAL', lat:-24.8, lng:-65.4 }
];

const TOTAL_NACIONAL = 51626909;

const ESTABLECIMIENTOS = [
  {
    id:1, name:'La Cautiva', depto:'Chascomús', prov:'Buenos Aires',
    renspa:'06.218.1.00342.01', cabezas:1200, ha:2800, actividad:'Cría',
    lat:-35.57, lng:-58.01, score:74,
    factors:{ pasturas:78, receptividad:72, clima:80, superficie:68, historial:70 },
    creditLine:{ monto:185000, plazo:12, tasaIndicador:'estandar', tipo:'Cría' },
    ndvi:[0.52,0.55,0.58,0.61,0.63,0.65,0.62,0.58,0.54,0.50,0.48,0.45,0.47,0.50,0.53,0.56,0.59,0.62,0.64,0.66,0.63,0.60,0.57,0.54],
    garantia:1100,
    cabezasDetectadas:[1185,1192,1198,1205,1210,1215,1208,1195,1180,1170,1160,1148,1155,1165,1178,1190,1200,1210,1218,1225,1215,1205,1190,1180],
    alerts:[
      {type:'ok',title:'Pasturas estables',desc:'NDVI dentro del rango esperado para la época',date:'15/03/2025'},
      {type:'warn',title:'Menor precipitación',desc:'30% menos de lluvia que el promedio quincenal en Chascomús',date:'01/03/2025'}
    ],
    colateralAlerts:[
      {type:'ok',title:'Cobertura estable',desc:'Cabezas detectadas consistentemente por encima del umbral de garantía (1.100 cab)',date:'15/03/2025'}
    ],
    semaforo:'verde'
  },
  {
    id:2, name:'El Trébol', depto:'Gral. Madariaga', prov:'Buenos Aires',
    renspa:'06.350.1.00187.01', cabezas:850, ha:1500, actividad:'Cría/Recría',
    lat:-36.95, lng:-57.13, score:68,
    factors:{ pasturas:65, receptividad:70, clima:72, superficie:64, historial:69 },
    creditLine:{ monto:120000, plazo:18, tasaIndicador:'estandar', tipo:'Recría' },
    ndvi:[0.48,0.50,0.53,0.56,0.58,0.60,0.57,0.54,0.50,0.46,0.43,0.40,0.42,0.45,0.48,0.51,0.54,0.57,0.59,0.61,0.58,0.55,0.52,0.49],
    garantia:780,
    cabezasDetectadas:[840,845,848,852,855,858,852,845,838,830,822,815,820,828,835,842,848,854,858,862,855,848,840,832],
    alerts:[
      {type:'ok',title:'Carga adecuada',desc:'Ratio carga/receptividad dentro de parámetros normales',date:'15/03/2025'}
    ],
    colateralAlerts:[
      {type:'ok',title:'Garantía cubierta',desc:'Ratio de cobertura promedio 108% sobre las últimas 6 quincenas',date:'15/03/2025'}
    ],
    semaforo:'verde'
  },
  {
    id:3, name:'San Martín', depto:'Gualeguaychú', prov:'Entre Ríos',
    renspa:'30.049.1.01205.01', cabezas:2100, ha:4200, actividad:'Cría',
    lat:-33.01, lng:-58.52, score:71,
    factors:{ pasturas:74, receptividad:69, clima:75, superficie:72, historial:65 },
    creditLine:{ monto:240000, plazo:12, tasaIndicador:'estandar', tipo:'Cría' },
    ndvi:[0.50,0.53,0.56,0.59,0.61,0.63,0.60,0.56,0.52,0.48,0.45,0.42,0.44,0.47,0.50,0.54,0.57,0.60,0.62,0.64,0.61,0.58,0.55,0.52],
    garantia:1900,
    cabezasDetectadas:[2080,2090,2095,2100,2105,2110,2100,2085,2070,2050,2035,2020,2030,2045,2060,2078,2090,2100,2108,2115,2105,2090,2075,2060],
    alerts:[
      {type:'ok',title:'Condiciones favorables',desc:'Buena recuperación de pasturas después de las lluvias de febrero',date:'15/03/2025'},
      {type:'warn',title:'Historial de inundación',desc:'La zona registra riesgo de exceso hídrico en otoño',date:'01/02/2025'}
    ],
    colateralAlerts:[
      {type:'ok',title:'Cobertura holgada',desc:'Cabezas detectadas superan garantía prendada en todas las quincenas del período',date:'15/03/2025'}
    ],
    semaforo:'verde'
  },
  {
    id:4, name:'Los Cardales', depto:'Castellanos', prov:'Santa Fe',
    renspa:'82.021.1.00876.01', cabezas:680, ha:900, actividad:'Recría/Engorde',
    lat:-31.39, lng:-61.95, score:65,
    factors:{ pasturas:62, receptividad:58, clima:70, superficie:75, historial:62 },
    creditLine:{ monto:95000, plazo:18, tasaIndicador:'ajustada', tipo:'Recría/Engorde' },
    ndvi:[0.45,0.48,0.51,0.54,0.56,0.58,0.55,0.52,0.48,0.44,0.41,0.38,0.40,0.43,0.46,0.49,0.52,0.55,0.57,0.59,0.56,0.53,0.50,0.47],
    garantia:620,
    cabezasDetectadas:[675,678,680,682,680,676,670,665,658,650,642,635,640,648,655,662,668,674,678,682,676,670,662,655],
    alerts:[
      {type:'warn',title:'Receptividad ajustada',desc:'La carga animal está en el límite superior del rango recomendado para esta superficie',date:'15/03/2025'}
    ],
    colateralAlerts:[
      {type:'warn',title:'Cobertura ajustada',desc:'Cabezas detectadas se acercaron al umbral de garantía (620 cab) en 2 quincenas del período invernal',date:'01/09/2024'}
    ],
    semaforo:'amarillo'
  },
  {
    id:5, name:'La Esperanza', depto:'Mercedes', prov:'Corrientes',
    renspa:'18.119.1.00543.01', cabezas:3500, ha:8000, actividad:'Cría extensiva',
    lat:-29.18, lng:-58.08, score:82,
    factors:{ pasturas:85, receptividad:80, clima:78, superficie:88, historial:79 },
    creditLine:{ monto:420000, plazo:12, tasaIndicador:'optima', tipo:'Cría extensiva' },
    ndvi:[0.55,0.58,0.61,0.64,0.66,0.68,0.65,0.62,0.58,0.54,0.51,0.48,0.50,0.53,0.56,0.59,0.62,0.65,0.67,0.69,0.66,0.63,0.60,0.57],
    garantia:3200,
    cabezasDetectadas:[3480,3495,3510,3520,3530,3540,3525,3505,3485,3460,3440,3420,3435,3455,3475,3495,3510,3525,3535,3548,3530,3510,3490,3470],
    alerts:[
      {type:'ok',title:'Excelente estado de pasturas',desc:'NDVI consistentemente alto, Corrientes con crecimiento del stock provincial (+3.5%)',date:'15/03/2025'}
    ],
    colateralAlerts:[
      {type:'ok',title:'Cobertura excelente',desc:'Ratio de cobertura nunca bajó de 107% en las últimas 24 quincenas',date:'15/03/2025'}
    ],
    semaforo:'verde'
  },
  {
    id:6, name:'Don Felipe', depto:'Río Primero', prov:'Córdoba',
    renspa:'14.126.1.00412.01', cabezas:450, ha:600, actividad:'Mixto (agro+gan)',
    lat:-31.35, lng:-63.40, score:43,
    factors:{ pasturas:38, receptividad:35, clima:52, superficie:45, historial:48 },
    creditLine:{ monto:45000, plazo:12, tasaIndicador:'alta', tipo:'Mixto' },
    ndvi:[0.42,0.44,0.46,0.48,0.45,0.42,0.38,0.35,0.32,0.30,0.28,0.26,0.28,0.30,0.33,0.36,0.39,0.42,0.44,0.46,0.43,0.40,0.37,0.34],
    garantia:400,
    cabezasDetectadas:[445,448,450,452,448,440,425,410,395,380,368,355,362,370,380,392,405,418,430,440,428,415,400,385],
    alerts:[
      {type:'danger',title:'Sobrecarga detectada',desc:'0.75 cab/ha supera la receptividad estimada del campo (0.55 cab/ha)',date:'15/03/2025'},
      {type:'warn',title:'Sequía moderada',desc:'Déficit hídrico acumulado del 25% en los últimos 90 días en Río Primero',date:'01/03/2025'},
      {type:'danger',title:'NDVI en descenso',desc:'Caída sostenida del índice de pasturas por 3 quincenas consecutivas',date:'15/02/2025'}
    ],
    colateralAlerts:[
      {type:'danger',title:'Caída del 15% en cabezas detectadas',desc:'Reducción de 440 a 385 cabezas detectadas en las últimas 4 quincenas',date:'15/03/2025'},
      {type:'danger',title:'Por debajo del umbral de garantía',desc:'Cabezas detectadas por debajo de las 400 cab prendadas durante 2 quincenas consecutivas',date:'01/03/2025'}
    ],
    semaforo:'rojo'
  },
  {
    id:7, name:'El Quebracho', depto:'Anta', prov:'Salta',
    renspa:'66.007.1.00234.01', cabezas:1800, ha:12000, actividad:'Cría extensiva NOA',
    lat:-23.95, lng:-63.55, score:38,
    factors:{ pasturas:32, receptividad:40, clima:28, superficie:55, historial:38 },
    creditLine:{ monto:80000, plazo:24, tasaIndicador:'alta', tipo:'Cría extensiva' },
    ndvi:[0.38,0.40,0.42,0.44,0.42,0.38,0.34,0.30,0.26,0.23,0.20,0.18,0.20,0.22,0.25,0.28,0.31,0.34,0.36,0.38,0.35,0.32,0.29,0.26],
    garantia:1600,
    cabezasDetectadas:[1780,1790,1795,1800,1785,1760,1720,1680,1630,1580,1530,1490,1510,1540,1570,1600,1630,1660,1690,1710,1680,1640,1600,1560],
    alerts:[
      {type:'danger',title:'Sequía severa NOA',desc:'El departamento de Anta registra déficit hídrico extremo (>45%) en los últimos 120 días',date:'15/03/2025'},
      {type:'danger',title:'Pasturas críticas',desc:'NDVI por debajo del umbral mínimo (0.30) durante 4 quincenas consecutivas',date:'01/03/2025'},
      {type:'warn',title:'Baja receptividad',desc:'Campo natural degradado, receptividad estimada en 0.12 cab/ha vs carga actual 0.15',date:'15/02/2025'}
    ],
    colateralAlerts:[
      {type:'danger',title:'Cobertura crítica',desc:'Cabezas detectadas por debajo del umbral de garantía (1.600 cab) durante 6 quincenas consecutivas',date:'15/03/2025'},
      {type:'danger',title:'Dispersión anómala',desc:'Concentración del rodeo en el 20% del campo — posible movimiento o venta no declarada',date:'01/03/2025'},
      {type:'warn',title:'Tendencia descendente',desc:'Caída sostenida del 13% en cabezas detectadas respecto al inicio del crédito',date:'15/02/2025'}
    ],
    semaforo:'rojo'
  },
  {
    id:8, name:'Santa Rosa', depto:'Pilcomayo', prov:'Formosa',
    renspa:'34.042.1.00098.01', cabezas:950, ha:3200, actividad:'Cría NEA',
    lat:-25.37, lng:-58.17, score:58,
    factors:{ pasturas:55, receptividad:60, clima:52, superficie:65, historial:58 },
    creditLine:{ monto:110000, plazo:18, tasaIndicador:'ajustada', tipo:'Cría' },
    ndvi:[0.46,0.48,0.50,0.52,0.54,0.56,0.53,0.50,0.47,0.44,0.41,0.38,0.40,0.42,0.45,0.48,0.50,0.53,0.55,0.57,0.54,0.51,0.48,0.45],
    garantia:850,
    cabezasDetectadas:[940,945,948,950,952,955,948,940,930,920,910,898,905,915,925,935,942,948,952,958,950,940,930,920],
    alerts:[
      {type:'warn',title:'Estrés térmico',desc:'Temperaturas máximas sostenidas >38°C durante las últimas 3 semanas',date:'15/03/2025'},
      {type:'ok',title:'Superficie adecuada',desc:'Buena relación entre superficie ganadera efectiva y superficie total',date:'01/03/2025'}
    ],
    colateralAlerts:[
      {type:'warn',title:'Cobertura en baja estacional',desc:'Cabezas detectadas bajaron 6% en el pico de verano — consistente con patrón histórico de estrés calórico',date:'15/02/2025'},
      {type:'ok',title:'Recuperación en curso',desc:'Cabezas detectadas en ascenso en las últimas 3 quincenas, alejándose del umbral de garantía',date:'15/03/2025'}
    ],
    semaforo:'amarillo'
  }
];

// ── Constantes de presentación ──
const MONTHS_Q = ['E1','E2','F1','F2','M1','M2','A1','A2','My1','My2','Jn1','Jn2','Jl1','Jl2','Ag1','Ag2','S1','S2','O1','O2','N1','N2','D1','D2'];
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const SEASON_DATA = [
  {m:'Ene',type:'expense'},{m:'Feb',type:'expense'},{m:'Mar',type:'neutral'},
  {m:'Abr',type:'income'},{m:'May',type:'income'},{m:'Jun',type:'neutral'},
  {m:'Jul',type:'neutral'},{m:'Ago',type:'expense'},{m:'Sep',type:'expense'},
  {m:'Oct',type:'neutral'},{m:'Nov',type:'neutral'},{m:'Dic',type:'expense'}
];

const TASA_LABELS = {
  optima:   { label:'Óptima',   color:'var(--gn)',  bg:'var(--gn-l)', desc:'Score BoldOS ≥ 75. Perfil de riesgo bajo con señales consistentes. Aplica la mejor tasa vigente de la política del banco.' },
  estandar: { label:'Estándar', color:'var(--aq)',   bg:'var(--aq-l)', desc:'Score BoldOS 60–74. Perfil sólido con algún factor de atención menor. Aplica la tasa base de la línea ganadera.' },
  ajustada: { label:'Ajustada', color:'var(--am)',   bg:'var(--am-l)', desc:'Score BoldOS 45–59. Se detectan señales de riesgo que requieren seguimiento reforzado. Se recomienda un spread adicional sobre la tasa base.' },
  alta:     { label:'Alta',     color:'var(--rd)',   bg:'var(--rd-l)', desc:'Score BoldOS < 45. Múltiples factores de riesgo activos. Requiere evaluación presencial y un spread significativo, o condiciones especiales de garantía.' }
};

const FACTOR_NAMES = {
  pasturas: 'Señal de Pasturas',
  receptividad: 'Receptividad',
  clima: 'Riesgo Climático',
  superficie: 'Sup. Efectiva',
  historial: 'Historial Productivo'
};
