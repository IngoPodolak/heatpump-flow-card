/*
 * Wärmepumpen Flow Card für Home Assistant
 * Animierte Anlagenansicht: Außengerät, Speicher, Warmwasser, Enthärtung, Heizkörper / FBH
 * Primär entworfen für Daikin Altherma 4 mit ECH2O-Speicher, nutzbar für jede Wärmepumpe.
 * https://github.com/IngoPodolak/heatpump-flow-card
 */

const HP_VERSION = "1.3.0";

/* ====================== Übersetzungen ====================== */
const HP_I18N = {
  de: {
    card: {
      primary: "Primärkreis", heatpump: "(Wärmepumpe)", dhw: "Brauchwasserkreis", set: "Soll",
      tank: "Speicher", unit: "Außengerät", radiator: "Heizkörper", floor: "Fußbodenheizung",
      softener: "Enthärtung", indoor: "innen", outdoor: "außen", vl: "VL ", rl: "RL ",
      compressor: "Verdichter", defrost: "Abtauen", dhw_active: "Warmwasser", dhw_boost: "Überhöhung",
      heater_rod: "Heizstab", circulation: "Zirkulation",
      power: "Strom", heat_power: "Wärme", cop: "COP", mode: "Modus",
    },
    sec: { hp: "Wärmepumpe (Außengerät & Primärkreis)", dhw: "Speicher, Innengerät & Warmwasser", soft: "Enthärtung & Leckageschutz", energy: "Energie & Status (untere Leiste)", zone: "Heizkreis" },
    opt: { radiator: "Heizkörper", floor: "Fußbodenheizung", both: "Heizkörper + Fußbodenheizung (2 Heizkreise)", auto: "Automatisch (HA-Sprache)" },
    lbl: {
      title: "Titel (leer = kein Titel)", language: "Sprache", heating_type: "Wärmeverteilung",
      theme_background: "Hintergrund vom HA-Theme übernehmen (statt dunkel)", softener: "Strang „Enthärtung“ anzeigen",
      outdoor_temp: "Außentemperatur", indoor_temp: "Innentemperatur", compressor: "Verdichter läuft", defrost: "Abtauen / Enteisung aktiv",
      vl_temp: "Vorlauftemperatur Wärmepumpe", rl_temp: "Rücklauftemperatur Wärmepumpe", pump: "Umwälzpumpe läuft",
      pump_speed: "Umwälzpumpe Leistung (%)", pressure: "Druck im Heizsystem", power: "Stromverbrauch Wärmepumpe",
      heat_power: "Erzeugte Wärme (thermische Leistung)", cop: "COP", mode: "Aktueller Betriebsmodus",
      dhw_temp: "Brauchwassertemperatur", dhw_setpoint: "Sollwert Brauchwasser", tank_top_temp: "Speicher obere Temperatur",
      tank_bottom_temp: "Speicher untere Temperatur", dhw_active: "Brauchwasserbereitung aktiv", dhw_boost: "Speicherüberhöhung (leistungsstark)",
      heater_rod: "Heizstab im Speicher an", circulation: "Warmwasser-Zirkulation läuft", zone1_mixer: "Mischerstellung im Innengerät",
      softener_flow: "Durchsatz (l/h)", softener_hardness: "Härtegrad", leak_alarm: "Leckage erkannt", leak_valve: "Absperrventil Leckageschutz offen",
      zname: "Name", zvl: "Vorlauftemperatur", zrl: "Rücklauftemperatur", zpump: "aktiv / Pumpe läuft", zspeed: "Pumpe Leistung (%)", zmixer: "Mischerstellung",
    },
    help: {
      pump_speed: "Steuert auch die Geschwindigkeit der Pumpen- und Rohranimation",
      zone1_mixer: "Mischer im Innengerät – mischt Heizkreis und Wärmepumpenkreis",
      zpump: "Leer lassen: aktiv, wenn die Umwälzpumpe läuft und keine Brauchwasserbereitung aktiv ist",
      leak_alarm: "Ein = Leck erkannt (Symbol wird rot)", leak_valve: "Aus/zu = Wasser abgesperrt (Symbol wird gelb)",
    },
  },
  en: {
    card: {
      primary: "Primary circuit", heatpump: "(heat pump)", dhw: "Domestic hot water", set: "Target",
      tank: "Tank", unit: "Outdoor unit", radiator: "Radiators", floor: "Underfloor heating",
      softener: "Water softener", indoor: "indoor", outdoor: "outdoor", vl: "Flow ", rl: "Return ",
      compressor: "Compressor", defrost: "Defrost", dhw_active: "Hot water", dhw_boost: "Boost",
      heater_rod: "Heater", circulation: "Circulation",
      power: "Power", heat_power: "Heat", cop: "COP", mode: "Mode",
    },
    sec: { hp: "Heat pump (outdoor unit & primary circuit)", dhw: "Tank, indoor unit & hot water", soft: "Water softener & leak protection", energy: "Energy & status (bottom bar)", zone: "Heating circuit" },
    opt: { radiator: "Radiators", floor: "Underfloor heating", both: "Radiators + underfloor heating (2 circuits)", auto: "Automatic (HA language)" },
    lbl: {
      title: "Title (empty = no title)", language: "Language", heating_type: "Heat distribution",
      theme_background: "Use HA theme background (instead of dark)", softener: "Show water softener line",
      outdoor_temp: "Outdoor temperature", indoor_temp: "Indoor temperature", compressor: "Compressor running", defrost: "Defrost active",
      vl_temp: "Heat pump flow temperature", rl_temp: "Heat pump return temperature", pump: "Circulation pump running",
      pump_speed: "Circulation pump speed (%)", pressure: "System pressure", power: "Heat pump power consumption",
      heat_power: "Heat output (thermal power)", cop: "COP", mode: "Current operating mode",
      dhw_temp: "Hot water temperature", dhw_setpoint: "Hot water setpoint", tank_top_temp: "Tank top temperature",
      tank_bottom_temp: "Tank bottom temperature", dhw_active: "Hot water heating active", dhw_boost: "Tank boost (powerful)",
      heater_rod: "Tank heater on", circulation: "Hot water circulation running", zone1_mixer: "Mixing valve in indoor unit",
      softener_flow: "Flow rate (l/h)", softener_hardness: "Water hardness", leak_alarm: "Leak detected", leak_valve: "Leak protection valve open",
      zname: "Name", zvl: "flow temperature", zrl: "return temperature", zpump: "active / pump running", zspeed: "pump speed (%)", zmixer: "mixing valve position",
    },
    help: {
      pump_speed: "Also controls the speed of the pump and pipe animation",
      zone1_mixer: "Mixing valve inside the indoor unit – blends heating and heat pump circuit",
      zpump: "Leave empty: active when the circulation pump runs and no hot water heating is active",
      leak_alarm: "On = leak detected (icon turns red)", leak_valve: "Off/closed = water shut off (icon turns yellow)",
    },
  },
  fr: {
    card: {
      primary: "Circuit primaire", heatpump: "(pompe à chaleur)", dhw: "Eau chaude sanitaire", set: "Consigne",
      tank: "Ballon", unit: "Unité extérieure", radiator: "Radiateurs", floor: "Plancher chauffant",
      softener: "Adoucisseur", indoor: "intérieur", outdoor: "extérieur", vl: "Départ ", rl: "Retour ",
      compressor: "Compresseur", defrost: "Dégivrage", dhw_active: "Eau chaude", dhw_boost: "Boost",
      heater_rod: "Résistance", circulation: "Bouclage",
      power: "Électricité", heat_power: "Chaleur", cop: "COP", mode: "Mode",
    },
    sec: { hp: "Pompe à chaleur (unité extérieure & circuit primaire)", dhw: "Ballon, unité intérieure & eau chaude", soft: "Adoucisseur & protection fuite", energy: "Énergie & état (barre inférieure)", zone: "Circuit de chauffage" },
    opt: { radiator: "Radiateurs", floor: "Plancher chauffant", both: "Radiateurs + plancher chauffant (2 circuits)", auto: "Automatique (langue HA)" },
    lbl: {
      title: "Titre (vide = aucun)", language: "Langue", heating_type: "Émetteurs de chaleur",
      theme_background: "Utiliser le fond du thème HA (au lieu de sombre)", softener: "Afficher la ligne adoucisseur",
      outdoor_temp: "Température extérieure", indoor_temp: "Température intérieure", compressor: "Compresseur en marche", defrost: "Dégivrage actif",
      vl_temp: "Température départ PAC", rl_temp: "Température retour PAC", pump: "Circulateur en marche",
      pump_speed: "Vitesse du circulateur (%)", pressure: "Pression de l'installation", power: "Consommation électrique PAC",
      heat_power: "Chaleur produite (puissance thermique)", cop: "COP", mode: "Mode de fonctionnement",
      dhw_temp: "Température eau chaude", dhw_setpoint: "Consigne eau chaude", tank_top_temp: "Température haut du ballon",
      tank_bottom_temp: "Température bas du ballon", dhw_active: "Production d'eau chaude active", dhw_boost: "Surchauffe du ballon (puissant)",
      heater_rod: "Résistance du ballon active", circulation: "Bouclage eau chaude en marche", zone1_mixer: "Vanne mélangeuse de l'unité intérieure",
      softener_flow: "Débit (l/h)", softener_hardness: "Dureté de l'eau", leak_alarm: "Fuite détectée", leak_valve: "Vanne de protection fuite ouverte",
      zname: "Nom", zvl: "température départ", zrl: "température retour", zpump: "actif / circulateur en marche", zspeed: "vitesse circulateur (%)", zmixer: "position vanne mélangeuse",
    },
    help: {
      pump_speed: "Règle aussi la vitesse de l'animation des pompes et tuyaux",
      zone1_mixer: "Vanne mélangeuse dans l'unité intérieure – mélange circuit de chauffage et circuit PAC",
      zpump: "Laisser vide : actif quand le circulateur tourne et sans production d'eau chaude",
      leak_alarm: "Marche = fuite détectée (icône rouge)", leak_valve: "Arrêt/fermée = eau coupée (icône jaune)",
    },
  },
  nl: {
    card: {
      primary: "Primair circuit", heatpump: "(warmtepomp)", dhw: "Tapwater", set: "Doel",
      tank: "Boiler", unit: "Buitenunit", radiator: "Radiatoren", floor: "Vloerverwarming",
      softener: "Waterontharder", indoor: "binnen", outdoor: "buiten", vl: "Aanvoer ", rl: "Retour ",
      compressor: "Compressor", defrost: "Ontdooien", dhw_active: "Warm water", dhw_boost: "Boost",
      heater_rod: "Element", circulation: "Circulatie",
      power: "Stroom", heat_power: "Warmte", cop: "COP", mode: "Modus",
    },
    sec: { hp: "Warmtepomp (buitenunit & primair circuit)", dhw: "Boiler, binnenunit & warm water", soft: "Waterontharder & lekbeveiliging", energy: "Energie & status (onderbalk)", zone: "Verwarmingscircuit" },
    opt: { radiator: "Radiatoren", floor: "Vloerverwarming", both: "Radiatoren + vloerverwarming (2 circuits)", auto: "Automatisch (HA-taal)" },
    lbl: {
      title: "Titel (leeg = geen titel)", language: "Taal", heating_type: "Warmteafgifte",
      theme_background: "Achtergrond van HA-thema gebruiken (i.p.v. donker)", softener: "Lijn waterontharder tonen",
      outdoor_temp: "Buitentemperatuur", indoor_temp: "Binnentemperatuur", compressor: "Compressor draait", defrost: "Ontdooien actief",
      vl_temp: "Aanvoertemperatuur warmtepomp", rl_temp: "Retourtemperatuur warmtepomp", pump: "Circulatiepomp draait",
      pump_speed: "Circulatiepomp vermogen (%)", pressure: "Systeemdruk", power: "Stroomverbruik warmtepomp",
      heat_power: "Geproduceerde warmte (thermisch vermogen)", cop: "COP", mode: "Huidige bedrijfsmodus",
      dhw_temp: "Tapwatertemperatuur", dhw_setpoint: "Doeltemperatuur tapwater", tank_top_temp: "Boiler temperatuur boven",
      tank_bottom_temp: "Boiler temperatuur onder", dhw_active: "Tapwaterbereiding actief", dhw_boost: "Boiler boost (krachtig)",
      heater_rod: "Verwarmingselement aan", circulation: "Tapwatercirculatie draait", zone1_mixer: "Mengklep in binnenunit",
      softener_flow: "Doorstroming (l/h)", softener_hardness: "Waterhardheid", leak_alarm: "Lek gedetecteerd", leak_valve: "Afsluiter lekbeveiliging open",
      zname: "Naam", zvl: "aanvoertemperatuur", zrl: "retourtemperatuur", zpump: "actief / pomp draait", zspeed: "pompvermogen (%)", zmixer: "mengklepstand",
    },
    help: {
      pump_speed: "Bepaalt ook de snelheid van de pomp- en leidinganimatie",
      zone1_mixer: "Mengklep in de binnenunit – mengt verwarmings- en warmtepompcircuit",
      zpump: "Leeg laten: actief als de circulatiepomp draait en er geen tapwater wordt bereid",
      leak_alarm: "Aan = lek gedetecteerd (icoon wordt rood)", leak_valve: "Uit/dicht = water afgesloten (icoon wordt geel)",
    },
  },
  it: {
    card: {
      primary: "Circuito primario", heatpump: "(pompa di calore)", dhw: "Acqua calda sanitaria", set: "Target",
      tank: "Accumulo", unit: "Unità esterna", radiator: "Radiatori", floor: "Riscaldamento a pavimento",
      softener: "Addolcitore", indoor: "interno", outdoor: "esterno", vl: "Mandata ", rl: "Ritorno ",
      compressor: "Compressore", defrost: "Sbrinamento", dhw_active: "Acqua calda", dhw_boost: "Boost",
      heater_rod: "Resistenza", circulation: "Ricircolo",
      power: "Potenza", heat_power: "Calore", cop: "COP", mode: "Modalità",
    },
    sec: { hp: "Pompa di calore (unità esterna & circuito primario)", dhw: "Accumulo, unità interna & acqua calda", soft: "Addolcitore & protezione perdite", energy: "Energia & stato (barra inferiore)", zone: "Circuito di riscaldamento" },
    opt: { radiator: "Radiatori", floor: "Riscaldamento a pavimento", both: "Radiatori + pavimento (2 circuiti)", auto: "Automatica (lingua HA)" },
    lbl: {
      title: "Titolo (vuoto = nessuno)", language: "Lingua", heating_type: "Distribuzione del calore",
      theme_background: "Usa lo sfondo del tema HA (invece di scuro)", softener: "Mostra linea addolcitore",
      outdoor_temp: "Temperatura esterna", indoor_temp: "Temperatura interna", compressor: "Compressore in funzione", defrost: "Sbrinamento attivo",
      vl_temp: "Temperatura mandata PdC", rl_temp: "Temperatura ritorno PdC", pump: "Circolatore in funzione",
      pump_speed: "Velocità circolatore (%)", pressure: "Pressione impianto", power: "Consumo elettrico PdC",
      heat_power: "Calore prodotto (potenza termica)", cop: "COP", mode: "Modalità di funzionamento",
      dhw_temp: "Temperatura acqua calda", dhw_setpoint: "Setpoint acqua calda", tank_top_temp: "Temperatura alta accumulo",
      tank_bottom_temp: "Temperatura bassa accumulo", dhw_active: "Produzione acqua calda attiva", dhw_boost: "Sovratemperatura accumulo (potente)",
      heater_rod: "Resistenza accumulo accesa", circulation: "Ricircolo acqua calda attivo", zone1_mixer: "Valvola miscelatrice unità interna",
      softener_flow: "Portata (l/h)", softener_hardness: "Durezza dell'acqua", leak_alarm: "Perdita rilevata", leak_valve: "Valvola antiallagamento aperta",
      zname: "Nome", zvl: "temperatura mandata", zrl: "temperatura ritorno", zpump: "attivo / pompa in funzione", zspeed: "velocità pompa (%)", zmixer: "posizione miscelatrice",
    },
    help: {
      pump_speed: "Regola anche la velocità dell'animazione di pompe e tubi",
      zone1_mixer: "Valvola miscelatrice nell'unità interna – miscela circuito di riscaldamento e circuito PdC",
      zpump: "Lasciare vuoto: attivo quando il circolatore funziona e non c'è produzione di acqua calda",
      leak_alarm: "On = perdita rilevata (icona rossa)", leak_valve: "Off/chiusa = acqua chiusa (icona gialla)",
    },
  },
};

