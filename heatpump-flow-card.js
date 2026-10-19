/*
 * Wärmepumpen Flow Card für Home Assistant
 * Animierte Anlagenansicht: Außengerät, Speicher, Warmwasser, Heizkörper / FBH
 * Primär entworfen für Daikin Altherma 4 mit ECH2O-Speicher, nutzbar für jede Wärmepumpe.
 *
 * Installation: Datei nach /config/www/ kopieren und als Ressource
 * "/local/heatpump-flow-card.js" (JavaScript-Modul) eintragen.
 */

const HP_VERSION = "1.0.0";

const HP_LABELS = {
  title: "Titel (leer = kein Titel)",
  heating_type: "Wärmeverteilung",
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
  zone1_mixer: "Mischerstellung Heizkreis 1",
  zone2_vl_temp: "Vorlauftemperatur Heizkreis 2",
  zone2_rl_temp: "Rücklauftemperatur Heizkreis 2",
  zone2_pump: "Heizkreis 2 aktiv / Pumpe läuft",
  zone2_pump_speed: "Pumpe Heizkreis 2 Leistung (%)",
  zone2_mixer: "Mischerstellung Heizkreis 2",
};

const HP_HELPERS = {
  pump_speed: "Steuert auch die Geschwindigkeit der Pumpen- und Rohranimation",
  zone1_pump: "Leer lassen: Heizkreis gilt als aktiv, wenn die Umwälzpumpe läuft und keine Brauchwasserbereitung aktiv ist",
  zone2_pump: "Leer lassen: Heizkreis gilt als aktiv, wenn die Umwälzpumpe läuft und keine Brauchwasserbereitung aktiv ist",
};

const HP_NON_ENTITY_KEYS = ["type", "title", "heating_type", "zone1_name", "zone2_name"];

const HP_ON_STATES = ["on", "true", "running", "heating", "an", "ein", "aktiv", "active", "open", "yes", "1"];

