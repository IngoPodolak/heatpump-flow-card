/*
 * Wärmepumpen Flow Card für Home Assistant
 * Animierte Anlagenansicht: Außengerät, Speicher, Warmwasser, Heizkörper / FBH
 * Primär entworfen für Daikin Altherma 4 mit ECH2O-Speicher, nutzbar für jede Wärmepumpe.
 * https://github.com/IngoPodolak/heatpump-flow-card
 */

const HP_VERSION = "1.1.0";

const HP_LABELS = {
  title: "Titel (leer = kein Titel)",
  heating_type: "Wärmeverteilung",
  theme_background: "Hintergrund vom HA-Theme übernehmen (statt dunkel)",
  zone1_name: "Name Heizkreis 1",
  zone2_name: "Name Heizkreis 2",
  outdoor_temp: "Außentemperatur",
  indoor_temp: "Innentemperatur",
  compressor: "Verdichter läuft",
  defrost: "Abtauen / Enteisung aktiv",
  vl_temp: "Vorlauftemperatur Wärmepumpe",
  rl_temp: "Rücklauftemperatur Wärmepumpe",
  pump: "Umwälzpumpe läuft",
  pump_speed: "Umwälzpumpe Leistung (%)",
  pressure: "Druck im Heizsystem",
  power: "Stromverbrauch Wärmepumpe",
  heat_power: "Erzeugte Wärme (thermische Leistung)",
  cop: "COP",
  mode: "Aktueller Betriebsmodus",
  dhw_temp: "Brauchwassertemperatur",
  dhw_setpoint: "Sollwert Brauchwasser",
  tank_top_temp: "Speicher obere Temperatur",
  tank_bottom_temp: "Speicher untere Temperatur",
  dhw_active: "Brauchwasserbereitung aktiv",
  dhw_boost: "Speicherüberhöhung (leistungsstark)",
  heater_rod: "Heizstab im Speicher an",
  circulation: "Warmwasser-Zirkulation läuft",
  zone1_vl_temp: "Vorlauftemperatur Heizkreis 1",
  zone1_rl_temp: "Rücklauftemperatur Heizkreis 1",
  zone1_pump: "Heizkreis 1 aktiv / Pumpe läuft",
  zone1_pump_speed: "Pumpe Heizkreis 1 Leistung (%)",
  zone1_mixer: "Mischerstellung im Innengerät",
  zone2_vl_temp: "Vorlauftemperatur Heizkreis 2",
  zone2_rl_temp: "Rücklauftemperatur Heizkreis 2",
  zone2_pump: "Heizkreis 2 aktiv / Pumpe läuft",
  zone2_pump_speed: "Pumpe Heizkreis 2 Leistung (%)",
  zone2_mixer: "Mischerstellung Heizkreis 2",
};

const HP_HELPERS = {
  pump_speed: "Steuert auch die Geschwindigkeit der Pumpen- und Rohranimation",
  zone1_mixer: "Mischer im Innengerät – mischt Heizkreis und Wärmepumpenkreis",
  zone1_pump: "Leer lassen: Heizkreis gilt als aktiv, wenn die Umwälzpumpe läuft und keine Brauchwasserbereitung aktiv ist",
  zone2_pump: "Leer lassen: Heizkreis gilt als aktiv, wenn die Umwälzpumpe läuft und keine Brauchwasserbereitung aktiv ist",
};

const HP_NON_ENTITY_KEYS = ["type", "title", "heating_type", "zone1_name", "zone2_name", "theme_background"];
const HP_ON_STATES = ["on", "true", "running", "heating", "an", "ein", "aktiv", "active", "open", "yes", "1"];