const hpLang = (config, hass) => {
  const want = config && config.language && config.language !== "auto" ? config.language : (hass && (hass.locale?.language || hass.language)) || "de";
  const short = String(want).slice(0, 2).toLowerCase();
  return HP_I18N[short] ? short : "en";
};

const HP_NON_ENTITY_KEYS = ["type", "title", "heating_type", "zone1_name", "zone2_name", "theme_background", "language", "softener"];
const HP_ON_STATES = ["on", "true", "running", "heating", "an", "ein", "aktiv", "active", "open", "yes", "1"];

const HP_STYLE = `
  :host { display: block; }
  ha-card { overflow: hidden; padding: 6px; box-sizing: border-box; height: 100%;
    display: flex; align-items: center; justify-content: center;
    --hp-bg: #1a1b22; --hp-text: #f1f2f4; --hp-text2: #a7adb7; --ol: #2b3038;
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
  [data-entity-key] { cursor: pointer; }
  .shadow { fill: #000; opacity: .5; }
  .spd { opacity: 0; transition: opacity .4s; }
  .spd.on { opacity: 1; }

  /* Rohre: Ummantelung, Glühen, Kontur, Rohr, Glanzlicht */
  .casing { fill: none; stroke: var(--hp-bg); stroke-width: 16; stroke-linecap: butt; stroke-linejoin: round; }
  .p-glow { fill: none; stroke-width: 12; opacity: .28; stroke-linejoin: round; }
  .p-ol { fill: none; stroke-width: 9; stroke-linecap: round; stroke-linejoin: round; }
  .pipe { fill: none; stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }
  .p-hl { fill: none; stroke: rgba(255,255,255,.42); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
  .hot.pipe, .hot.p-glow { stroke: var(--hp-hot-color, #e0483d); } .hot.p-ol { stroke: #7e231d; }
  .cold.pipe, .cold.p-glow { stroke: var(--hp-cold-color, #4386e6); } .cold.p-ol { stroke: #1d4686; }
  .dw.pipe { stroke: #6b7a94; } .dw.p-ol { stroke: #343d4d; } .dw.p-glow { stroke: #6b7a94; opacity: .12; }
  .arrow { stroke: rgba(0,0,0,.45); stroke-width: 1; }
  .arrow.hot { fill: #ff6a5c; } .arrow.cold { fill: #6aa5ff; } .arrow.dw { fill: #93a1b8; }
  .flow { fill: none; stroke: rgba(255,255,255,.9); stroke-width: 2.5; stroke-linecap: round;
    stroke-dasharray: 1.5 15; opacity: 0; transition: opacity .5s; }
  .flow.on { opacity: 1; animation-name: hp-dash; animation-timing-function: linear; animation-iteration-count: infinite; }
  @keyframes hp-dash { to { stroke-dashoffset: -16.5; } }
  @keyframes hp-spin { to { transform: rotate(360deg); } }
  @keyframes hp-pulse { 0%,100% { opacity: .45; } 50% { opacity: 1; } }
  @keyframes hp-frost { 0%,100% { opacity: .12; } 50% { opacity: .38; } }
  @keyframes hp-drip { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: 1; } 100% { transform: translateY(32px); opacity: 0; } }
  @keyframes hp-rise { 0% { transform: translateY(6px); opacity: 0; } 40% { opacity: .9; } 100% { transform: translateY(-12px); opacity: 0; } }

  /* Haus-Symbol */
  .house { fill: rgba(150,156,168,.07); stroke: var(--hp-text2); stroke-width: 2.5; stroke-linejoin: round; stroke-linecap: round; }

  /* Außengerät */
  .u-front { fill: url(#UID-ufront); }
  .u-top { fill: url(#UID-utop); stroke: var(--ol); stroke-width: 2; stroke-linejoin: round; }
  .u-side { fill: url(#UID-uside); stroke: var(--ol); stroke-width: 2; stroke-linejoin: round; }
  .u-groove { stroke: rgba(0,0,0,.18); stroke-width: 1.5; }
  .u-edge { fill: none; stroke: var(--ol); stroke-width: 2.2; }
  .slat-d { stroke: #a9b0b9; stroke-width: 1.6; } .slat-l { stroke: #ffffff; stroke-width: 1.2; opacity: .8; }
  .u-foot { fill: #4b5260; stroke: var(--ol); stroke-width: 1.5; }
  .fan-bezel { fill: url(#UID-bezel); stroke: var(--ol); stroke-width: 2; }
  .fan-bg { fill: url(#UID-fanbg); }
  .blades path { fill: url(#UID-blade); stroke: #1a1d23; stroke-width: 1.2; }
  .fan.on .blades { animation: hp-spin .8s linear infinite; }
  .fan-hub { fill: url(#UID-bezel); stroke: var(--ol); stroke-width: 1.5; }
  .grille { fill: none; stroke: rgba(225,230,236,.38); stroke-width: 1.3; }
  .u-cut { fill: url(#UID-cutbg); stroke: var(--ol); stroke-width: 2; }
  .pcb { fill: #353b45; stroke: #59606b; stroke-width: 1; }
  .copper { fill: none; stroke: #b86d3a; stroke-width: 5; stroke-linecap: round; stroke-linejoin: round; }
  .copper-hl { fill: none; stroke: #f1b48a; stroke-width: 1.4; stroke-linecap: round; opacity: .8; }
  .comp { fill: url(#UID-metal); stroke: var(--ol); stroke-width: 1.5; }
  .comp-top { fill: #c3c9d1; stroke: var(--ol); stroke-width: 1.2; }
  .comp-tint { fill: #22c55e; opacity: 0; transition: opacity .4s; }
  .comp-glow { fill: #22c55e; opacity: 0; }
  .compressor.on .comp-tint { opacity: .4; }
  .compressor.on .comp-glow { animation: hp-pulse 1.6s ease-in-out infinite; }
  .defrost { opacity: 0; transition: opacity .6s; pointer-events: none; }
  .defrost.on { opacity: 1; }
  .frost { fill: #bfe6ff; opacity: .2; }
  .defrost.on .frost { animation: hp-frost 2.4s ease-in-out infinite; }
  .flake { fill: none; stroke: #f0f9ff; stroke-width: 2.5; stroke-linecap: round; }
  .drip { fill: #7dd3fc; opacity: 0; }
  .defrost.on .drip { animation: hp-drip 1.4s ease-in infinite; }

  /* Speicher */
  .t-body { fill: url(#UID-tbody); stroke: var(--ol); stroke-width: 2.2; }
  .t-plinth { fill: url(#UID-plinth); stroke: var(--ol); stroke-width: 2; }
  .t-cut { fill: url(#UID-tcut); stroke: var(--ol); stroke-width: 2; }
  .t-heat { opacity: .22; }
  .coil-back { fill: none; stroke: #6d3b1c; stroke-width: 4; opacity: .7; }
  .coil { fill: none; stroke: url(#UID-tank); stroke-width: 5.5; stroke-linecap: round; }
  .coil-hl { fill: none; stroke: rgba(255,255,255,.4); stroke-width: 1.4; }
  .t-pipe { stroke: url(#UID-metal); stroke-width: 6; }
  .t-head { fill: url(#UID-head); stroke: var(--ol); stroke-width: 2.2; }
  .t-headhl { fill: none; stroke: rgba(255,255,255,.12); stroke-width: 1.5; }
  .t-display { fill: url(#UID-screen); stroke: #4b525d; stroke-width: 1.5; }
  .port { fill: url(#UID-metal); stroke: var(--ol); stroke-width: 1.2; }
  .led { fill: #39404b; transition: fill .4s; }
  .leds.on .led { fill: #4fd1e8; }
  .rod { fill: url(#UID-metal); stroke: var(--ol); stroke-width: 1.2; }
  .rod-tint { fill: #fb923c; opacity: 0; transition: opacity .4s; }
  .rod-glow { fill: #f97316; opacity: 0; }
  .heater.on .rod-tint { opacity: .85; }
  .heater.on .rod-glow { animation: hp-pulse 1.2s ease-in-out infinite; }
  .mixer { fill: #b56cf0; stroke: #4c1d7a; stroke-width: 1.4; stroke-linejoin: round; }

  /* Pumpen (Laufrad) */
  .pump-body { fill: url(#UID-pump); stroke: #94a3b8; stroke-width: 3; transition: stroke .4s; }
  .pump-ol { fill: none; stroke: var(--ol); stroke-width: 1.5; }
  .impeller path { fill: none; stroke: #94a3b8; stroke-width: 3; stroke-linecap: round; transition: stroke .4s; }
  .pump-hub { fill: #94a3b8; }
  .pump-glow { fill: #22c55e; opacity: 0; transition: opacity .4s; }
  .pump.on .pump-body, .pump.on .impeller path { stroke: #22c55e; }
  .pump.on .pump-hub { fill: #22c55e; }
  .pump.on .pump-glow { opacity: .35; }
  .pump.on .impeller { animation-name: hp-spin; animation-timing-function: linear; animation-iteration-count: infinite; }

  /* Wärmeübergabe */
  .r-back { fill: #b9bfc8; stroke: var(--ol); stroke-width: 2; }
  .r-col { fill: url(#UID-radcol); stroke: #8f97a2; stroke-width: 1; }
  .r-bar { fill: url(#UID-radbar); stroke: var(--ol); stroke-width: 1.2; }
  .r-valve { fill: url(#UID-chrome); stroke: var(--ol); stroke-width: 1.2; }
  .r-head { fill: #f4f5f7; stroke: var(--ol); stroke-width: 1.2; }
  .glow { fill: #f97316; opacity: 0; transition: opacity .8s; }
  .emitter.on .glow { opacity: .22; }
  .wave { fill: none; stroke: #f97316; stroke-width: 3; stroke-linecap: round; opacity: 0; }
  .emitter.on .wave { animation: hp-rise 2.4s ease-in-out infinite; }
  .cab { fill: url(#UID-cab); stroke: var(--ol); stroke-width: 2; }
  .cab-in { fill: #8d949f; stroke: rgba(0,0,0,.3); }
  .bar-h { fill: url(#UID-barh); stroke: #5e1712; stroke-width: 1.2; }
  .bar-c { fill: url(#UID-barc); stroke: #163a70; stroke-width: 1.2; }
  .brass { fill: url(#UID-brass); stroke: #6b4a10; stroke-width: 1; }
  .vhead { fill: #f4f5f7; stroke: var(--ol); stroke-width: 1; }
  .loop-ol { fill: none; stroke: rgba(0,0,0,.55); stroke-width: 6.5; stroke-linecap: round; }
  .loop-h { fill: none; stroke: #e0483d; stroke-width: 4; stroke-linecap: round; }
  .loop-c { fill: none; stroke: #4386e6; stroke-width: 4; stroke-linecap: round; }
  .tag rect { fill: rgba(16,18,24,.9); stroke-width: 2; }
  .tag.h rect { stroke: #e0483d; } .tag.c rect { stroke: #4386e6; }
  .tag text { font-size: 16px; font-weight: 500; fill: #f1f2f4; }

  /* Zapfstelle & Enthärtung */
  .chrome { fill: url(#UID-chrome); stroke: var(--ol); stroke-width: 1.5; }
  .spout-ol { fill: none; stroke: var(--ol); stroke-width: 13; stroke-linecap: round; stroke-linejoin: round; }
  .spout { fill: none; stroke: url(#UID-chrome); stroke-width: 10; stroke-linecap: round; stroke-linejoin: round; }
  .spout-hl { fill: none; stroke: rgba(255,255,255,.75); stroke-width: 2; stroke-linecap: round; }
  .leak path.shield { fill: rgba(34,197,94,.15); stroke: #22c55e; stroke-width: 2.5; stroke-linejoin: round; transition: all .4s; }
  .leak path.drop { fill: #22c55e; transition: fill .4s; }
  .leak.closed path.shield { fill: rgba(245,158,11,.18); stroke: #f59e0b; }
  .leak.closed path.drop { fill: #f59e0b; }
  .leak.alarm path.shield { fill: rgba(239,68,68,.25); stroke: #ef4444; }
  .leak.alarm path.drop { fill: #ef4444; }
  .leak.alarm { animation: hp-pulse 0.9s ease-in-out infinite; }

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
    if (!config) throw new Error("Invalid configuration");
    this._config = { heating_type: "radiator", ...config };
    this._lang = null;
    this._build();
    if (this._hass) this._update();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._config && (!this._svg || this._lang !== hpLang(this._config, hass))) this._build();
    this._update();
  }

  getCardSize() { return 9; }
  getGridOptions() { return { columns: 12, rows: "auto", min_columns: 6 }; }

  /* ---------- Aufbau der Grafik (nur bei Konfigurations- oder Sprachänderung) ---------- */
  _build() {
    const c = this._config;
    if (!c) return;
    this._lang = hpLang(c, this._hass);
    const T = HP_I18N[this._lang].card;
    const u = this._uid;
    const has = (k) => !!c[k];
    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
    const ek = (k) => (k && has(k) ? ` data-entity-key="${k}"` : "");
    const type = ["radiator", "floor", "both"].includes(c.heating_type) ? c.heating_type : "radiator";
    const blur = `filter="url(#${u}-blur)"`, soft = `filter="url(#${u}-soft)"`;

    /* Rohr: Ummantelung (saubere Kreuzungen), Glühen, Kontur, Rohr, Glanzlicht, optional Fluss */
    const flowOnly = (d, flow) =>
      `<path class="flow" data-on="${flow}" style="animation-duration:var(--${flow}-dur,1.2s)" d="${d}"/>`;
    const pipe = (d, cls, flow) =>
      `<path class="casing" d="${d}"/><path class="p-glow ${cls}" d="${d}" ${blur}/><path class="p-ol ${cls}" d="${d}"/>` +
      `<path class="pipe ${cls}" d="${d}"/><path class="p-hl" d="${d}" transform="translate(-1 -1)"/>` + (flow ? flowOnly(d, flow) : "");

    /* Richtungspfeil */
    const arrow = (x, y, dir, cls) => {
      const s = 8.5, rot = { r: 0, d: 90, l: 180, u: 270 }[dir];
      return `<path class="arrow ${cls}" transform="rotate(${rot} ${x} ${y})" d="M${x + s} ${y} L${x - s} ${y - s} L${x - s * 0.45} ${y} L${x - s} ${y + s} Z"/>`;
    };

    /* Pumpe mit drehendem Laufrad */
    const pumpG = (cx, cy, r, flag, key) => `
      <g class="pump" data-on="${flag}"${ek(key)}>
        <circle class="pump-glow" cx="${cx}" cy="${cy}" r="${r + 5}" ${blur}/>
        <circle class="pump-body" cx="${cx}" cy="${cy}" r="${r}"/>
        <circle class="pump-ol" cx="${cx}" cy="${cy}" r="${r + 2}"/>
        <g class="impeller" style="transform-origin:${cx}px ${cy}px;animation-duration:var(--${flag}-dur,1s)">
          ${[0, 90, 180, 270].map((a) => `<path d="M${cx} ${cy} q ${r * 0.55} ${-r * 0.12} ${r * 0.68} ${-r * 0.68}" transform="rotate(${a} ${cx} ${cy})"/>`).join("")}
        </g>
        <circle class="pump-hub" cx="${cx}" cy="${cy}" r="${(r * 0.2).toFixed(1)}"/>
      </g>`;

    const label = (key, x, y, prefix = "", anchor = "start") =>
      has(key)
        ? `<text x="${x}" y="${y}" text-anchor="${anchor}"${ek(key)}>${prefix ? `<tspan class="l">${prefix}</tspan>` : ""}<tspan class="v" data-val="${key}">–</tspan></text>`
        : "";
    /* kleiner Wert; mit flag nur sichtbar, solange die zugehörige Pumpe läuft */
    const small = (key, x, y, anchor = "middle", flag) =>
      has(key) ? `<text class="s${flag ? " spd" : ""}"${flag ? ` data-on="${flag}"` : ""} x="${x}" y="${y}" text-anchor="${anchor}"${ek(key)}><tspan data-val="${key}">–</tspan></text>` : "";
    const tag = (key, x, y, kind) =>
      has(key) ? `<g class="tag ${kind}"${ek(key)}><rect x="${x}" y="${y - 12}" width="74" height="24" rx="12"/>
        <text x="${x + 37}" y="${y + 6}" text-anchor="middle" data-val="${key}">–</text></g>` : "";

    const flake = (x, y, s) =>
      `<path class="flake" d="M${x} ${y - s} V${y + s} M${x - s * 0.866} ${y - s / 2} L${x + s * 0.866} ${y + s / 2} M${x - s * 0.866} ${y + s / 2} L${x + s * 0.866} ${y - s / 2}"/>`;
    const waves = (x0, w, y) => (c.softener ? [0.5, 0.8] : [0.2, 0.5, 0.8]).map((f, n) =>
      `<path class="wave" style="animation-delay:${n * 0.6}s" d="M${x0 + w * f} ${y} q 6 -5 0 -10 q -6 -5 0 -10"/>`).join("");

    /* ===== Geometrie =====
       Speicher-Anschlüsse oben, gleichmäßig 24 px:
       490 RL-WP | 514 VL-WP | 538 WW warm | 562 Kaltwasser | 586 VL-Heizung | 610 RL-Heizung
       Leitungshöhen gleichmäßig 36 px: 170 / 206 (WP + WW), 242 / 278 (Heizung)
       Pfeile: Spalte x=367 (Primärkreis), Spalte x=690 (Warmwasser + Heizung) */
    const PY = 300, AX1 = 367, AX2 = 690;
    let back = "", front = "";

    /* Primärkreis */
    back += pipe(`M220 368 V170 H514 V${PY}`, "hot", "primary");
    back += pipe(`M490 ${PY} V206 H256 V368`, "cold", "primary");
    front += arrow(AX1, 170, "r", "hot") + arrow(AX1, 206, "l", "cold");
    front += arrow(220, 250, "u", "hot") + arrow(256, 250, "d", "cold");

    /* Warmwasser */
    back += pipe(`M538 ${PY} V170 H866`, "hot");
    back += pipe(`M866 206 H562 V${PY}`, "cold");
    front += arrow(AX2, 170, "r", "hot") + arrow(AX2, 206, "l", "cold");
    if (has("circulation")) {
      back += pipe("M800 170 V206", "hot");
      back += flowOnly(`M538 ${PY} V170 H800 V206 H562 V${PY}`, "circ");
    }

    /* Enthärtung (optional) */
    let softSvg = "";
    if (c.softener) {
      back += pipe("M985 256 H830 V206", "dw");
      back += flowOnly(`M985 256 H830 V206 H562 V${PY}`, "soft");
      front += arrow(905, 256, "l", "dw");
      const hasLeak = has("leak_alarm") || has("leak_valve");
      const lk = has("leak_alarm") ? "leak_alarm" : "leak_valve";
      const sx = 846, sy = 286;
      const data = [
        has("softener_flow") ? `<tspan data-val="softener_flow"${ek("softener_flow")}>–</tspan>` : "",
        has("softener_hardness") ? `<tspan data-val="softener_hardness"${ek("softener_hardness")}>–</tspan>` : "",
      ].filter(Boolean).join(`<tspan class="l"> · </tspan>`);
      softSvg = `
        <text class="l" x="985" y="244" text-anchor="end">${T.softener}</text>
        ${hasLeak ? `<g class="leak"${ek(lk)}>
          <path class="shield" d="M${sx} ${sy - 15} L${sx + 13} ${sy - 10} V${sy + 1} C${sx + 13} ${sy + 9} ${sx + 7} ${sy + 14} ${sx} ${sy + 17} C${sx - 7} ${sy + 14} ${sx - 13} ${sy + 9} ${sx - 13} ${sy + 1} V${sy - 10} Z"/>
          <path class="drop" d="M${sx} ${sy - 8} C${sx + 5} ${sy - 2} ${sx + 6} ${sy + 2} ${sx + 6} ${sy + 4} A6 6 0 0 1 ${sx - 6} ${sy + 4} C${sx - 6} ${sy + 2} ${sx - 5} ${sy - 2} ${sx} ${sy - 8} Z"/>
        </g>` : ""}
        ${data ? `<text class="s" x="${hasLeak ? 868 : 836}" y="${sy + 6}">${data}</text>` : ""}`;
    }

    /* Heizkreise */
    const VX = 780, RX = 744, EX = 800, EW = 160;
    let zones, pumps = "";
    const zkey = (i) => has(`zone${i}_pump`) ? `zone${i}_pump` : has(`zone${i}_pump_speed`) ? `zone${i}_pump_speed` : null;
    if (type === "both") {
      zones = [
        { i: 1, kind: "radiator", y0: 318, h: 92, vin: 333, rout: 395 },
        { i: 2, kind: "floor", y0: 476, h: 80, vin: 496, rout: 536, loopEnd: 628 },
      ];
      back += pipe(`M${EX} 536 H${RX} V395`, "cold", "z2");
      back += pipe(`M${EX} 395 H${RX}`, "cold", "z1");
      back += pipe(`M${RX} 395 V278 H610 V${PY}`, "cold", "zany");
      back += pipe(`M586 ${PY} V242 H${VX} V333`, "hot", "zany");
      back += pipe(`M${VX} 333 H${EX}`, "hot", "z1");
      back += pipe(`M${VX} 333 V496 H${EX}`, "hot", "z2");
      pumps += pumpG(RX, 345, 15, "z1", zkey(1)) + small("zone1_pump_speed", RX - 26, 351, "end", "z1");
      pumps += pumpG(RX, 440, 15, "z2", zkey(2)) + small("zone2_pump_speed", RX - 26, 446, "end", "z2");
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
      pumps += pumpG(RX, py, 16, "z1", zkey(1)) + small("zone1_pump_speed", RX - 28, py + 6, "end", "z1");
    }
    front += arrow(AX2, 242, "r", "hot") + arrow(AX2, 278, "l", "cold");
    front += arrow(VX, 300, "d", "hot") + arrow(RX, 300, "u", "cold");

    let zoneSvg = "";
    zones.forEach((z) => {
      const k = `z${z.i}`, p = `zone${z.i}_`;
      let em = "";
      if (z.kind === "radiator") {
        let cols = "";
        for (let x = EX + 8; x <= EX + EW - 18; x += 13) cols += `<rect class="r-col" x="${x}" y="${z.y0 + 9}" width="11" height="${z.h - 18}" rx="5.5"/>`;
        em = `
          <ellipse class="shadow" cx="${EX + EW / 2}" cy="${z.y0 + z.h + 7}" rx="${EW / 2}" ry="5" ${soft}/>
          <rect class="r-back" x="${EX}" y="${z.y0}" width="${EW}" height="${z.h}" rx="6"/>
          ${cols}
          <rect class="r-bar" x="${EX + 1}" y="${z.y0 + 1}" width="${EW - 2}" height="9" rx="4.5"/>
          <rect class="r-bar" x="${EX + 1}" y="${z.y0 + z.h - 10}" width="${EW - 2}" height="9" rx="4.5"/>
          <rect class="r-valve" x="${EX + EW - 2}" y="${z.y0 + 1}" width="10" height="9" rx="2"/>
          <rect class="r-head" x="${EX + EW + 7}" y="${z.y0 - 2}" width="10" height="15" rx="3"/>
          <rect class="glow" x="${EX}" y="${z.y0}" width="${EW}" height="${z.h}" rx="6"/>
          ${waves(EX, EW, z.y0 - 8)}`;
      } else {
        let caps = "", heads = "", loops = "", flows = "";
        const yb = z.y0 + z.h;
        for (let n = 0; n < 5; n++) {
          const xv = EX + 26 + n * 27;
          caps += `<rect class="brass" x="${xv - 4}" y="${z.vin - 19}" width="8" height="13" rx="2"/>`;
          heads += `<rect class="vhead" x="${xv - 6}" y="${z.rout - 22}" width="12" height="15" rx="3"/>`;
          const xl = EX + 20 + n * 28, w = 14, bot = z.loopEnd;
          const dU = `M${xl} ${yb} V${bot - w / 2} A ${w / 2} ${w / 2} 0 0 0 ${xl + w} ${bot - w / 2} V${yb}`;
          loops += `<path class="loop-ol" d="${dU}"/>`;
          loops += `<path class="loop-h" d="M${xl} ${yb} V${bot - w / 2} A ${w / 2} ${w / 2} 0 0 0 ${xl + w / 2} ${bot}"/>`;
          loops += `<path class="loop-c" d="M${xl + w / 2} ${bot} A ${w / 2} ${w / 2} 0 0 0 ${xl + w} ${bot - w / 2} V${yb}"/>`;
          flows += flowOnly(dU, k);
        }
        em = `
          ${loops}${flows}
          <ellipse class="shadow" cx="${EX + EW / 2}" cy="${yb + 4}" rx="${EW / 2}" ry="4" ${soft}/>
          <rect class="cab" x="${EX}" y="${z.y0}" width="${EW}" height="${z.h}" rx="4"/>
          <rect class="cab-in" x="${EX + 6}" y="${z.y0 + 6}" width="${EW - 12}" height="${z.h - 12}" rx="3"/>
          <rect class="bar-h" x="${EX + 8}" y="${z.vin - 7}" width="${EW - 16}" height="14" rx="7"/>
          <rect class="bar-c" x="${EX + 8}" y="${z.rout - 7}" width="${EW - 16}" height="14" rx="7"/>
          ${caps}${heads}
          <rect class="glow" x="${EX}" y="${z.y0}" width="${EW}" height="${z.h}" rx="4"/>`;
      }
      const name = esc(c[p + "name"] || (z.kind === "radiator" ? T.radiator : T.floor));
      const compact = type === "both" && z.i === 1;
      const ny = compact ? 436 : 662;
      zoneSvg += `
        <g class="emitter" data-on="${k}"${ek(zkey(z.i))}>${em}</g>
        ${tag(p + "vl_temp", EX + 4, z.vin, "h")}
        ${tag(p + "rl_temp", EX + 4, z.rout, "c")}
        <text class="name" x="${EX + EW / 2}" y="${ny}" text-anchor="middle"${compact ? ' style="font-size:20px"' : ""}>${name}</text>`;
    });

    /* Außengerät (gezeichnet, 3D) */
    let slats = "", grooves = "", spokes = "";
    for (let y = 392; y <= 602; y += 9) slats += `<line class="slat-d" x1="48" y1="${y}" x2="232" y2="${y}"/><line class="slat-l" x1="48" y1="${y + 1.6}" x2="232" y2="${y + 1.6}"/>`;
    for (let x = 316; x <= 330; x += 7) grooves += `<line class="u-groove" x1="${x}" y1="${380 - (x - 310) * 0.9}" x2="${x}" y2="${606 - (x - 310) * 0.9}"/>`;
    for (let a = 0; a < 360; a += 22.5) {
      const r1 = 14, r2 = 76, rad = (a * Math.PI) / 180;
      spokes += `M${(135 + r1 * Math.cos(rad)).toFixed(1)} ${(495 + r1 * Math.sin(rad)).toFixed(1)} L${(135 + r2 * Math.cos(rad)).toFixed(1)} ${(495 + r2 * Math.sin(rad)).toFixed(1)} `;
    }
    const blades = [0, 120, 240].map((a) =>
      `<path d="M135 495 C124 462 136 428 168 423 C183 449 167 481 135 495Z" transform="rotate(${a} 135 495)"/>`).join("");
    const unit = `
      <g${ek("compressor")}>
        <ellipse class="shadow" cx="190" cy="622" rx="160" ry="9" ${soft}/>
        <rect class="u-foot" x="62" y="604" width="38" height="16" rx="3"/>
        <rect class="u-foot" x="250" y="604" width="38" height="16" rx="3"/>
        <path class="u-side" d="M310 380 L334 358 V586 L310 610 Z"/>
        ${grooves}
        <path class="u-top" d="M40 380 L64 358 H334 L310 380 Z"/>
        <rect class="u-front" x="40" y="380" width="270" height="230" rx="6"/>
        ${slats}
        <circle class="fan-bezel" cx="135" cy="495" r="86"/>
        <circle class="fan-bg" cx="135" cy="495" r="77"/>
        <g class="fan" data-on="fan"><g class="blades" style="transform-origin:135px 495px">${blades}</g></g>
        <path class="grille" d="${spokes}"/>
        <circle class="grille" cx="135" cy="495" r="26"/><circle class="grille" cx="135" cy="495" r="42"/>
        <circle class="grille" cx="135" cy="495" r="58"/><circle class="grille" cx="135" cy="495" r="74"/>
        <circle class="fan-hub" cx="135" cy="495" r="13"/>
        <rect class="u-cut" x="240" y="392" width="62" height="206" rx="4"/>
        <rect class="pcb" x="246" y="398" width="50" height="30" rx="2"/>
        <circle cx="256" cy="408" r="2.5" fill="#4ade80"/><rect x="264" y="404" width="24" height="4" rx="1" fill="#8b929c"/><rect x="264" y="412" width="18" height="4" rx="1" fill="#8b929c"/>
        <path class="copper" d="M262 478 V452 Q262 440 274 440 H292"/><path class="copper-hl" d="M260.5 478 V452 Q260.5 438.5 274 438.5 H292"/>
        <path class="copper" d="M282 478 V458 Q282 450 292 450"/><path class="copper-hl" d="M280.5 478 V458 Q280.5 448.5 292 448.5"/>
        <g class="compressor" data-on="compressor">
          <rect class="comp-glow" x="248" y="474" width="46" height="118" rx="16" ${blur}/>
          <rect class="comp" x="254" y="480" width="34" height="106" rx="9"/>
          <rect class="comp-tint" x="254" y="480" width="34" height="106" rx="9"/>
          <ellipse class="comp-top" cx="271" cy="481" rx="17" ry="5"/>
          <path class="copper" d="M264 520 H252"/><path class="copper-hl" d="M264 518.5 H252"/>
        </g>
        <g class="defrost" data-on="defrost">
          <rect class="frost" x="40" y="380" width="270" height="230" rx="6"/>
          ${flake(86, 432, 11)}${flake(190, 450, 9)}${flake(104, 562, 9)}${flake(178, 548, 12)}${flake(271, 425, 8)}
          ${[80, 135, 190, 270].map((x, n) => `<circle class="drip" cx="${x}" cy="622" r="3.5" style="animation-delay:${n * 0.35}s"/>`).join("")}
        </g>
        <rect class="u-edge" x="40" y="380" width="270" height="230" rx="6"/>
      </g>`;

    /* Speicher mit Innengerät (gezeichnet) */
    let coilF = "", coilB = "", coilH = "";
    for (let y = 412; y <= 584; y += 11) {
      coilB += `M492 ${y} A 48 7 0 0 1 588 ${y} `;
      coilF += `M492 ${y} A 48 7 0 0 0 588 ${y} `;
      coilH += `M500 ${y + 3} A 40 5 0 0 0 580 ${y + 3} `;
    }
    const ports = [490, 514, 538, 562, 586, 610].map((x) => `<rect class="port" x="${x - 7}" y="${PY - 8}" width="14" height="10" rx="2"/>`).join("");
    const tank = `
      <ellipse class="shadow" cx="550" cy="626" rx="102" ry="8" ${soft}/>
      <rect class="t-plinth" x="466" y="604" width="168" height="20" rx="6"/>
      <rect class="t-body" x="460" y="372" width="180" height="240" rx="16"/>
      <rect class="t-cut" x="476" y="394" width="148" height="204" rx="10"/>
      <rect class="t-heat" x="476" y="394" width="148" height="204" rx="10" fill="url(#${u}-tank)"/>
      <path class="coil-back" d="${coilB}"/>
      <line class="t-pipe" x1="540" y1="398" x2="540" y2="592"/>
      <path class="coil" d="${coilF}"/>
      <path class="coil-hl" d="${coilH}"/>
      ${has("heater_rod") ? `
      <g class="heater" data-on="heater_rod"${ek("heater_rod")}>
        <rect class="rod-glow" x="597" y="384" width="20" height="186" rx="10" ${blur}/>
        <rect class="rod" x="603" y="380" width="9" height="182" rx="4.5"/>
        <rect class="rod-tint" x="603" y="380" width="9" height="182" rx="4.5"/>
      </g>` : ""}
      <rect class="t-head" x="460" y="${PY}" width="180" height="82" rx="12"/>
      <path class="t-headhl" d="M472 ${PY + 3} H628"/>
      ${ports}
      <rect class="t-display" x="474" y="314" width="94" height="48" rx="6"/>
      <g class="leds" data-on="compressor">
        <rect class="led" x="484" y="324" width="40" height="5" rx="2"/>
        <rect class="led" x="484" y="335" width="56" height="5" rx="2"/>
        <rect class="led" x="484" y="346" width="28" height="5" rx="2"/>
        <rect class="led" x="548" y="324" width="12" height="12" rx="3"/>
      </g>
      ${has("zone1_mixer") ? `<g${ek("zone1_mixer")}>
        <path class="mixer" d="M591 322 L615 338 L615 322 L591 338 Z M603 330 L595 345 L611 345 Z"/>
        <text class="s" x="603" y="372" text-anchor="middle"><tspan data-val="zone1_mixer">–</tspan></text></g>` : ""}`;

    /* Zapfstelle (Chrom) */
    const tap = `
      <rect class="chrome" x="864" y="160" width="20" height="56" rx="5"/>
      <rect class="chrome" x="860" y="166" width="28" height="7" rx="2"/>
      <rect class="chrome" x="860" y="200" width="28" height="7" rx="2"/>
      <rect class="chrome" x="870" y="138" width="8" height="24" rx="2"/>
      <rect class="chrome" x="856" y="132" width="36" height="9" rx="4.5"/>
      <circle class="chrome" cx="856" cy="136.5" r="5.5"/><circle class="chrome" cx="892" cy="136.5" r="5.5"/>
      <path class="spout-ol" d="M884 180 H904 Q922 180 922 198 V214"/>
      <path class="spout" d="M884 180 H904 Q922 180 922 198 V214"/>
      <path class="spout-hl" d="M886 177.5 H904 Q919 177.5 919.5 192"/>
      <rect class="chrome" x="914" y="212" width="16" height="10" rx="2"/>`;

    /* Haus-Symbol mit Innen- und Außentemperatur (höher, mehr Abstand zu den Leitungen) */
    const house = (has("indoor_temp") || has("outdoor_temp")) ? `
      <path class="house" d="M30 72 L97 26 L164 72 M42 64 V134 H152 V64 M128 46 V30 H142 V56"/>
      ${has("indoor_temp") ? `<g${ek("indoor_temp")}><text class="l" x="97" y="93" text-anchor="middle" style="font-size:15px">${T.indoor}</text>
        <text class="v" x="97" y="122" text-anchor="middle" style="font-size:22px" data-val="indoor_temp">–</text></g>` : ""}
      ${has("outdoor_temp") ? `<g${ek("outdoor_temp")}><text class="l" x="176" y="93" style="font-size:15px">${T.outdoor}</text>
        <text class="v" x="176" y="122" style="font-size:22px" data-val="outdoor_temp">–</text></g>` : ""}` : "";

    /* Status-Chips (eine Zeile) */
    const chipDefs = [
      ["compressor", "#22c55e"], ["defrost", "#38bdf8"], ["dhw_active", "#f59e0b"],
      ["dhw_boost", "#ef4444"], ["heater_rod", "#f97316"], ["circulation", "#a78bfa"],
    ].filter(([k]) => has(k));
    const CW = 150, CG = 10;
    const cx0 = 500 - (chipDefs.length * CW + (chipDefs.length - 1) * CG) / 2;
    const chipY = 704;
    const chips = chipDefs.map(([k, col], n) => {
      const x = cx0 + n * (CW + CG);
      return `<g class="chip" data-on="${k}"${ek(k)} style="--chip-c:${col}">
        <rect x="${x}" y="${chipY}" width="${CW}" height="34" rx="17"/>
        <circle cx="${x + 19}" cy="${chipY + 17}" r="5.5"/>
        <text x="${x + 33}" y="${chipY + 23}">${T[k]}</text></g>`;
    }).join("");

    /* Untere Leiste */
    const bottomKeys = ["power", "heat_power", "cop", "mode"].filter(has);
    const statY = chipDefs.length ? 754 : 700;
    const H = bottomKeys.length ? statY + 72 : chipDefs.length ? 750 : 700;
    const gap = 12, bw = bottomKeys.length ? (940 - gap * (bottomKeys.length - 1)) / bottomKeys.length : 0;
    const stats = bottomKeys.map((k, n) => {
      const x = 30 + n * (bw + gap);
      return `<g class="stat"${ek(k)}>
        <rect x="${x}" y="${statY}" width="${bw}" height="62" rx="12"/>
        <text class="l" x="${x + bw / 2}" y="${statY + 24}" text-anchor="middle">${T[k]}</text>
        <text class="v" x="${x + bw / 2}" y="${statY + 52}" text-anchor="middle" data-val="${k}">–</text></g>`;
    }).join("");

    /* Texte – Werte auf gemeinsamen Höhen: 156 (oben), 345 (VL/RL WP) */
    const texts = `
      ${c.title ? `<text class="title" x="500" y="62" text-anchor="middle">${esc(c.title)}</text>` : ""}
      <text class="l" x="${AX1}" y="104" text-anchor="middle">${T.primary}</text>
      <text class="l" x="${AX1}" y="126" text-anchor="middle">${T.heatpump}</text>
      ${label("pressure", AX1, 156, "", "middle")}
      ${label("vl_temp", 206, 345, T.vl, "end")}
      ${label("rl_temp", 282, 345, T.rl, "start")}
      ${small("pump_speed", 284, 306, "start", "primary")}
      <text class="l" x="${AX2 + 15}" y="104" text-anchor="middle">${T.dhw}</text>
      ${has("dhw_temp") || has("dhw_setpoint") ? `<text x="${AX2 + 15}" y="156" text-anchor="middle">
        ${has("dhw_temp") ? `<tspan class="v" data-val="dhw_temp"${ek("dhw_temp")}>–</tspan>` : ""}
        ${has("dhw_setpoint") ? `<tspan class="l"${ek("dhw_setpoint")}>  ${T.set} </tspan><tspan class="l" data-val="dhw_setpoint"${ek("dhw_setpoint")}>–</tspan>` : ""}
      </text>` : ""}
      ${label("tank_top_temp", 448, 440, "", "end")}
      ${label("tank_bottom_temp", 448, 592, "", "end")}
      <text class="name" x="175" y="662" text-anchor="middle">${T.unit}</text>
      <text class="name" x="550" y="662" text-anchor="middle">${T.tank}</text>`;

    const primaryKey = has("pump") ? "pump" : has("pump_speed") ? "pump_speed" : null;
    const lg = (id, x2, y2, stops) => `<linearGradient id="${u}-${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, col]) => `<stop offset="${o}" stop-color="${col}"/>`).join("")}</linearGradient>`;

    this.shadowRoot.innerHTML = `
      <style>${HP_STYLE.replace(/UID/g, u)}</style>
      <ha-card class="${c.theme_background ? "themed" : ""}">
        <svg viewBox="0 0 1000 ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="${u}-tank" x1="0" y1="0" x2="0" y2="1">
              <stop id="${u}-top" offset="0" stop-color="#e5483e"/>
              <stop id="${u}-bot" offset="1" stop-color="#3f7fd9"/>
            </linearGradient>
            ${lg("ufront", 0, 1, [[0, "#f3f5f7"], [1, "#c6ccd3"]])}
            ${lg("utop", 0, 1, [[0, "#ffffff"], [1, "#dde1e6"]])}
            ${lg("uside", 0, 1, [[0, "#b7bdc6"], [1, "#868e99"]])}
            ${lg("cutbg", 1, 0, [[0, "#14171c"], [0.5, "#2d323b"], [1, "#171a20"]])}
            ${lg("metal", 1, 0, [[0, "#5b636f"], [0.35, "#e2e6ea"], [0.6, "#a3abb5"], [1, "#4b525d"]])}
            ${lg("blade", 0, 1, [[0, "#8a96a6"], [1, "#3b4350"]])}
            ${lg("tbody", 1, 0, [[0, "#c2c8cf"], [0.3, "#fbfcfd"], [0.55, "#eef0f3"], [1, "#b3bac3"]])}
            ${lg("plinth", 0, 1, [[0, "#9aa2ad"], [1, "#6b7380"]])}
            ${lg("tcut", 1, 0, [[0, "#0d0f14"], [0.45, "#2b303a"], [1, "#101318"]])}
            ${lg("head", 0, 1, [[0, "#3c424c"], [1, "#1c1f25"]])}
            ${lg("screen", 0, 1, [[0, "#14202c"], [1, "#070a0e"]])}
            ${lg("chrome", 0, 1, [[0, "#f6f8fa"], [0.45, "#a9b1bb"], [0.55, "#8b939e"], [1, "#e1e5ea"]])}
            ${lg("radcol", 1, 0, [[0, "#c9ced5"], [0.4, "#ffffff"], [1, "#b8bec6"]])}
            ${lg("radbar", 0, 1, [[0, "#ffffff"], [1, "#c3c8cf"]])}
            ${lg("cab", 0, 1, [[0, "#eceef1"], [1, "#b5bcc5"]])}
            ${lg("barh", 0, 1, [[0, "#ff8a7e"], [0.4, "#d8463c"], [1, "#8f2a24"]])}
            ${lg("barc", 0, 1, [[0, "#8fbaff"], [0.4, "#3f7fd9"], [1, "#1d4686"]])}
            ${lg("brass", 1, 0, [[0, "#8a6418"], [0.45, "#f3d27a"], [1, "#9a7020"]])}
            <radialGradient id="${u}-fanbg"><stop offset="0" stop-color="#2f3640"/><stop offset="1" stop-color="#0f1216"/></radialGradient>
            <radialGradient id="${u}-bezel" cx=".4" cy=".35"><stop offset="0" stop-color="#f2f4f6"/><stop offset="1" stop-color="#9ea6b0"/></radialGradient>
            <radialGradient id="${u}-pump" cx=".4" cy=".35"><stop offset="0" stop-color="#3a414c"/><stop offset="1" stop-color="#15181d"/></radialGradient>
            <filter id="${u}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
            <filter id="${u}-soft" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="4"/></filter>
          </defs>
          ${back}
          ${front}
          ${unit}
          ${tank}
          ${tap}
          ${zoneSvg}
          ${pumpG(256, 300, 17, "primary", primaryKey)}
          ${has("circulation") ? pumpG(800, 188, 10, "circ", "circulation") : ""}
          ${pumps}
          ${house}
          ${softSvg}
          ${texts}
          ${chips}
          ${stats}
        </svg>
      </ha-card>`;

    this._svg = this.shadowRoot.querySelector("svg");
    this._flagEls = [...this.shadowRoot.querySelectorAll("[data-on]")];
    this._valEls = [...this.shadowRoot.querySelectorAll("[data-val]")];
    this._leakEl = this.shadowRoot.querySelector(".leak");
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
      soft: (num("softener_flow") || 0) > 0,
    };
    this._flagEls.forEach((el) => el.classList.toggle("on", !!flags[el.dataset.on]));
    this._valEls.forEach((el) => { el.textContent = this._fmt(c[el.dataset.val]); });

    if (this._leakEl) {
      const alarm = c.leak_alarm ? on("leak_alarm") : false;
      const closed = c.leak_valve ? !on("leak_valve") : false;
      this._leakEl.classList.toggle("alarm", alarm);
      this._leakEl.classList.toggle("closed", !alarm && closed);
    }

    const s = this._svg.style;
    const zd1 = dur(pct("zone1_pump_speed")), zd2 = dur(pct("zone2_pump_speed"));
    s.setProperty("--primary-dur", dur(pct("pump_speed")));
    s.setProperty("--z1-dur", zd1);
    s.setProperty("--z2-dur", zd2);
    s.setProperty("--zany-dur", z1 ? zd1 : zd2);
    s.setProperty("--circ-dur", "1.2s");
    s.setProperty("--soft-dur", "1.4s");

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
    const first = !this._hass;
    this._hass = hass;
    if (this._form) this._form.hass = hass;
    if (first && this._config) this._render();
  }

  _t() { return HP_I18N[hpLang(this._config, this._hass)]; }

  _schema() {
    const t = this._t();
    const e = (name) => ({ name, selector: { entity: {} } });
    const both = this._config.heating_type === "both";
    const zone = (i) => ({
      type: "expandable", name: `sec_zone${i}`, flatten: true,
      title: `${t.sec.zone} ${i}` + (both ? (i === 1 ? ` (${t.opt.radiator})` : ` (${t.opt.floor})`) : ""),
      schema: [
        { name: `zone${i}_name`, selector: { text: {} } },
        e(`zone${i}_vl_temp`), e(`zone${i}_rl_temp`), e(`zone${i}_pump`), e(`zone${i}_pump_speed`),
        ...(i === 1 ? [] : [e(`zone${i}_mixer`)]),
      ],
    });
    const schema = [
      { name: "title", selector: { text: {} } },
      {
        name: "language",
        selector: { select: { mode: "dropdown", options: [
          { value: "auto", label: t.opt.auto }, { value: "de", label: "Deutsch" }, { value: "en", label: "English" },
          { value: "fr", label: "Français" }, { value: "nl", label: "Nederlands" }, { value: "it", label: "Italiano" },
        ] } },
      },
      {
        name: "heating_type",
        selector: { select: { mode: "dropdown", options: [
          { value: "radiator", label: t.opt.radiator }, { value: "floor", label: t.opt.floor }, { value: "both", label: t.opt.both },
        ] } },
      },
      { name: "theme_background", selector: { boolean: {} } },
      {
        type: "expandable", name: "sec_hp", flatten: true, title: t.sec.hp,
        schema: ["outdoor_temp", "indoor_temp", "compressor", "defrost", "vl_temp", "rl_temp", "pump", "pump_speed", "pressure"].map(e),
      },
      {
        type: "expandable", name: "sec_dhw", flatten: true, title: t.sec.dhw,
        schema: ["dhw_temp", "dhw_setpoint", "tank_top_temp", "tank_bottom_temp", "zone1_mixer", "dhw_active", "dhw_boost", "heater_rod", "circulation"].map(e),
      },
      {
        type: "expandable", name: "sec_soft", flatten: true, title: t.sec.soft,
        schema: [
          { name: "softener", selector: { boolean: {} } },
          ...(this._config.softener ? ["softener_flow", "softener_hardness", "leak_alarm", "leak_valve"].map(e) : []),
        ],
      },
      {
        type: "expandable", name: "sec_energy", flatten: true, title: t.sec.energy,
        schema: ["power", "heat_power", "cop", "mode"].map(e),
      },
      zone(1),
    ];
    if (both) schema.push(zone(2));
    return schema;
  }

  _label(s) {
    const t = this._t();
    const m = /^zone(\d)_(name|vl_temp|rl_temp|pump_speed|pump|mixer)$/.exec(s.name || "");
    if (m && !(m[1] === "1" && m[2] === "mixer")) {
      const map = { name: "zname", vl_temp: "zvl", rl_temp: "zrl", pump: "zpump", pump_speed: "zspeed", mixer: "zmixer" };
      return `${t.sec.zone} ${m[1]}: ${t.lbl[map[m[2]]]}`;
    }
    return t.lbl[s.name] || s.title || s.name;
  }

  _helper(s) {
    const t = this._t();
    if (/^zone\d_pump$/.test(s.name || "")) return t.help.zpump;
    return t.help[s.name];
  }

  _render() {
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => this._label(s);
      this._form.computeHelper = (s) => this._helper(s);
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
    description: "Animated heat pump system: outdoor unit, tank, hot water, softener, radiators / underfloor heating",
    preview: true,
  });
}

console.info(`%c WÄRMEPUMPEN-FLOW-CARD %c v${HP_VERSION} `, "color:#fff;background:#d8463c;font-weight:700", "color:#d8463c;background:#fff");