const HP_STYLE = `
  :host { display: block; }
  ha-card { overflow: hidden; padding: 8px; box-sizing: border-box; height: 100%;
    display: flex; align-items: center; justify-content: center; }
  svg { width: 100%; height: auto; display: block;
    max-height: calc(100vh - var(--header-height, 56px) - 24px);
    font-family: var(--ha-font-family-body, var(--paper-font-body1_-_font-family, Roboto, sans-serif)); }
  text { fill: var(--primary-text-color, #e5e7eb); }
  .title { font-size: 34px; font-weight: 500; }
  .v { font-size: 25px; font-weight: 600; }
  .l { font-size: 17px; fill: var(--secondary-text-color, #9ca3af); font-weight: 400; }
  .s { font-size: 16px; fill: var(--secondary-text-color, #9ca3af); }
  .zname { font-size: 18px; font-weight: 600; }
  .ztemp { font-size: 18px; }
  [data-entity-key] { cursor: pointer; }

  .pipe { fill: none; stroke-width: 8; stroke-linecap: round; stroke-linejoin: round; }
  .pipe.thin { stroke-width: 6; }
  .pipe.hot { stroke: var(--hp-hot-color, #e2483d); }
  .pipe.cold { stroke: var(--hp-cold-color, #3b82f6); }
  .pipe.dw { stroke: #60a5fa; opacity: .75; }
  .pipe.mix { stroke: #a855f7; stroke-width: 4; stroke-dasharray: 5 5; }
  .flow { fill: none; stroke: rgba(255,255,255,.9); stroke-width: 3; stroke-linecap: round;
    stroke-dasharray: 2 16; opacity: 0; transition: opacity .5s; }
  .flow.on { opacity: 1; animation-name: hp-dash; animation-timing-function: linear;
    animation-iteration-count: infinite; }
  @keyframes hp-dash { to { stroke-dashoffset: -18; } }
  @keyframes hp-spin { to { transform: rotate(360deg); } }
  @keyframes hp-pulse { 0%,100% { opacity: .45; } 50% { opacity: 1; } }
  @keyframes hp-drip { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: 1; }
    100% { transform: translateY(30px); opacity: 0; } }
  @keyframes hp-rise { 0% { transform: translateY(6px); opacity: 0; } 40% { opacity: .9; }
    100% { transform: translateY(-10px); opacity: 0; } }

  /* Außengerät */
  .unit-body { fill: #d9dde3; stroke: #9aa3ae; stroke-width: 2; }
  .unit-side { fill: #2b3038; }
  .unit-foot { fill: #6b7280; }
  .fan-ring { fill: #c3c8cf; }
  .fan-bg { fill: #1f242b; }
  .blades path { fill: #5b6573; }
  .fan.on .blades { animation: hp-spin .8s linear infinite; }
  .fan.on .blades path { fill: #7b8796; }
  .fan-hub { fill: #9aa3ae; }
  .grille { fill: none; stroke: rgba(255,255,255,.18); stroke-width: 2; }
  .comp { fill: #4b5563; transition: fill .4s; }
  .comp-pipe { fill: none; stroke: #b87333; stroke-width: 4; }
  .comp-glow { fill: #22c55e; opacity: 0; transition: opacity .4s; }
  .compressor.on .comp { fill: #16a34a; }
  .compressor.on .comp-glow { animation: hp-pulse 1.6s ease-in-out infinite; }
  .defrost { opacity: 0; transition: opacity .6s; pointer-events: none; }
  .defrost.on { opacity: 1; }
  .frost { fill: #bae6fd; opacity: .45; }
  .defrost.on .frost { animation: hp-pulse 2.2s ease-in-out infinite; }
  .flake { fill: none; stroke: #f0f9ff; stroke-width: 2.5; stroke-linecap: round; }
  .drip { fill: #7dd3fc; opacity: 0; }
  .defrost.on .drip { animation: hp-drip 1.4s ease-in infinite; }

  /* Speicher */
  .tank-body { fill: #e5e7eb; stroke: #9aa3ae; stroke-width: 2; }
  .tank-inner { stroke: rgba(0,0,0,.25); stroke-width: 1.5; }
  .tank-head { fill: #2b3038; stroke: #4b5563; stroke-width: 2; }
  .tank-display { fill: #0b0f14; stroke: #374151; }
  .led { fill: #374151; transition: fill .4s; }
  .leds.on .led { fill: #22d3ee; }
  .coil { fill: none; stroke: #b87333; stroke-width: 3; stroke-linejoin: round; opacity: .75; }
  .heater-rod { fill: #6b7280; stroke: #374151; stroke-width: 1; transition: fill .4s; }
  .heater-glow { fill: #f97316; opacity: 0; }
  .heater.on .heater-rod { fill: #f97316; }
  .heater.on .heater-glow { animation: hp-pulse 1.2s ease-in-out infinite; }
  .in-tank { fill: #fff; font-size: 23px; font-weight: 600; paint-order: stroke;
    stroke: rgba(0,0,0,.55); stroke-width: 4px; stroke-linejoin: round; }
  .in-tank-l { fill: #fff; font-size: 15px; paint-order: stroke; stroke: rgba(0,0,0,.55); stroke-width: 3px; }

  /* Pumpen / Mischer */
  .pump-body { fill: var(--card-background-color, #1c1c1c); stroke: #94a3b8; stroke-width: 3; transition: stroke .4s; }
  .impeller path { fill: none; stroke: #94a3b8; stroke-width: 3; stroke-linecap: round; transition: stroke .4s; }
  .pump-hub { fill: #94a3b8; }
  .pump-glow { fill: #22c55e; opacity: 0; transition: opacity .4s; }
  .pump.on .pump-body, .pump.on .impeller path { stroke: #22c55e; }
  .pump.on .pump-hub { fill: #22c55e; }
  .pump.on .pump-glow { opacity: .35; }
  .pump.on .impeller { animation-name: hp-spin; animation-timing-function: linear; animation-iteration-count: infinite; }
  .mixer { fill: #a855f7; stroke: #6b21a8; stroke-width: 1.5; stroke-linejoin: round; }

  /* Wärmeübergabe */
  .rad-body { fill: #d9dde3; stroke: #9aa3ae; stroke-width: 2; }
  .rad-fin { fill: #eef0f3; stroke: #b6bdc6; stroke-width: 1; }
  .emit-glow { fill: #f97316; opacity: 0; transition: opacity .8s; }
  .emitter.on .emit-glow { opacity: .28; }
  .wave { fill: none; stroke: #f97316; stroke-width: 3; stroke-linecap: round; opacity: 0; }
  .emitter.on .wave { animation: hp-rise 2.4s ease-in-out infinite; }
  .manifold { fill: #9aa3ae; stroke: #6b7280; stroke-width: 1.5; }
  .slab { fill: #8b7d6b; opacity: .35; stroke: #8b7d6b; stroke-width: 1.5; }
  .loop { fill: none; stroke-width: 5; stroke-linecap: round; stroke-linejoin: round; }

  .tap { fill: none; stroke: #b6bdc6; stroke-width: 9; stroke-linecap: round; stroke-linejoin: round; }
  .tap-h { fill: none; stroke: #9aa3ae; stroke-width: 5; stroke-linecap: round; }

  /* Status-Chips & Leiste */
  .chip rect { fill: none; stroke: var(--divider-color, rgba(127,127,127,.4)); stroke-width: 1.5; transition: all .4s; }
  .chip circle { fill: var(--disabled-text-color, #6b7280); transition: fill .4s; }
  .chip text { font-size: 15px; fill: var(--secondary-text-color, #9ca3af); }
  .chip.on rect { fill: var(--chip-c); fill-opacity: .18; stroke: var(--chip-c); }
  .chip.on circle { fill: var(--chip-c); animation: hp-pulse 1.4s ease-in-out infinite; }
  .chip.on text { fill: var(--primary-text-color, #fff); }
  .stat rect { fill: rgba(127,127,127,.12); stroke: var(--divider-color, rgba(127,127,127,.25)); }
`;

class HeatpumpFlowCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._uid = "hp" + Math.random().toString(36).slice(2, 8);
  }

  static getConfigElement() {
    return document.createElement("heatpump-flow-card-editor");
  }

  static getStubConfig() {
    return { title: "Wärmepumpe", heating_type: "radiator" };
  }

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

  getCardSize() {
    return 8;
  }

  getGridOptions() {
    return { columns: 12, rows: "auto", min_columns: 6 };
  }

  /* ---------- Aufbau der Grafik (nur bei Konfigurationsänderung) ---------- */
  _build() {
    const c = this._config;
    if (!c) return;
    const u = this._uid;
    const has = (k) => !!c[k];
    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
    const ek = (k) => (k && has(k) ? ` data-entity-key="${k}"` : "");

    const type = ["radiator", "floor", "both"].includes(c.heating_type) ? c.heating_type : "radiator";
    const zones = type === "both"
      ? [
          { i: 1, kind: "radiator", ey: 275, eh: 105, v: 295, r: 360, ty: 404 },
          { i: 2, kind: "floor", ey: 470, eh: 105, v: 490, r: 555, ty: 599 },
        ]
      : [{ i: 1, kind: type, ey: 330, eh: 170, v: 360, r: 470, ty: 528 }];

    const bottomKeys = ["power", "heat_power", "cop", "mode"].filter(has);
    const H = bottomKeys.length ? 720 : 645;

    const pipe = (d, cls, flow) =>
      `<path class="pipe ${cls}" d="${d}"/>` +
      (flow ? `<path class="flow" data-on="${flow}" style="animation-duration:var(--${flow}-dur,1.2s)" d="${d}"/>` : "");

    const label = (key, x, y, prefix = "", anchor = "start", cls = "v") =>
      has(key)
        ? `<text x="${x}" y="${y}" text-anchor="${anchor}"${ek(key)}>${prefix ? `<tspan class="l">${prefix}</tspan>` : ""}<tspan class="${cls}" data-val="${key}">–</tspan></text>`
        : "";

    const pumpG = (cx, cy, r, flag, key) => `
      <g class="pump" data-on="${flag}"${ek(key)}>
        <circle class="pump-glow" cx="${cx}" cy="${cy}" r="${r + 5}" filter="url(#${u}-blur)"/>
        <circle class="pump-body" cx="${cx}" cy="${cy}" r="${r}"/>
        <g class="impeller" style="transform-origin:${cx}px ${cy}px;animation-duration:var(--${flag}-dur,1s)">
          ${[0, 90, 180, 270].map((a) => `<path d="M${cx} ${cy} q ${r * 0.55} ${-r * 0.12} ${r * 0.68} ${-r * 0.68}" transform="rotate(${a} ${cx} ${cy})"/>`).join("")}
        </g>
        <circle class="pump-hub" cx="${cx}" cy="${cy}" r="${(r * 0.2).toFixed(1)}"/>
      </g>`;

    const chip = (x, y, w, key, text, color) => `
      <g class="chip" data-on="${key}"${ek(key)} style="--chip-c:${color}">
        <rect x="${x}" y="${y}" width="${w}" height="32" rx="16"/>
        <circle cx="${x + 17}" cy="${y + 16}" r="5"/>
        <text x="${x + 29}" y="${y + 21}">${text}</text>
      </g>`;

    const flake = (x, y, s) =>
      `<path class="flake" d="M${x} ${y - s} V${y + s} M${x - s * 0.866} ${y - s / 2} L${x + s * 0.866} ${y + s / 2} M${x - s * 0.866} ${y + s / 2} L${x + s * 0.866} ${y - s / 2}"/>`;

    const waves = (x0, w, y) =>
      [0.22, 0.5, 0.78].map((f, n) => {
        const x = x0 + w * f;
        return `<path class="wave" style="animation-delay:${n * 0.6}s" d="M${x} ${y} q 6 -5 0 -10 q -6 -5 0 -10"/>`;
      }).join("");

    /* --- Rohrleitungen Primärkreis --- */
    let pipes = "";
    pipes += pipe("M200 330 V170 H540 V250", "hot", "primary");
    pipes += pipe("M480 250 V210 H265 V330", "cold", "primary");

    /* --- Warmwasser --- */
    pipes += pipe("M570 250 V140 H880", "hot thin");
    pipes += pipe("M985 190 H600 V250", "dw thin");
    if (has("circulation")) {
      pipes += pipe("M830 140 V190", "hot thin");
      pipes += `<path class="flow" data-on="circ" style="animation-duration:var(--circ-dur,1.2s)" d="M570 250 V140 H830 V190 H600 V250"/>`;
    }

    /* --- Heizkreise --- */
    const ex = 780, ew = 190;
    let zoneSvg = "";
    zones.forEach((z) => {
      const k = `z${z.i}`, p = `zone${z.i}_`;
      pipes += pipe(`M620 ${z.v} H${ex}`, "hot", k);
      pipes += pipe(`M${ex} ${z.r} H620`, "cold", k);
      if (has(p + "mixer")) pipes += `<path class="pipe mix" d="M670 ${z.v + 14} V${z.r}"/>`;

      let em = "";
      if (z.kind === "radiator") {
        let fins = "";
        for (let x = ex + 10; x <= ex + ew - 20; x += 15) fins += `<rect class="rad-fin" x="${x}" y="${z.ey + 8}" width="10" height="${z.eh - 16}" rx="4"/>`;
        em = `
          <rect class="rad-body" x="${ex}" y="${z.ey}" width="${ew}" height="${z.eh}" rx="7"/>
          ${fins}
          <rect class="emit-glow" x="${ex}" y="${z.ey}" width="${ew}" height="${z.eh}" rx="7"/>
          ${waves(ex, ew, z.ey - 4)}`;
      } else {
        const rows = z.eh > 150 ? 6 : 4;
        const x1 = ex + 46, x2 = ex + ew - 12, y0 = z.ey + 14, yN = z.ey + z.eh - 14, dy = (yN - y0) / (rows - 1);
        let d = `M${ex + 26} ${y0} H${x2}`;
        for (let n = 1; n < rows; n++) d += ` V${(y0 + n * dy).toFixed(1)} H${n % 2 ? x1 : x2}`;
        d += ` H${ex + 26}`;
        em = `
          <rect class="slab" x="${ex + 34}" y="${z.ey}" width="${ew - 34}" height="${z.eh}" rx="6"/>
          <path class="loop" stroke="url(#${u}-fbh)" d="${d}"/>
          <path class="flow" data-on="${k}" style="animation-duration:var(--${k}-dur,1.2s)" d="${d}"/>
          <rect class="manifold" x="${ex}" y="${z.ey}" width="26" height="${z.eh}" rx="4"/>
          <rect x="${ex + 4}" y="${z.v - 6}" width="18" height="12" rx="3" fill="#e2483d"/>
          <rect x="${ex + 4}" y="${z.r - 6}" width="18" height="12" rx="3" fill="#3b82f6"/>
          <rect class="emit-glow" x="${ex + 34}" y="${z.ey}" width="${ew - 34}" height="${z.eh}" rx="6"/>
          ${waves(ex + 34, ew - 34, z.ey - 4)}`;
      }
      const name = esc(c[p + "name"] || (z.kind === "radiator" ? "Heizkörper" : "Fußbodenheizung"));
      const cx = ex + ew / 2;
      const temps = [
        has(p + "vl_temp") ? `<tspan class="l">VL </tspan><tspan data-val="${p}vl_temp"${ek(p + "vl_temp")}>–</tspan>` : "",
        has(p + "rl_temp") ? `<tspan class="l">RL </tspan><tspan data-val="${p}rl_temp"${ek(p + "rl_temp")}>–</tspan>` : "",
      ].filter(Boolean).join(`<tspan class="l">  ·  </tspan>`);

      const zoneKey = has(p + "pump") ? p + "pump" : has(p + "pump_speed") ? p + "pump_speed" : null;
      zoneSvg += `
        <g class="emitter" data-on="${k}"${ek(zoneKey)}>${em}</g>
        <text class="zname" x="${cx}" y="${z.ty}" text-anchor="middle">${name}</text>
        ${temps ? `<text class="ztemp" x="${cx}" y="${z.ty + 22}" text-anchor="middle">${temps}</text>` : ""}
        ${has(p + "mixer") ? `
          <g${ek(p + "mixer")}>
            <path class="mixer" d="M658 ${z.v - 9} L682 ${z.v + 9} L682 ${z.v - 9} L658 ${z.v + 9} Z M670 ${z.v} L661 ${z.v + 15} L679 ${z.v + 15} Z"/>
            <text x="670" y="${z.v - 16}" text-anchor="middle"><tspan class="s" data-val="${p}mixer">–</tspan></text>
          </g>` : ""}
        ${pumpG(728, z.r, 15, k, zoneKey)}
        ${has(p + "pump_speed") ? `<text x="728" y="${z.r + 33}" text-anchor="middle"${ek(p + "pump_speed")}><tspan class="s" data-val="${p}pump_speed">–</tspan></text>` : ""}`;
    });

    /* --- Außengerät --- */
    const blades = [0, 120, 240].map((a) =>
      `<path d="M125 445 C116 410 128 376 158 371 C172 396 156 428 125 445Z" transform="rotate(${a} 125 445)"/>`).join("");
    const unit = `
      <g${ek("compressor")}>
        <rect class="unit-foot" x="50" y="556" width="34" height="12" rx="3"/>
        <rect class="unit-foot" x="246" y="556" width="34" height="12" rx="3"/>
        <rect class="unit-body" x="30" y="330" width="270" height="230" rx="12"/>
        <rect class="unit-side" x="228" y="345" width="60" height="200" rx="6"/>
        <g class="compressor" data-on="compressor">
          <rect class="comp-glow" x="236" y="423" width="44" height="99" rx="16" filter="url(#${u}-blur)"/>
          <path class="comp-pipe" d="M258 430 V392 H276 V362"/>
          <rect class="comp" x="240" y="428" width="36" height="90" rx="14"/>
        </g>
        <circle class="fan-ring" cx="125" cy="445" r="88"/>
        <circle class="fan-bg" cx="125" cy="445" r="79"/>
        <g class="fan" data-on="fan"><g class="blades" style="transform-origin:125px 445px">${blades}</g></g>
        <circle class="fan-hub" cx="125" cy="445" r="13"/>
        <circle class="grille" cx="125" cy="445" r="32"/>
        <circle class="grille" cx="125" cy="445" r="54"/>
        <circle class="grille" cx="125" cy="445" r="74"/>
        <path class="grille" d="M46 445 H204 M125 366 V524"/>
        <g class="defrost" data-on="defrost">
          <circle class="frost" cx="125" cy="445" r="86"/>
          ${flake(78, 392, 11)}${flake(176, 410, 9)}${flake(100, 505, 9)}${flake(165, 490, 12)}${flake(258, 380, 8)}
          ${[70, 125, 180, 262].map((x, n) => `<circle class="drip" cx="${x}" cy="568" r="3.5" style="animation-delay:${n * 0.35}s"/>`).join("")}
        </g>
      </g>`;

    /* --- Speicher --- */
    let coil = [];
    for (let y = 352, n = 0; y <= 540; y += 12, n++) coil.push(`${n % 2 ? 590 : 470},${y}`);
    const tank = `
      <rect class="tank-body" x="440" y="320" width="180" height="282" rx="10"/>
      <rect class="tank-inner" x="456" y="342" width="148" height="244" rx="8" fill="url(#${u}-tank)"/>
      <polyline class="coil" points="${coil.join(" ")}"/>
      ${has("heater_rod") ? `
      <g class="heater" data-on="heater_rod"${ek("heater_rod")}>
        <rect class="heater-glow" x="490" y="551" width="122" height="20" rx="10" filter="url(#${u}-blur)"/>
        <rect class="heater-rod" x="496" y="557" width="116" height="9" rx="4.5"/>
      </g>` : ""}
      <rect class="tank-head" x="440" y="250" width="180" height="88" rx="10"/>
      <rect class="tank-display" x="468" y="267" width="124" height="42" rx="5"/>
      <g class="leds" data-on="compressor">
        <rect class="led" x="480" y="280" width="30" height="5" rx="2"/>
        <rect class="led" x="480" y="291" width="48" height="5" rx="2"/>
        <rect class="led" x="560" y="280" width="20" height="16" rx="3"/>
      </g>
      ${has("tank_top_temp") ? `<text x="530" y="386" text-anchor="middle"${ek("tank_top_temp")}><tspan class="in-tank-l">oben </tspan><tspan class="in-tank" data-val="tank_top_temp">–</tspan></text>` : ""}
      ${has("tank_bottom_temp") ? `<text x="530" y="536" text-anchor="middle"${ek("tank_bottom_temp")}><tspan class="in-tank-l">unten </tspan><tspan class="in-tank" data-val="tank_bottom_temp">–</tspan></text>` : ""}
      <text class="s" x="530" y="626" text-anchor="middle">Speicher</text>`;

    /* --- Zapfstelle --- */
    const tap = `
      <path class="tap-h" d="M893 128 V110 M880 110 H906"/>
      <path class="tap" d="M880 140 H918 Q936 140 936 156 V170"/>
      <text class="s" x="985" y="214" text-anchor="end">Kaltwasser</text>`;

    /* --- Chips --- */
    const tankChips = [
      ["dhw_active", "Warmwasser", "#f59e0b"],
      ["dhw_boost", "Überhöhung", "#ef4444"],
      ["heater_rod", "Heizstab", "#f97316"],
    ].filter(([k]) => has(k)).map(([k, t, col], n) => chip(308, 350 + n * 42, 124, k, t, col)).join("");
    const unitChipDefs = [["compressor", "Verdichter", "#22c55e"], ["defrost", "Abtauen", "#38bdf8"]].filter(([k]) => has(k));
    const unitChips = unitChipDefs.map(([k, t, col], n) => chip(30 + n * 142, 580, 128, k, t, col)).join("");

    /* --- Untere Leiste --- */
    const statNames = { power: "Strom", heat_power: "Wärme", cop: "COP", mode: "Modus" };
    const gap = 12, bw = bottomKeys.length ? (940 - gap * (bottomKeys.length - 1)) / bottomKeys.length : 0;
    const stats = bottomKeys.map((k, n) => {
      const x = 30 + n * (bw + gap);
      return `<g class="stat"${ek(k)}>
        <rect x="${x}" y="652" width="${bw}" height="60" rx="12"/>
        <text class="l" x="${x + bw / 2}" y="675" text-anchor="middle">${statNames[k]}</text>
        <text class="v" x="${x + bw / 2}" y="702" text-anchor="middle" data-val="${k}">–</text>
      </g>`;
    }).join("");

    /* --- Texte --- */
    const texts = `
      ${c.title ? `<text class="title" x="500" y="50" text-anchor="middle">${esc(c.title)}</text>` : ""}
      ${label("indoor_temp", 30, 100, "Innen  ")}
      ${label("outdoor_temp", 30, 138, "Außen  ")}
      <text class="l" x="380" y="128" text-anchor="middle">Primärkreis</text>
      ${label("pressure", 380, 157, "", "middle")}
      ${label("vl_temp", 190, 306, "VL ", "end")}
      ${label("rl_temp", 276, 306, "RL ", "start")}
      ${has("pump_speed") ? `<text x="390" y="252" text-anchor="middle"${ek("pump_speed")}><tspan class="s" data-val="pump_speed">–</tspan></text>` : ""}
      <text class="l" x="700" y="96">Warmwasser</text>
      ${has("dhw_temp") || has("dhw_setpoint") ? `<text x="700" y="127">
        ${has("dhw_temp") ? `<tspan class="v" data-val="dhw_temp"${ek("dhw_temp")}>–</tspan>` : ""}
        ${has("dhw_setpoint") ? `<tspan class="l"${ek("dhw_setpoint")}>  Soll </tspan><tspan class="l" data-val="dhw_setpoint"${ek("dhw_setpoint")}>–</tspan>` : ""}
      </text>` : ""}`;

    const primaryKey = has("pump") ? "pump" : has("pump_speed") ? "pump_speed" : null;

    this.shadowRoot.innerHTML = `
      <style>${HP_STYLE}</style>
      <ha-card>
        <svg viewBox="0 0 1000 ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="${u}-tank" x1="0" y1="0" x2="0" y2="1">
              <stop id="${u}-top" offset="0" stop-color="#ef4444"/>
              <stop id="${u}-bot" offset="1" stop-color="#3b82f6"/>
            </linearGradient>
            <linearGradient id="${u}-fbh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#e2483d"/>
              <stop offset="1" stop-color="#3b82f6"/>
            </linearGradient>
            <filter id="${u}-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5"/>
            </filter>
          </defs>
          ${pipes}
          ${unit}
          ${tank}
          ${tap}
          ${zoneSvg}
          ${pumpG(390, 210, 18, "primary", primaryKey)}
          ${has("circulation") ? pumpG(830, 165, 11, "circ", "circulation") : ""}
          ${texts}
          ${tankChips}
          ${unitChips}
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

    const flags = {
      compressor: on("compressor"),
      defrost: on("defrost"),
      fan: on("compressor") && !on("defrost"),
      primary,
      z1: zoneOn(1),
      z2: zoneOn(2),
      circ: on("circulation"),
      heater_rod: on("heater_rod"),
      dhw_active: on("dhw_active"),
      dhw_boost: on("dhw_boost"),
    };
    this._flagEls.forEach((el) => el.classList.toggle("on", !!flags[el.dataset.on]));
    this._valEls.forEach((el) => { el.textContent = this._fmt(c[el.dataset.val]); });

    const s = this._svg.style;
    s.setProperty("--primary-dur", dur(pct("pump_speed")));
    s.setProperty("--z1-dur", dur(pct("zone1_pump_speed")));
    s.setProperty("--z2-dur", dur(pct("zone2_pump_speed")));
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
    if (!isNaN(n) && String(n) === String(s.state).trim().replace(/\.0+$/, "")) {
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
    const zone = (i) => ({
      type: "expandable", name: `sec_zone${i}`, flatten: true,
      title: `Heizkreis ${i}` + (this._config.heating_type === "both" ? (i === 1 ? " (Heizkörper)" : " (Fußbodenheizung)") : ""),
      schema: [
        { name: `zone${i}_name`, selector: { text: {} } },
        e(`zone${i}_vl_temp`), e(`zone${i}_rl_temp`), e(`zone${i}_pump`), e(`zone${i}_pump_speed`), e(`zone${i}_mixer`),
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
      {
        type: "expandable", name: "sec_hp", flatten: true, title: "Wärmepumpe (Außengerät & Primärkreis)",
        schema: ["outdoor_temp", "indoor_temp", "compressor", "defrost", "vl_temp", "rl_temp", "pump", "pump_speed", "pressure"].map(e),
      },
      {
        type: "expandable", name: "sec_dhw", flatten: true, title: "Speicher & Warmwasser",
        schema: ["dhw_temp", "dhw_setpoint", "tank_top_temp", "tank_bottom_temp", "dhw_active", "dhw_boost", "heater_rod", "circulation"].map(e),
      },
      {
        type: "expandable", name: "sec_energy", flatten: true, title: "Energie & Status (untere Leiste)",
        schema: ["power", "heat_power", "cop", "mode"].map(e),
      },
      zone(1),
    ];
    if (this._config.heating_type === "both") schema.push(zone(2));
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

console.info(`%c WÄRMEPUMPEN-FLOW-CARD %c v${HP_VERSION} `, "color:#fff;background:#e2483d;font-weight:700", "color:#e2483d;background:#fff");