const HP_STYLE = `
  :host { display: block; }
  ha-card { overflow: hidden; padding: 6px; box-sizing: border-box; height: 100%;
    display: flex; align-items: center; justify-content: center;
    --hp-bg: #1a1b22; --hp-text: #f1f2f4; --hp-text2: #a7adb7;
    background: var(--hp-bg); }
  ha-card.themed { --hp-bg: var(--ha-card-background, var(--card-background-color, #1c1c1c));
    --hp-text: var(--primary-text-color, #f1f2f4); --hp-text2: var(--secondary-text-color, #a7adb7); }
  svg { width: 100%; height: auto; display: block;
    max-height: calc(100vh - var(--header-height, 56px) - 24px);
    font-family: var(--ha-font-family-body, Roboto, "Segoe UI", sans-serif); }
  text { fill: var(--hp-text); }
  .title { font-size: 42px; font-weight: 500; }
  .v { font-size: 26px; font-weight: 500; }
  .l { font-size: 18px; fill: var(--hp-text2); }
  .s { font-size: 17px; fill: var(--hp-text); }
  .name { font-size: 23px; }
  .ztemp { font-size: 18px; }
  [data-entity-key] { cursor: pointer; }

  .casing { fill: none; stroke: var(--hp-bg); stroke-width: 15; stroke-linecap: butt; stroke-linejoin: round; }
  .pipe { fill: none; stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }
  .hot { stroke: var(--hp-hot-color, #d8463c); }
  .cold { stroke: var(--hp-cold-color, #3f7fd9); }
  .dw { stroke: #5c6b85; }
  .arrow.hot { fill: var(--hp-hot-color, #d8463c); stroke: none; }
  .arrow.cold { fill: var(--hp-cold-color, #3f7fd9); stroke: none; }
  .arrow.dw { fill: #5c6b85; stroke: none; }
  .flow { fill: none; stroke: rgba(255,255,255,.85); stroke-width: 2.5; stroke-linecap: round;
    stroke-dasharray: 1.5 15; opacity: 0; transition: opacity .5s; }
  .flow.on { opacity: 1; animation-name: hp-dash; animation-timing-function: linear; animation-iteration-count: infinite; }
  @keyframes hp-dash { to { stroke-dashoffset: -16.5; } }
  @keyframes hp-spin { to { transform: rotate(360deg); } }
  @keyframes hp-pulse { 0%,100% { opacity: .45; } 50% { opacity: 1; } }
  @keyframes hp-drip { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: 1; } 100% { transform: translateY(32px); opacity: 0; } }
  @keyframes hp-rise { 0% { transform: translateY(6px); opacity: 0; } 40% { opacity: .9; } 100% { transform: translateY(-12px); opacity: 0; } }

  /* Außengerät */
  .u-front { fill: url(#UID-ufront); stroke: #a3aab4; stroke-width: 1.5; }
  .u-top { fill: #eef0f3; stroke: #a3aab4; stroke-width: 1.5; stroke-linejoin: round; }
  .u-side { fill: #b4bac3; stroke: #8f97a2; stroke-width: 1.5; stroke-linejoin: round; }
  .louver { stroke: #c4c9d0; stroke-width: 1.5; }
  .u-foot { fill: #6b7280; }
  .fan-bezel { fill: #cfd3d9; stroke: #aab1ba; }
  .fan-bg { fill: #1f232a; }
  .blades path { fill: #4a5361; }
  .fan.on .blades { animation: hp-spin .8s linear infinite; }
  .fan.on .blades path { fill: #6d7888; }
  .fan-hub { fill: #9aa3ae; }
  .grille { fill: none; stroke: rgba(255,255,255,.2); stroke-width: 1.5; }
  .u-cut { fill: #262a31; stroke: #8f97a2; stroke-width: 1.5; }
  .copper { fill: none; stroke: #c07a46; stroke-width: 4; stroke-linecap: round; }
  .comp { fill: #3a3f47; stroke: #555c66; transition: fill .4s; }
  .comp-glow { fill: #22c55e; opacity: 0; }
  .compressor.on .comp { fill: #1f8f4a; }
  .compressor.on .comp-glow { animation: hp-pulse 1.6s ease-in-out infinite; }
  .defrost { opacity: 0; transition: opacity .6s; pointer-events: none; }
  .defrost.on { opacity: 1; }
  .frost { fill: #bfe6ff; opacity: .2; }
  .defrost.on .frost { animation: hp-frost 2.4s ease-in-out infinite; }
  @keyframes hp-frost { 0%,100% { opacity: .12; } 50% { opacity: .38; } }
  .flake { fill: none; stroke: #f0f9ff; stroke-width: 2.5; stroke-linecap: round; }
  .drip { fill: #7dd3fc; opacity: 0; }
  .defrost.on .drip { animation: hp-drip 1.4s ease-in infinite; }

  /* Speicher */
  .t-body { fill: url(#UID-tbody); stroke: #a3aab4; stroke-width: 1.5; }
  .t-cut { fill: #1d2028; stroke: #8f97a2; stroke-width: 1.5; }
  .t-heat { opacity: .3; }
  .coil-back { fill: none; stroke: url(#UID-tank); stroke-width: 3; opacity: .35; }
  .coil { fill: none; stroke: url(#UID-tank); stroke-width: 4; stroke-linecap: round; }
  .t-pipe { stroke: #8f97a2; stroke-width: 4; }
  .t-head { fill: #2a2e36; stroke: #454b55; stroke-width: 1.5; }
  .t-display { fill: #0d1015; stroke: #3a3f48; }
  .port { fill: #6b7280; }
  .led { fill: #39404b; transition: fill .4s; }
  .leds.on .led { fill: #4fd1e8; }
  .rod { fill: #6b7280; stroke: #3f454f; stroke-width: 1; transition: fill .4s; }
  .rod-glow { fill: #f97316; opacity: 0; }
  .heater.on .rod { fill: #fb923c; }
  .heater.on .rod-glow { animation: hp-pulse 1.2s ease-in-out infinite; }
  .mixer { fill: #b56cf0; stroke: #6b2fa0; stroke-width: 1.2; stroke-linejoin: round; }

  /* Pumpen */
  .p-body { fill: var(--hp-bg); stroke: #e6e8eb; stroke-width: 2.5; transition: stroke .4s; }
  .p-tri { fill: none; stroke: #e6e8eb; stroke-width: 2.5; stroke-linejoin: round; transition: stroke .4s; }
  .p-ring { fill: none; stroke: #22c55e; stroke-width: 2.5; stroke-dasharray: 6 5; opacity: 0; }
  .pump.on .p-body, .pump.on .p-tri { stroke: #22c55e; }
  .pump.on .p-ring { opacity: 1; animation-name: hp-spin; animation-timing-function: linear; animation-iteration-count: infinite; }

  /* Wärmeübergabe */
  .r-back { fill: #dfe2e7; stroke: #a3aab4; stroke-width: 1.5; }
  .r-col { fill: #f6f7f9; stroke: #c3c8cf; stroke-width: 1; }
  .r-bar { fill: #e9ebef; stroke: #b3b9c2; stroke-width: 1; }
  .glow { fill: #f97316; opacity: 0; transition: opacity .8s; }
  .emitter.on .glow { opacity: .25; }
  .wave { fill: none; stroke: #f97316; stroke-width: 3; stroke-linecap: round; opacity: 0; }
  .emitter.on .wave { animation: hp-rise 2.4s ease-in-out infinite; }
  .cab { fill: #d5d9df; stroke: #9aa3ae; stroke-width: 1.5; }
  .cab-in { fill: #c3c8cf; }
  .bar-h { fill: #c9463d; } .bar-c { fill: #3f72c4; }
  .vhead { fill: #f4f5f7; stroke: #a3aab4; }
  .loop-h { fill: none; stroke: #d8463c; stroke-width: 4; stroke-linecap: round; }
  .loop-c { fill: none; stroke: #3f7fd9; stroke-width: 4; stroke-linecap: round; }

  .tap { fill: none; stroke: url(#UID-chrome); stroke-width: 11; stroke-linecap: round; stroke-linejoin: round; }
  .tap-body { fill: url(#UID-chrome); stroke: #7c8591; }
  .tap-h { fill: none; stroke: #b9c0c9; stroke-width: 5; stroke-linecap: round; }

  /* Chips & Leiste */
  .chip rect { fill: none; stroke: rgba(160,166,176,.35); stroke-width: 1.5; transition: all .4s; }
  .chip circle { fill: #5b6270; transition: fill .4s; }
  .chip text { font-size: 16px; fill: var(--hp-text2); }
  .chip.on rect { fill: var(--chip-c); fill-opacity: .18; stroke: var(--chip-c); }
  .chip.on circle { fill: var(--chip-c); animation: hp-pulse 1.4s ease-in-out infinite; }
  .chip.on text { fill: var(--hp-text); }
  .stat rect { fill: rgba(150,156,168,.1); stroke: rgba(150,156,168,.25); }
`;

class HeatpumpFlowCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._uid = "hp" + Math.random().toString(36).slice(2, 8);
  }

  static getConfigElement() { return document.createElement("heatpump-flow-card-editor"); }
  static getStubConfig() { return { title: "Wärmepumpe", heating_type: "radiator" }; }

  setConfig(config) {
    if (!config) throw new Error("Ungültige Konfiguration");
    this._config = { heating_type: "radiator", ...config };
    this._build();
    if (this._hass) this._update();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._svg && this._config) this._build();
    this._update();
  }

  getCardSize() { return 9; }
  getGridOptions() { return { columns: 12, rows: "auto", min_columns: 6 }; }

  /* ---------- Aufbau der Grafik (nur bei Konfigurationsänderung) ---------- */
  _build() {
    const c = this._config;
    if (!c) return;
    const u = this._uid;
    const has = (k) => !!c[k];
    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
    const ek = (k) => (k && has(k) ? ` data-entity-key="${k}"` : "");
    const type = ["radiator", "floor", "both"].includes(c.heating_type) ? c.heating_type : "radiator";

    /* Rohr mit Ummantelung (für saubere Kreuzungen) und optionalem Fluss */
    const pipe = (d, cls, flow) =>
      `<path class="casing" d="${d}"/><path class="pipe ${cls}" d="${d}"/>` +
      (flow ? `<path class="flow" data-on="${flow}" style="animation-duration:var(--${flow}-dur,1.2s)" d="${d}"/>` : "");
    const flowOnly = (d, flow) =>
      `<path class="flow" data-on="${flow}" style="animation-duration:var(--${flow}-dur,1.2s)" d="${d}"/>`;

    /* Richtungspfeil */
    const arrow = (x, y, dir, cls) => {
      const s = 8, rot = { r: 0, d: 90, l: 180, u: 270 }[dir];
      return `<path class="arrow ${cls}" transform="rotate(${rot} ${x} ${y})" d="M${x + s} ${y} L${x - s} ${y - s} L${x - s * 0.45} ${y} L${x - s} ${y + s} Z"/>`;
    };

    /* Pumpe: Kreis mit Dreieck in Flussrichtung, drehender Ring wenn aktiv */
    const pumpG = (cx, cy, r, dir, flag, key) => {
      const rot = { r: 0, d: 90, l: 180, u: 270 }[dir], t = r * 0.62;
      return `
      <g class="pump" data-on="${flag}"${ek(key)}>
        <circle class="p-ring" cx="${cx}" cy="${cy}" r="${r + 5}" style="transform-origin:${cx}px ${cy}px;animation-duration:var(--${flag}-dur,1s)"/>
        <circle class="p-body" cx="${cx}" cy="${cy}" r="${r}"/>
        <path class="p-tri" transform="rotate(${rot} ${cx} ${cy})" d="M${cx + t} ${cy} L${cx - t * 0.55} ${cy - t * 0.85} L${cx - t * 0.55} ${cy + t * 0.85} Z"/>
      </g>`;
    };

    const label = (key, x, y, prefix = "", anchor = "start") =>
      has(key)
        ? `<text x="${x}" y="${y}" text-anchor="${anchor}"${ek(key)}>${prefix ? `<tspan class="l">${prefix}</tspan>` : ""}<tspan class="v" data-val="${key}">–</tspan></text>`
        : "";
    const small = (key, x, y, anchor = "middle", prefix = "") =>
      has(key) ? `<text class="s" x="${x}" y="${y}" text-anchor="${anchor}"${ek(key)}>${prefix}<tspan data-val="${key}">–</tspan></text>` : "";

    const flake = (x, y, s) =>
      `<path class="flake" d="M${x} ${y - s} V${y + s} M${x - s * 0.866} ${y - s / 2} L${x + s * 0.866} ${y + s / 2} M${x - s * 0.866} ${y + s / 2} L${x + s * 0.866} ${y - s / 2}"/>`;
    const waves = (x0, w, y) => [0.2, 0.5, 0.8].map((f, n) =>
      `<path class="wave" style="animation-delay:${n * 0.6}s" d="M${x0 + w * f} ${y} q 6 -5 0 -10 q -6 -5 0 -10"/>`).join("");

    /* ===== Geometrie =====
       Speicher-Anschlüsse oben, gleichmäßig 24 px:
       490 RL-WP | 514 VL-WP | 538 WW warm | 562 Kaltwasser | 586 VL-Heizung | 610 RL-Heizung
       Leitungshöhen gleichmäßig 36 px: 170 / 206 (WP + WW), 242 / 278 (Heizung) */
    const PY = 300;
    let back = "", front = "";

    /* Primärkreis */
    back += pipe(`M220 368 V170 H514 V${PY}`, "hot", "primary");
    back += pipe(`M490 ${PY} V206 H256 V368`, "cold", "primary");
    front += arrow(367, 170, "r", "hot") + arrow(220, 268, "u", "hot") + arrow(373, 206, "l", "cold");

    /* Warmwasser */
    back += pipe(`M538 ${PY} V170 H872`, "hot");
    back += pipe(`M975 250 H830 V206`, "dw");
    back += pipe(`M872 206 H562 V${PY}`, "cold");
    front += arrow(690, 170, "r", "hot") + arrow(700, 206, "l", "cold") + arrow(910, 250, "l", "dw");
    if (has("circulation")) {
      back += pipe("M800 170 V206", "hot");
      back += flowOnly(`M538 ${PY} V170 H800 V206 H562 V${PY}`, "circ");
    }

    /* Heizkreise */
    const VX = 780, RX = 744, EX = 800, EW = 160;
    let zones, pumps = "", zoneSvg = "";
    if (type === "both") {
      zones = [
        { i: 1, kind: "radiator", y0: 318, h: 92, vin: 333, rout: 395 },
        { i: 2, kind: "floor", y0: 476, h: 80, vin: 496, rout: 536, loopEnd: 628 },
      ];
      // Rückläufe zuerst (VL kreuzt darüber)
      back += pipe(`M${EX} 536 H${RX} V395`, "cold", "z2");
      back += pipe(`M${EX} 395 H${RX}`, "cold", "z1");
      back += pipe(`M${RX} 395 V278 H610 V${PY}`, "cold", "zany");
      back += pipe(`M586 ${PY} V242 H${VX} V333`, "hot", "zany");
      back += pipe(`M${VX} 333 H${EX}`, "hot", "z1");
      back += pipe(`M${VX} 333 V496 H${EX}`, "hot", "z2");
      pumps += pumpG(RX, 345, 15, "u", "z1", has("zone1_pump") ? "zone1_pump" : has("zone1_pump_speed") ? "zone1_pump_speed" : null);
      pumps += small("zone1_pump_speed", RX - 26, 351, "end");
      pumps += pumpG(RX, 440, 15, "u", "z2", has("zone2_pump") ? "zone2_pump" : has("zone2_pump_speed") ? "zone2_pump_speed" : null);
      pumps += small("zone2_pump_speed", RX - 26, 446, "end");
      if (has("zone2_mixer")) {
        pumps += `<g${ek("zone2_mixer")}>
          <path class="mixer" d="M${VX - 9} 461 L${VX + 9} 485 L${VX - 9} 485 L${VX + 9} 461 Z M${VX} 473 L${VX - 15} 464 L${VX - 15} 482 Z"/></g>`;
        pumps += small("zone2_mixer", RX - 26, 480, "end");
      }
    } else {
      const z = type === "floor"
        ? { i: 1, kind: "floor", y0: 330, h: 120, vin: 365, rout: 420, loopEnd: 610 }
        : { i: 1, kind: "radiator", y0: 330, h: 230, vin: 350, rout: 540 };
      zones = [z];
      back += pipe(`M${EX} ${z.rout} H${RX} V278 H610 V${PY}`, "cold", "z1");
      back += pipe(`M586 ${PY} V242 H${VX} V${z.vin} H${EX}`, "hot", "z1");
      const py = Math.round((278 + z.rout) / 2) + 10;
      pumps += pumpG(RX, py, 16, "u", "z1", has("zone1_pump") ? "zone1_pump" : has("zone1_pump_speed") ? "zone1_pump_speed" : null);
      pumps += small("zone1_pump_speed", RX - 28, py + 6, "end");
    }
    front += arrow(683, 242, "r", "hot") + arrow(VX, 300, "d", "hot") + arrow(677, 278, "l", "cold");

    zones.forEach((z) => {
      const k = `z${z.i}`, p = `zone${z.i}_`;
      let em = "";
      if (z.kind === "radiator") {
        let cols = "";
        for (let x = EX + 9; x <= EX + EW - 18; x += 13) cols += `<rect class="r-col" x="${x}" y="${z.y0 + 10}" width="10" height="${z.h - 20}" rx="5"/>`;
        em = `
          <rect class="r-back" x="${EX}" y="${z.y0}" width="${EW}" height="${z.h}" rx="6"/>
          <rect class="r-bar" x="${EX + 2}" y="${z.y0 + 3}" width="${EW - 4}" height="8" rx="4"/>
          <rect class="r-bar" x="${EX + 2}" y="${z.y0 + z.h - 11}" width="${EW - 4}" height="8" rx="4"/>
          ${cols}
          <rect class="r-bar" x="${EX + EW - 2}" y="${z.y0 + 6}" width="12" height="9" rx="3"/>
          <rect class="glow" x="${EX}" y="${z.y0}" width="${EW}" height="${z.h}" rx="6"/>
          ${waves(EX, EW, z.y0 - 6)}`;
      } else {
        let caps = "", heads = "", loops = "", flows = "";
        const yb = z.y0 + z.h;
        for (let n = 0; n < 5; n++) {
          const xv = EX + 26 + n * 27;
          caps += `<rect class="bar-h" x="${xv - 4}" y="${z.vin - 17}" width="8" height="11" rx="2"/>`;
          heads += `<rect class="vhead" x="${xv - 6}" y="${z.rout - 21}" width="12" height="14" rx="3"/>`;
          const xl = EX + 20 + n * 28, w = 14, bot = z.loopEnd;
          loops += `<path class="loop-h" d="M${xl} ${yb} V${bot - w / 2}"/><path class="loop-c" d="M${xl + w} ${bot - w / 2} V${yb}"/>`;
          loops += `<path class="loop-h" d="M${xl} ${bot - w / 2} A ${w / 2} ${w / 2} 0 0 0 ${xl + w / 2} ${bot}"/><path class="loop-c" d="M${xl + w / 2} ${bot} A ${w / 2} ${w / 2} 0 0 0 ${xl + w} ${bot - w / 2}"/>`;
          flows += `<path class="flow" data-on="${k}" style="animation-duration:var(--${k}-dur,1.2s)" d="M${xl} ${yb} V${bot - w / 2} A ${w / 2} ${w / 2} 0 0 0 ${xl + w} ${bot - w / 2} V${yb}"/>`;
        }
        em = `
          ${loops}${flows}
          <rect class="cab" x="${EX}" y="${z.y0}" width="${EW}" height="${z.h}" rx="4"/>
          <rect class="cab-in" x="${EX + 6}" y="${z.y0 + 6}" width="${EW - 12}" height="${z.h - 12}" rx="3"/>
          <rect class="bar-h" x="${EX + 8}" y="${z.vin - 6}" width="${EW - 16}" height="12" rx="6"/>
          <rect class="bar-c" x="${EX + 8}" y="${z.rout - 6}" width="${EW - 16}" height="12" rx="6"/>
          ${caps}${heads}
          <rect class="glow" x="${EX}" y="${z.y0}" width="${EW}" height="${z.h}" rx="4"/>`;
      }
      const name = esc(c[p + "name"] || (z.kind === "radiator" ? "Heizkörper" : "Fußbodenheizung"));
      const temps = [
        has(p + "vl_temp") ? `<tspan class="l">VL </tspan><tspan data-val="${p}vl_temp"${ek(p + "vl_temp")}>–</tspan>` : "",
        has(p + "rl_temp") ? `<tspan class="l">RL </tspan><tspan data-val="${p}rl_temp"${ek(p + "rl_temp")}>–</tspan>` : "",
      ].filter(Boolean).join(`<tspan class="l">  ·  </tspan>`);
      const compact = type === "both" && z.i === 1;
      const ny = compact ? 432 : 662;
      const zoneKey = has(p + "pump") ? p + "pump" : has(p + "pump_speed") ? p + "pump_speed" : null;
      zoneSvg += `
        <g class="emitter" data-on="${k}"${ek(zoneKey)}>${em}</g>
        <text class="name" x="${EX + EW / 2}" y="${ny}" text-anchor="middle"${compact ? ' style="font-size:20px"' : ""}>${name}</text>
        ${temps ? `<text class="ztemp" x="${EX + EW / 2}" y="${ny + (compact ? 21 : 24)}"${compact ? ' style="font-size:16px"' : ""} text-anchor="middle">${temps}</text>` : ""}`;
    });

    /* Außengerät (3D) */
    let louvers = "";
    for (let y = 392; y <= 600; y += 10) louvers += `<line class="louver" x1="48" y1="${y}" x2="232" y2="${y}"/>`;
    const blades = [0, 120, 240].map((a) =>
      `<path d="M135 495 C126 462 137 430 166 425 C180 449 165 479 135 495Z" transform="rotate(${a} 135 495)"/>`).join("");
    const unit = `
      <g${ek("compressor")}>
        <rect class="u-foot" x="62" y="606" width="34" height="14" rx="3"/>
        <rect class="u-foot" x="252" y="606" width="34" height="14" rx="3"/>
        <path class="u-side" d="M310 380 L332 360 V588 L310 610 Z"/>
        <path class="u-top" d="M40 380 L62 360 H332 L310 380 Z"/>
        <rect class="u-front" x="40" y="380" width="270" height="230" rx="5"/>
        ${louvers}
        <circle class="fan-bezel" cx="135" cy="495" r="84"/>
        <circle class="fan-bg" cx="135" cy="495" r="75"/>
        <g class="fan" data-on="fan"><g class="blades" style="transform-origin:135px 495px">${blades}</g></g>
        <circle class="fan-hub" cx="135" cy="495" r="12"/>
        <circle class="grille" cx="135" cy="495" r="30"/><circle class="grille" cx="135" cy="495" r="52"/><circle class="grille" cx="135" cy="495" r="72"/>
        <path class="grille" d="M60 495 H210 M135 420 V570"/>
        <rect class="u-cut" x="240" y="392" width="62" height="206" rx="4"/>
        <path class="copper" d="M258 470 V425 Q258 410 272 410 H290 M282 470 V440 Q282 430 292 430"/>
        <g class="compressor" data-on="compressor">
          <rect class="comp-glow" x="246" y="466" width="44" height="122" rx="16" filter="url(#${u}-blur)"/>
          <rect class="comp" x="250" y="470" width="36" height="114" rx="14"/>
          <path class="copper" d="M262 500 H274"/>
        </g>
        <g class="defrost" data-on="defrost">
          <rect class="frost" x="40" y="380" width="270" height="230" rx="5"/>
          ${flake(86, 432, 11)}${flake(190, 450, 9)}${flake(104, 562, 9)}${flake(178, 548, 12)}${flake(271, 420, 8)}
          ${[80, 135, 190, 270].map((x, n) => `<circle class="drip" cx="${x}" cy="622" r="3.5" style="animation-delay:${n * 0.35}s"/>`).join("")}
        </g>
      </g>`;

    /* Speicher mit Innengerät */
    let coilF = "", coilB = "";
    for (let y = 410; y <= 584; y += 11) {
      coilB += `M490 ${y} A 50 7 0 0 1 590 ${y} `;
      coilF += `M490 ${y} A 50 7 0 0 0 590 ${y} `;
    }
    const ports = [490, 514, 538, 562, 586, 610].map((x) => `<rect class="port" x="${x - 6}" y="${PY - 6}" width="12" height="8" rx="2"/>`).join("");
    const tank = `
      <rect class="t-body" x="460" y="372" width="180" height="250" rx="16"/>
      <rect class="t-cut" x="476" y="394" width="148" height="208" rx="10"/>
      <rect class="t-heat" x="476" y="394" width="148" height="208" rx="10" fill="url(#${u}-tank)"/>
      <line class="t-pipe" x1="540" y1="400" x2="540" y2="592"/>
      <path class="coil-back" d="${coilB}"/>
      <path class="coil" d="${coilF}"/>
      ${has("heater_rod") ? `
      <g class="heater" data-on="heater_rod"${ek("heater_rod")}>
        <rect class="rod-glow" x="599" y="384" width="18" height="186" rx="9" filter="url(#${u}-blur)"/>
        <rect class="rod" x="604" y="380" width="8" height="182" rx="4"/>
      </g>` : ""}
      <rect class="t-head" x="460" y="${PY}" width="180" height="82" rx="12"/>
      ${ports}
      <rect class="t-display" x="474" y="314" width="94" height="48" rx="5"/>
      <g class="leds" data-on="compressor">
        <rect class="led" x="484" y="324" width="40" height="5" rx="2"/>
        <rect class="led" x="484" y="335" width="56" height="5" rx="2"/>
        <rect class="led" x="484" y="346" width="28" height="5" rx="2"/>
        <rect class="led" x="548" y="324" width="12" height="12" rx="3"/>
      </g>
      ${has("zone1_mixer") ? `<g${ek("zone1_mixer")}>
        <path class="mixer" d="M591 322 L615 338 L615 322 L591 338 Z M603 330 L595 345 L611 345 Z"/>
        <text class="s" x="603" y="372" text-anchor="middle"><tspan data-val="zone1_mixer">–</tspan></text></g>` : ""}`;

    /* Zapfstelle */
    const tap = `
      <rect class="tap-body" x="866" y="160" width="22" height="56" rx="6"/>
      <path class="tap-h" d="M877 160 V140 M862 140 H892"/>
      <path class="tap" d="M888 176 H906 Q922 176 922 192 V212"/>
      <text class="l" x="975" y="278" text-anchor="end">von Enthärtung</text>`;

    /* Status-Chips (eine Zeile) */
    const chipDefs = [
      ["compressor", "Verdichter", "#22c55e"], ["defrost", "Abtauen", "#38bdf8"],
      ["dhw_active", "Warmwasser", "#f59e0b"], ["dhw_boost", "Überhöhung", "#ef4444"],
      ["heater_rod", "Heizstab", "#f97316"], ["circulation", "Zirkulation", "#a78bfa"],
    ].filter(([k]) => has(k));
    const CW = 138, CG = 14;
    const cx0 = 500 - (chipDefs.length * CW + (chipDefs.length - 1) * CG) / 2;
    const chipY = 704;
    const chips = chipDefs.map(([k, t, col], n) => {
      const x = cx0 + n * (CW + CG);
      return `<g class="chip" data-on="${k}"${ek(k)} style="--chip-c:${col}">
        <rect x="${x}" y="${chipY}" width="${CW}" height="34" rx="17"/>
        <circle cx="${x + 19}" cy="${chipY + 17}" r="5.5"/>
        <text x="${x + 33}" y="${chipY + 23}">${t}</text></g>`;
    }).join("");

    /* Untere Leiste */
    const bottomKeys = ["power", "heat_power", "cop", "mode"].filter(has);
    const statY = chipDefs.length ? 754 : 700;
    const H = bottomKeys.length ? statY + 72 : chipDefs.length ? 750 : 700;
    const statNames = { power: "Strom", heat_power: "Wärme", cop: "COP", mode: "Modus" };
    const gap = 12, bw = bottomKeys.length ? (940 - gap * (bottomKeys.length - 1)) / bottomKeys.length : 0;
    const stats = bottomKeys.map((k, n) => {
      const x = 30 + n * (bw + gap);
      return `<g class="stat"${ek(k)}>
        <rect x="${x}" y="${statY}" width="${bw}" height="62" rx="12"/>
        <text class="l" x="${x + bw / 2}" y="${statY + 24}" text-anchor="middle">${statNames[k]}</text>
        <text class="v" x="${x + bw / 2}" y="${statY + 52}" text-anchor="middle" data-val="${k}">–</text></g>`;
    }).join("");

    /* Texte */
    const texts = `
      ${c.title ? `<text class="title" x="500" y="62" text-anchor="middle">${esc(c.title)}</text>` : ""}
      ${label("indoor_temp", 40, 125, "Innen  ")}
      ${label("outdoor_temp", 40, 165, "Außen  ")}
      <text class="l" x="367" y="102" text-anchor="middle">Primärkreis</text>
      <text class="l" x="367" y="124" text-anchor="middle">(Wärmepumpe)</text>
      ${label("pressure", 367, 155, "", "middle")}
      ${label("vl_temp", 206, 338, "VL ", "end")}
      ${label("rl_temp", 282, 352, "RL ", "start")}
      ${small("pump_speed", 284, 306, "start")}
      <text class="l" x="705" y="102" text-anchor="middle">Brauchwasserkreis</text>
      ${has("dhw_temp") || has("dhw_setpoint") ? `<text x="705" y="152" text-anchor="middle">
        ${has("dhw_temp") ? `<tspan class="v" data-val="dhw_temp"${ek("dhw_temp")}>–</tspan>` : ""}
        ${has("dhw_setpoint") ? `<tspan class="l"${ek("dhw_setpoint")}>  Soll </tspan><tspan class="l" data-val="dhw_setpoint"${ek("dhw_setpoint")}>–</tspan>` : ""}
      </text>` : ""}
      ${label("tank_top_temp", 448, 440, "", "end")}
      ${label("tank_bottom_temp", 448, 592, "", "end")}
      <text class="name" x="175" y="662" text-anchor="middle">Außengerät</text>
      <text class="name" x="550" y="662" text-anchor="middle">Speicher</text>`;

    const primaryKey = has("pump") ? "pump" : has("pump_speed") ? "pump_speed" : null;

    this.shadowRoot.innerHTML = `
      <style>${HP_STYLE.replace(/UID/g, u)}</style>
      <ha-card class="${c.theme_background ? "themed" : ""}">
        <svg viewBox="0 0 1000 ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="${u}-tank" x1="0" y1="0" x2="0" y2="1">
              <stop id="${u}-top" offset="0" stop-color="#e5483e"/>
              <stop id="${u}-bot" offset="1" stop-color="#3f7fd9"/>
            </linearGradient>
            <linearGradient id="${u}-ufront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#eceef1"/><stop offset="1" stop-color="#cdd2d8"/>
            </linearGradient>
            <linearGradient id="${u}-tbody" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#d7dbe0"/><stop offset=".35" stop-color="#f7f8fa"/><stop offset="1" stop-color="#c9ced5"/>
            </linearGradient>
            <linearGradient id="${u}-chrome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#eef1f4"/><stop offset=".5" stop-color="#9aa3ae"/><stop offset="1" stop-color="#d5dae0"/>
            </linearGradient>
            <filter id="${u}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
          </defs>
          ${back}
          ${front}
          ${unit}
          ${tank}
          ${tap}
          ${zoneSvg}
          ${pumpG(256, 300, 16, "d", "primary", primaryKey)}
          ${has("circulation") ? pumpG(800, 188, 10, "d", "circ", "circulation") : ""}
          ${pumps}
          ${texts}
          ${chips}
          ${stats}
        </svg>
      </ha-card>`;

    this._svg = this.shadowRoot.querySelector("svg");
    this._flagEls = [...this.shadowRoot.querySelectorAll("[data-on]")];
    this._valEls = [...this.shadowRoot.querySelectorAll("[data-val]")];
    this._stopTop = this.shadowRoot.getElementById(`${u}-top`);
    this._stopBot = this.shadowRoot.getElementById(`${u}-bot`);
    this._entityIds = Object.keys(c).filter((k) => !HP_NON_ENTITY_KEYS.includes(k) && typeof c[k] === "string").map((k) => c[k]);
    this._last = null;

    this._svg.addEventListener("click", (ev) => {
      const el = ev.target.closest("[data-entity-key]");
      const id = el && this._config[el.dataset.entityKey];
      if (!id) return;
      const e = new Event("hass-more-info", { bubbles: true, composed: true });
      e.detail = { entityId: id };
      this.dispatchEvent(e);
    });
  }

  /* ---------- Werte & Animationen aktualisieren ---------- */
  _update() {
    const h = this._hass, c = this._config;
    if (!h || !c || !this._svg) return;

    const cur = this._entityIds.map((id) => h.states[id]);
    if (this._last && cur.length === this._last.length && cur.every((s, n) => s === this._last[n])) return;
    this._last = cur;

    const st = (k) => (c[k] ? h.states[c[k]] : undefined);
    const num = (k) => { const s = st(k); const n = s ? parseFloat(s.state) : NaN; return isNaN(n) ? null : n; };
    const on = (k) => {
      const s = st(k);
      if (!s) return false;
      const v = String(s.state).toLowerCase();
      if (HP_ON_STATES.includes(v)) return true;
      const n = parseFloat(v);
      return !isNaN(n) && n > 0;
    };
    const pct = (k) => {
      const s = st(k), n = num(k);
      if (n === null) return null;
      const unit = s.attributes && s.attributes.unit_of_measurement;
      if (unit === "%") return Math.min(1, Math.max(0, n / 100));
      return n > 0 ? 0.6 : 0;
    };
    const dur = (p) => (p === null ? 1.2 : Math.max(0.35, 1.8 - 1.4 * p)).toFixed(2) + "s";

    const primary = c.pump ? on("pump") : c.pump_speed ? (num("pump_speed") || 0) > 0 : on("compressor");
    const zoneOn = (i) => {
      const p = `zone${i}_`;
      if (c[p + "pump"]) return on(p + "pump");
      if (c[p + "pump_speed"]) return (num(p + "pump_speed") || 0) > 0;
      return primary && !on("dhw_active");
    };
    const z1 = zoneOn(1), z2 = c.heating_type === "both" ? zoneOn(2) : false;

    const flags = {
      compressor: on("compressor"),
      defrost: on("defrost"),
      fan: on("compressor") && !on("defrost"),
      primary, z1, z2, zany: z1 || z2,
      circ: on("circulation"),
      circulation: on("circulation"),
      heater_rod: on("heater_rod"),
      dhw_active: on("dhw_active"),
      dhw_boost: on("dhw_boost"),
    };
    this._flagEls.forEach((el) => el.classList.toggle("on", !!flags[el.dataset.on]));
    this._valEls.forEach((el) => { el.textContent = this._fmt(c[el.dataset.val]); });

    const s = this._svg.style;
    const zd1 = dur(pct("zone1_pump_speed")), zd2 = dur(pct("zone2_pump_speed"));
    s.setProperty("--primary-dur", dur(pct("pump_speed")));
    s.setProperty("--z1-dur", zd1);
    s.setProperty("--z2-dur", zd2);
    s.setProperty("--zany-dur", z1 ? zd1 : zd2);
    s.setProperty("--circ-dur", "1.2s");

    const col = (t) => {
      if (t === null) return null;
      const x = Math.min(1, Math.max(0, (t - 20) / 38));
      return `hsl(${Math.round(215 + 145 * x) % 360}, 75%, 52%)`;
    };
    const top = col(num("tank_top_temp") ?? num("dhw_temp"));
    const bot = col(num("tank_bottom_temp"));
    if (this._stopTop && top) this._stopTop.setAttribute("stop-color", top);
    if (this._stopBot && bot) this._stopBot.setAttribute("stop-color", bot);
  }

  _fmt(id) {
    const h = this._hass;
    const s = id && h.states[id];
    if (!s) return "n/a";
    if (s.state === "unavailable" || s.state === "unknown") return "–";
    if (typeof h.formatEntityState === "function") {
      try { return h.formatEntityState(s); } catch (e) { /* Fallback unten */ }
    }
    const n = parseFloat(s.state);
    const unit = (s.attributes && s.attributes.unit_of_measurement) || "";
    if (!isNaN(n) && /^-?\d+(\.\d+)?$/.test(String(s.state).trim())) {
      return `${Math.round(n * 10) / 10}${unit ? " " + unit : ""}`;
    }
    return s.state + (unit ? " " + unit : "");
  }
}

/* ---------- Visueller Editor ---------- */
class HeatpumpFlowCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
  }

  _schema() {
    const e = (name) => ({ name, selector: { entity: {} } });
    const both = this._config.heating_type === "both";
    const zone = (i) => ({
      type: "expandable", name: `sec_zone${i}`, flatten: true,
      title: `Heizkreis ${i}` + (both ? (i === 1 ? " (Heizkörper)" : " (Fußbodenheizung)") : ""),
      schema: [
        { name: `zone${i}_name`, selector: { text: {} } },
        e(`zone${i}_vl_temp`), e(`zone${i}_rl_temp`), e(`zone${i}_pump`), e(`zone${i}_pump_speed`),
        ...(i === 1 ? [] : [e(`zone${i}_mixer`)]),
      ],
    });
    const schema = [
      { name: "title", selector: { text: {} } },
      {
        name: "heating_type",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "radiator", label: "Heizkörper" },
              { value: "floor", label: "Fußbodenheizung" },
              { value: "both", label: "Heizkörper + Fußbodenheizung (2 Heizkreise)" },
            ],
          },
        },
      },
      { name: "theme_background", selector: { boolean: {} } },
      {
        type: "expandable", name: "sec_hp", flatten: true, title: "Wärmepumpe (Außengerät & Primärkreis)",
        schema: ["outdoor_temp", "indoor_temp", "compressor", "defrost", "vl_temp", "rl_temp", "pump", "pump_speed", "pressure"].map(e),
      },
      {
        type: "expandable", name: "sec_dhw", flatten: true, title: "Speicher, Innengerät & Warmwasser",
        schema: ["dhw_temp", "dhw_setpoint", "tank_top_temp", "tank_bottom_temp", "zone1_mixer", "dhw_active", "dhw_boost", "heater_rod", "circulation"].map(e),
      },
      {
        type: "expandable", name: "sec_energy", flatten: true, title: "Energie & Status (untere Leiste)",
        schema: ["power", "heat_power", "cop", "mode"].map(e),
      },
      zone(1),
    ];
    if (both) schema.push(zone(2));
    return schema;
  }

  _render() {
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => HP_LABELS[s.name] || s.title || s.name;
      this._form.computeHelper = (s) => HP_HELPERS[s.name];
      this._form.addEventListener("value-changed", (ev) => {
        const cfg = { ...ev.detail.value };
        Object.keys(cfg).forEach((k) => { if (cfg[k] === "" || cfg[k] === null || cfg[k] === undefined) delete cfg[k]; });
        this._config = cfg;
        const e = new Event("config-changed", { bubbles: true, composed: true });
        e.detail = { config: cfg };
        this.dispatchEvent(e);
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.data = this._config;
    this._form.schema = this._schema();
  }
}

if (!customElements.get("heatpump-flow-card")) customElements.define("heatpump-flow-card", HeatpumpFlowCard);
if (!customElements.get("heatpump-flow-card-editor")) customElements.define("heatpump-flow-card-editor", HeatpumpFlowCardEditor);

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "heatpump-flow-card")) {
  window.customCards.push({
    type: "heatpump-flow-card",
    name: "Wärmepumpen Flow Card",
    description: "Animierte Wärmepumpen-Anlage mit Speicher, Warmwasser, Heizkörper und/oder Fußbodenheizung",
    preview: true,
  });
}

console.info(`%c WÄRMEPUMPEN-FLOW-CARD %c v${HP_VERSION} `, "color:#fff;background:#d8463c;font-weight:700", "color:#d8463c;background:#fff");
