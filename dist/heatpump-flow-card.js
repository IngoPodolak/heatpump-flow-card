/*
 * Wärmepumpen Flow Card für Home Assistant
 * Animierte Anlagenansicht: Außengerät, Speicher, Warmwasser, Enthärtung, Heizkörper / FBH
 * Primär entworfen für Daikin Altherma 4 mit ECH2O-Speicher, nutzbar für jede Wärmepumpe.
 * https://github.com/IngoPodolak/heatpump-flow-card
 */

const HP_VERSION = "1.7.0";

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
    sec: { hp: "Wärmepumpe (Außengerät & Primärkreis)", dhw: "Speicher, Innengerät & Warmwasser", soft: "Enthärtung & Leckageschutz", energy: "Energie & Status (untere Leiste)", zone: "Heizkreis", img: "Hintergrund" },
    opt: { radiator: "Heizkörper", floor: "Fußbodenheizung", both: "Heizkörper + Fußbodenheizung (2 Heizkreise)", auto: "Automatisch (HA-Sprache)", bg_drawn: "Gezeichnete Grafik", bg_altherma: "Bild: Daikin Altherma 4 (integriert)", bg_custom: "Eigenes Bild (Upload, URL oder Medien)" },
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
      background: "Darstellung", background_image: "Bild hochladen oder URL", show_grid: "Positionier-Raster anzeigen (%)", overlay: "Positionen anpassen (YAML, in % des Bildes)",
    },
    help: {
      pump_speed: "Steuert auch die Geschwindigkeit der Pumpen- und Rohranimation",
      zone1_mixer: "Mischer im Innengerät – mischt Heizkreis und Wärmepumpenkreis",
      zpump: "Leer lassen: aktiv, wenn die Umwälzpumpe läuft und keine Brauchwasserbereitung aktiv ist",
      leak_alarm: "Ein = Leck erkannt (Symbol wird rot)", leak_valve: "Aus/zu = Wasser abgesperrt (Symbol wird gelb)",
      background: "Altherma-Bild gibt es für Heizkörper und Fußbodenheizung; bei 2 Heizkreisen wird die gezeichnete Grafik verwendet.", background_image: "Bild direkt hier hochladen oder URL eintragen – auch media-source:// aus dem Medienbrowser. Kein Kopieren nötig.", overlay: "Nur Abweichungen eintragen, z. B. labels: { vl_temp: [19, 46] }",
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
    sec: { hp: "Heat pump (outdoor unit & primary circuit)", dhw: "Tank, indoor unit & hot water", soft: "Water softener & leak protection", energy: "Energy & status (bottom bar)", zone: "Heating circuit", img: "Background" },
    opt: { radiator: "Radiators", floor: "Underfloor heating", both: "Radiators + underfloor heating (2 circuits)", auto: "Automatic (HA language)", bg_drawn: "Drawn graphic", bg_altherma: "Image: Daikin Altherma 4 (built-in)", bg_custom: "Custom image (upload, URL or media)" },
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
      background: "Display", background_image: "Upload image or URL", show_grid: "Show positioning grid (%)", overlay: "Adjust positions (YAML, in % of the image)",
    },
    help: {
      pump_speed: "Also controls the speed of the pump and pipe animation",
      zone1_mixer: "Mixing valve inside the indoor unit – blends heating and heat pump circuit",
      zpump: "Leave empty: active when the circulation pump runs and no hot water heating is active",
      leak_alarm: "On = leak detected (icon turns red)", leak_valve: "Off/closed = water shut off (icon turns yellow)",
      background: "The Altherma image exists for radiators and underfloor heating; with 2 circuits the drawn graphic is used.", background_image: "Upload an image right here or enter a URL – media-source:// from the media browser works too. No copying needed.", overlay: "Only enter changes, e.g. labels: { vl_temp: [19, 46] }",
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
    sec: { hp: "Pompe à chaleur (unité extérieure & circuit primaire)", dhw: "Ballon, unité intérieure & eau chaude", soft: "Adoucisseur & protection fuite", energy: "Énergie & état (barre inférieure)", zone: "Circuit de chauffage", img: "Arrière-plan" },
    opt: { radiator: "Radiateurs", floor: "Plancher chauffant", both: "Radiateurs + plancher chauffant (2 circuits)", auto: "Automatique (langue HA)", bg_drawn: "Graphique dessiné", bg_altherma: "Image : Daikin Altherma 4 (intégrée)", bg_custom: "Image personnelle (envoi, URL ou médias)" },
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
      background: "Affichage", background_image: "Envoyer une image ou URL", show_grid: "Afficher la grille de positionnement (%)", overlay: "Ajuster les positions (YAML, en % de l'image)",
    },
    help: {
      pump_speed: "Règle aussi la vitesse de l'animation des pompes et tuyaux",
      zone1_mixer: "Vanne mélangeuse dans l'unité intérieure – mélange circuit de chauffage et circuit PAC",
      zpump: "Laisser vide : actif quand le circulateur tourne et sans production d'eau chaude",
      leak_alarm: "Marche = fuite détectée (icône rouge)", leak_valve: "Arrêt/fermée = eau coupée (icône jaune)",
      background: "L'image Altherma existe pour radiateurs et plancher chauffant ; avec 2 circuits, le graphique dessiné est utilisé.", background_image: "Envoyez une image ici ou saisissez une URL – media-source:// du navigateur multimédia fonctionne aussi. Aucune copie nécessaire.", overlay: "Saisir seulement les écarts, ex. labels: { vl_temp: [19, 46] }",
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
    sec: { hp: "Warmtepomp (buitenunit & primair circuit)", dhw: "Boiler, binnenunit & warm water", soft: "Waterontharder & lekbeveiliging", energy: "Energie & status (onderbalk)", zone: "Verwarmingscircuit", img: "Achtergrond" },
    opt: { radiator: "Radiatoren", floor: "Vloerverwarming", both: "Radiatoren + vloerverwarming (2 circuits)", auto: "Automatisch (HA-taal)", bg_drawn: "Getekende afbeelding", bg_altherma: "Afbeelding: Daikin Altherma 4 (ingebouwd)", bg_custom: "Eigen afbeelding (upload, URL of media)" },
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
      background: "Weergave", background_image: "Afbeelding uploaden of URL", show_grid: "Positioneerraster tonen (%)", overlay: "Posities aanpassen (YAML, in % van de afbeelding)",
    },
    help: {
      pump_speed: "Bepaalt ook de snelheid van de pomp- en leidinganimatie",
      zone1_mixer: "Mengklep in de binnenunit – mengt verwarmings- en warmtepompcircuit",
      zpump: "Leeg laten: actief als de circulatiepomp draait en er geen tapwater wordt bereid",
      leak_alarm: "Aan = lek gedetecteerd (icoon wordt rood)", leak_valve: "Uit/dicht = water afgesloten (icoon wordt geel)",
      background: "De Altherma-afbeelding bestaat voor radiatoren en vloerverwarming; bij 2 circuits wordt de getekende afbeelding gebruikt.", background_image: "Upload hier een afbeelding of vul een URL in – media-source:// uit de mediabrowser werkt ook. Niets kopiëren nodig.", overlay: "Alleen afwijkingen invullen, bijv. labels: { vl_temp: [19, 46] }",
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
    sec: { hp: "Pompa di calore (unità esterna & circuito primario)", dhw: "Accumulo, unità interna & acqua calda", soft: "Addolcitore & protezione perdite", energy: "Energia & stato (barra inferiore)", zone: "Circuito di riscaldamento", img: "Sfondo" },
    opt: { radiator: "Radiatori", floor: "Riscaldamento a pavimento", both: "Radiatori + pavimento (2 circuiti)", auto: "Automatica (lingua HA)", bg_drawn: "Grafica disegnata", bg_altherma: "Immagine: Daikin Altherma 4 (integrata)", bg_custom: "Immagine propria (caricamento, URL o media)" },
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
      background: "Visualizzazione", background_image: "Carica immagine o URL", show_grid: "Mostra griglia di posizionamento (%)", overlay: "Regola posizioni (YAML, in % dell'immagine)",
    },
    help: {
      pump_speed: "Regola anche la velocità dell'animazione di pompe e tubi",
      zone1_mixer: "Valvola miscelatrice nell'unità interna – miscela circuito di riscaldamento e circuito PdC",
      zpump: "Lasciare vuoto: attivo quando il circolatore funziona e non c'è produzione di acqua calda",
      leak_alarm: "On = perdita rilevata (icona rossa)", leak_valve: "Off/chiusa = acqua chiusa (icona gialla)",
      background: "L'immagine Altherma esiste per radiatori e pavimento; con 2 circuiti viene usata la grafica disegnata.", background_image: "Carica un'immagine qui o inserisci un URL – funziona anche media-source:// dal browser multimediale. Nessuna copia necessaria.", overlay: "Inserire solo le modifiche, es. labels: { vl_temp: [19, 46] }",
    },
  },
};

const hpLang = (config, hass) => {
  const want = config && config.language && config.language !== "auto" ? config.language : (hass && (hass.locale?.language || hass.language)) || "de";
  const short = String(want).slice(0, 2).toLowerCase();
  return HP_I18N[short] ? short : "en";
};


/* Standard-Positionen für den Bild-Modus, in % von Bildbreite (x) und -höhe (y).
   Passend zu den Altherma-4-Schemabildern; per "overlay" einzeln überschreibbar. */
const HP_IMG_DEFAULT = {
  labels: {
    pressure: [45.5, 23.4], zone1_mixer: [68.6, 53.2],
    dhw_temp: [74, 20.2], dhw_setpoint: [79.8, 20.2, "start"], vl_temp: [23.6, 46.6], rl_temp: [38.1, 47.1],
    pump_speed: [35.3, 41, "start"], tank_top_temp: [49, 60], tank_bottom_temp: [49, 80],
    zone1_pump_speed: [75.5, 66.6], zone1_vl_temp: [85.5, 60], zone1_rl_temp: [85.5, 79.5],
    softener: [89.3, 39.4], leak: [98, 38.6],
  },
  captions: {
    primary: [45.5, 14.2], primary2: [45.5, 18], dhw: [74, 14.2],
    unit: [18.6, 96.8], tank: [64, 96.8], emitter: [88.6, 88.4], softener: [89.5, 47.6],
  },
  flows: {
    primary_vl: "29.1,49.5 29.1,26.9 60.4,26.9 60.4,40.7",
    primary_rl: "57.1,41.6 57.1,32.7 32.6,32.7 32.6,49.5",
    circ: "63.6,40.4 63.6,26.9 77.6,26.9 77.6,29.5 65.9,29.5 65.9,40.7",
    soft: "100,42.45 79.95,42.45 79.95,29.5 65.9,29.5 65.9,40.7",
    z1_vl: "68.7,41.4 68.7,33.7 77.1,33.7 77.1,59.5 79.4,59.5",
    z1_rl: "79.4,82.1 75.4,82.1 75.4,37.3 70.7,37.3 70.7,41.8",
  },
  pumps: { primary: [32.64, 40.09, 1.7], z1: [75.54, 70.59, 1.7], circ: [77.6, 28.2, 1.1] },
  softener_pipe: "100,42.45 79.95,42.45 79.95,29.5",
  circ_pipe: "77.6,26.9 77.6,29.5",
  house: [3, 13.2],
  mixer: [68.6, 47.4],
  fan: [13.2, 67.1, 6.8, 10.6],
  frost: "3.4,49.3 37.4,49.8 35.6,82.5 30.3,88.4 4.3,79.3",
  compressor: [23.6, 63, 5.7, 18],
  tank: [57.5, 58, 12.5, 25],
  heater: [68.6, 59, 68.6, 80],
  emitters: { z1: [79, 55, 17.4, 28] },
};
const HP_IMG_DEFAULT_FLOOR = {
  labels: { zone1_vl_temp: [86, 56.5], zone1_rl_temp: [86, 73.5] },
  captions: { emitter: [99.2, 93.8, "end"] },
  flows: {
    z1_vl: "68.7,41.4 68.7,33.7 77.1,33.7 77.1,59.5 81,59.5",
    z1_rl: "81,69.5 79.3,69.5 79.3,82.1 75.4,82.1 75.4,37.3 70.7,37.3 70.7,41.8",
  },
  emitters: { z1: [80, 52, 18, 38] },
};
const HP_NON_ENTITY_KEYS = ["type", "title", "heating_type", "zone1_name", "zone2_name", "theme_background", "language", "softener", "background", "background_image", "background_aspect", "overlay", "show_grid"];
const HP_ON_STATES = ["on", "true", "running", "heating", "an", "ein", "aktiv", "active", "open", "yes", "1"];

const HP_STYLE = `
  :host { display: block; }
  ha-card { overflow: hidden; padding: 6px; box-sizing: border-box; height: 100%;
    display: flex; align-items: center; justify-content: center;
    --hp-bg: #1a1b22; --hp-text: #f1f2f4; --hp-text2: #a7adb7; --ol: #1f2329;
    background: radial-gradient(ellipse at 50% 38%, #272a35 0%, #1a1b22 58%, #131418 100%); }
  ha-card.themed { background: var(--hp-bg); --hp-bg: var(--ha-card-background, var(--card-background-color, #1c1c1c));
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
  .shadow { fill: #000; opacity: .55; }
  .brush { fill: #fff; opacity: .55; pointer-events: none; }
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
  .u-edge { fill: none; stroke: var(--ol); stroke-width: 2.6; }
  .u-hl { fill: none; stroke: #ffffff; stroke-width: 1.5; opacity: .9; }
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
  .t-body { fill: url(#UID-tbody); stroke: var(--ol); stroke-width: 2.6; }
  .t-plinth { fill: url(#UID-plinth); stroke: var(--ol); stroke-width: 2; }
  .t-cut { fill: url(#UID-tcut); stroke: var(--ol); stroke-width: 2; }
  .t-heat { opacity: .22; }
  .coil-back { fill: none; stroke: #6d3b1c; stroke-width: 4; opacity: .7; }
  .coil { fill: none; stroke: url(#UID-tank); stroke-width: 5.5; stroke-linecap: round; }
  .coil-hl { fill: none; stroke: rgba(255,255,255,.4); stroke-width: 1.4; }
  .t-pipe { stroke: url(#UID-metal); stroke-width: 6; }
  .t-head { fill: url(#UID-head); stroke: var(--ol); stroke-width: 2.2; }
  .t-top { fill: #4a515c; stroke: var(--ol); stroke-width: 2; stroke-linejoin: round; }
  .t-side { fill: #16191e; stroke: var(--ol); stroke-width: 2; stroke-linejoin: round; }
  .port-top { fill: #e3e7eb; stroke: var(--ol); stroke-width: 1; }
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
  .r-top { fill: url(#UID-radbar); stroke: var(--ol); stroke-width: 1.8; stroke-linejoin: round; }
  .r-side { fill: #8b939e; stroke: var(--ol); stroke-width: 1.8; stroke-linejoin: round; }
  .r-back { fill: #b9bfc8; stroke: var(--ol); stroke-width: 2; }
  .r-col { fill: url(#UID-radcol); stroke: #8f97a2; stroke-width: 1; }
  .r-bar { fill: url(#UID-radbar); stroke: var(--ol); stroke-width: 1.2; }
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
  .spout-ol { fill: none; stroke: var(--ol); stroke-width: 12.5; stroke-linecap: round; stroke-linejoin: round; }
  .spout { fill: none; stroke: #b7bec8; stroke-width: 9.5; stroke-linecap: round; stroke-linejoin: round; }
  .tapc { fill: url(#UID-chromev); stroke: var(--ol); stroke-width: 1.6; stroke-linejoin: round; }
  .tap-band { fill: #8b939e; }
  .thread { fill: none; stroke: rgba(0,0,0,.4); stroke-width: 1; }
  .tap-hl { fill: none; stroke: rgba(255,255,255,.8); stroke-width: 1.8; stroke-linecap: round; }
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

  /* Bild-Modus */
  .ovt { font-size: 26px; font-weight: 600; fill: #fff; }
  .ovt.small { font-size: 19px; }
  .ovt.title { font-size: 40px; font-weight: 500; }
  .ovt .ovl { font-size: 17px; font-weight: 400; fill: #d5dae0; }
  .ovf { opacity: 0; transition: opacity .5s; pointer-events: none; }
  .ovf.on { opacity: 1; }
  .ovf-glow { fill: none; stroke-width: 12; opacity: .55; stroke-linejoin: round; }
  .ovf-line { fill: none; stroke-width: 4; opacity: .5; stroke-linejoin: round; stroke-linecap: round; }
  .ovf.h .ovf-glow, .ovf.h .ovf-line { stroke: #ff5a4c; }
  .ovf.c .ovf-glow, .ovf.c .ovf-line { stroke: #4d94ff; }
  .ovf-dots { fill: none; stroke: #fff; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 1.5 16;
    animation-name: hp-dash; animation-timing-function: linear; animation-iteration-count: infinite; }
  .ovp-glow { fill: #22c55e; opacity: 0; transition: opacity .4s; }
  .ovp.on .ovp-glow { opacity: .5; }
  .ovp-hit { fill: transparent; }
  .ovp-ring { fill: none; stroke: #22c55e; stroke-width: 3; stroke-dasharray: 7 6; opacity: 0; }
  .ovp.on .ovp-ring { opacity: 1; animation-name: hp-spin; animation-timing-function: linear; animation-iteration-count: infinite; }
  .ovfan { opacity: 0; transition: opacity .6s; pointer-events: none; }
  .ovfan.on { opacity: 1; }
  .ovfan-blur { fill: rgba(170,185,205,.16); }
  .ovfan-blades { transform-origin: 0px 0px; }
  .ovfan-blades path { fill: rgba(205,215,230,.42); stroke: rgba(255,255,255,.35); stroke-width: 1; }
  .ovfan.on .ovfan-blades { animation: hp-spin .55s linear infinite; }
  .ovcomp { opacity: .5; pointer-events: none; }
  .ovcomp rect { fill: #22c55e; opacity: 0; }
  .ovcomp.on rect { animation: hp-pulse 1.6s ease-in-out infinite; }
  .ovtank { mix-blend-mode: color; opacity: .85; pointer-events: none; }
  .ovrod { opacity: 0; transition: opacity .4s; }
  .ovrod.on { opacity: 1; }
  .ovrod-glow { fill: #f97316; animation: hp-pulse 1.2s ease-in-out infinite; }
  .ovrod-core { fill: #ffb26b; }
  .ovemit { fill: #f97316; opacity: 0; transition: opacity .8s; mix-blend-mode: screen; }
  .emitter.on .ovemit { opacity: .3; }
  .ovpipe-ol { fill: none; stroke: #1a1d23; stroke-width: 8; stroke-linejoin: round; stroke-linecap: round; }
  .ovpipe { fill: none; stroke-width: 5; stroke-linejoin: round; stroke-linecap: round; }
  .ovpipe.dw { stroke: #5c6b85; } .ovpipe.hot { stroke: #c9463d; }
  .ovcap { font-size: 25px; fill: #f1f2f4; }
  .ovcap.small { font-size: 19px; fill: #c9ced6; }
  .tag .tp { font-size: 14px; font-weight: 400; fill: #c9ced6; }
  .house.img { stroke: #c9ced6; fill: rgba(20,22,28,.55); }
  .grid { stroke: rgba(0,255,255,.35); stroke-width: 1; }
  .grid.major { stroke: rgba(255,230,0,.65); }
  .gridt { font-size: 13px; fill: #ffe600; paint-order: stroke; stroke: #000; stroke-width: 3px; }
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
    const bgKey = this._bgKey();
    if (bgKey && this._bgFailed !== bgKey) return this._loadBg(bgKey);
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
    back += pipe(`M538 ${PY} V170 H883`, "hot");
    back += pipe(`M883 206 H562 V${PY}`, "cold");
    front += arrow(AX2, 170, "r", "hot") + arrow(AX2, 206, "l", "cold");
    if (has("circulation")) {
      back += pipe("M800 170 V206", "hot");
      back += flowOnly(`M538 ${PY} V170 H800 V206 H562 V${PY}`, "circ");
    }

    /* Enthärtung (optional) */
    let softSvg = "";
    if (c.softener) {
      back += pipe("M985 264 H830 V206", "dw");
      back += flowOnly(`M985 264 H830 V206 H562 V${PY}`, "soft");
      front += arrow(905, 264, "l", "dw");
      const hasLeak = has("leak_alarm") || has("leak_valve");
      const lk = has("leak_alarm") ? "leak_alarm" : "leak_valve";
      const sx = 846, sy = 294;
      const data = [
        has("softener_flow") ? `<tspan data-val="softener_flow"${ek("softener_flow")}>–</tspan>` : "",
        has("softener_hardness") ? `<tspan data-val="softener_hardness"${ek("softener_hardness")}>–</tspan>` : "",
      ].filter(Boolean).join(`<tspan class="l"> · </tspan>`);
      softSvg = `
        <text class="l" x="985" y="253" text-anchor="end">${T.softener}</text>
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
        { i: 1, kind: "radiator", y0: 338, h: 82, vin: 352, rout: 406 },
        { i: 2, kind: "floor", y0: 486, h: 76, vin: 504, rout: 544, loopEnd: 630 },
      ];
      back += pipe(`M${EX} 544 H${RX} V406`, "cold", "z2");
      back += pipe(`M${EX} 406 H${RX}`, "cold", "z1");
      back += pipe(`M${RX} 406 V278 H610 V${PY}`, "cold", "zany");
      back += pipe(`M586 ${PY} V242 H${VX} V352`, "hot", "zany");
      back += pipe(`M${VX} 352 H${EX}`, "hot", "z1");
      back += pipe(`M${VX} 352 V504 H${EX}`, "hot", "z2");
      if (zkey(1)) pumps += pumpG(RX, 350, 15, "z1", zkey(1)) + small("zone1_pump_speed", RX - 26, 356, "end", "z1");
      if (zkey(2)) pumps += pumpG(RX, 460, 15, "z2", zkey(2)) + small("zone2_pump_speed", RX - 26, 466, "end", "z2");
      if (has("zone2_mixer")) {
        pumps += `<g${ek("zone2_mixer")}>
          <path class="mixer" d="M${VX - 9} 466 L${VX + 9} 490 L${VX - 9} 490 L${VX + 9} 466 Z M${VX} 478 L${VX - 15} 469 L${VX - 15} 487 Z"/></g>`;
        pumps += small("zone2_mixer", RX - 26, 500, "end");
      }
    } else {
      const z = type === "floor"
        ? { i: 1, kind: "floor", y0: 352, h: 112, vin: 384, rout: 436, loopEnd: 616 }
        : { i: 1, kind: "radiator", y0: 362, h: 200, vin: 380, rout: 544 };
      zones = [z];
      back += pipe(`M${EX} ${z.rout} H${RX} V278 H610 V${PY}`, "cold", "z1");
      back += pipe(`M586 ${PY} V242 H${VX} V${z.vin} H${EX}`, "hot", "z1");
      const py = Math.round((278 + z.rout) / 2) + 10;
      if (zkey(1)) pumps += pumpG(RX, py, 16, "z1", zkey(1)) + small("zone1_pump_speed", RX - 28, py + 6, "end", "z1");
    }
    front += arrow(AX2, 242, "r", "hot") + arrow(AX2, 278, "l", "cold");
    front += arrow(VX, 300, "d", "hot") + arrow(RX, 300, "u", "cold");

    let zoneSvg = "";
    const D = 12, DY = 9;
    zones.forEach((z) => {
      const k = `z${z.i}`, p = `zone${z.i}_`;
      let em = "";
      if (z.kind === "radiator") {
        let cols = "";
        for (let x = EX + 8; x <= EX + EW - 18; x += 13) cols += `<rect class="r-col" x="${x}" y="${z.y0 + 9}" width="11" height="${z.h - 18}" rx="5.5"/>`;
        em = `
          <ellipse class="shadow" cx="${EX + EW / 2 + 6}" cy="${z.y0 + z.h + 6}" rx="${EW / 2 + 8}" ry="5" ${soft}/>
          <path class="r-side" d="M${EX + EW} ${z.y0 + 4} L${EX + EW + D} ${z.y0 - DY + 4} V${z.y0 + z.h - DY - 2} L${EX + EW} ${z.y0 + z.h - 2} Z"/>
          <path class="r-top" d="M${EX + 4} ${z.y0} L${EX + D + 4} ${z.y0 - DY} H${EX + EW + D} L${EX + EW} ${z.y0} Z"/>
          <rect class="r-back" x="${EX}" y="${z.y0}" width="${EW}" height="${z.h}" rx="6"/>
          ${cols}
          <rect class="r-bar" x="${EX + 1}" y="${z.y0 + 1}" width="${EW - 2}" height="9" rx="4.5"/>
          <rect class="r-bar" x="${EX + 1}" y="${z.y0 + z.h - 10}" width="${EW - 2}" height="9" rx="4.5"/>
          <rect class="glow" x="${EX}" y="${z.y0}" width="${EW}" height="${z.h}" rx="6"/>
          ${waves(EX, EW, z.y0 - 14)}`;
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
          <path class="r-side" d="M${EX + EW} ${z.y0 + 2} L${EX + EW + D} ${z.y0 - DY + 2} V${z.y0 + z.h - DY - 1} L${EX + EW} ${z.y0 + z.h - 1} Z"/>
          <path class="r-top" d="M${EX + 2} ${z.y0} L${EX + D + 2} ${z.y0 - DY} H${EX + EW + D} L${EX + EW} ${z.y0} Z"/>
          <rect class="cab" x="${EX}" y="${z.y0}" width="${EW}" height="${z.h}" rx="4"/>
          <rect class="cab-in" x="${EX + 6}" y="${z.y0 + 6}" width="${EW - 12}" height="${z.h - 12}" rx="3"/>
          <rect class="bar-h" x="${EX + 8}" y="${z.vin - 7}" width="${EW - 16}" height="14" rx="7"/>
          <rect class="bar-c" x="${EX + 8}" y="${z.rout - 7}" width="${EW - 16}" height="14" rx="7"/>
          ${caps}${heads}
          <rect class="glow" x="${EX}" y="${z.y0}" width="${EW}" height="${z.h}" rx="4"/>`;
      }
      const name = esc(c[p + "name"] || (z.kind === "radiator" ? T.radiator : T.floor));
      const compact = type === "both" && z.i === 1;
      const ny = compact ? 448 : 662;
      zoneSvg += `
        <g class="emitter" data-on="${k}"${ek(zkey(z.i))}>${em}</g>
        ${tag(p + "vl_temp", EX + 4, z.vin, "h")}
        ${tag(p + "rl_temp", EX + 4, z.rout, "c")}
        <text class="name" x="${EX + EW / 2}" y="${ny}" text-anchor="middle"${compact ? ' style="font-size:20px"' : ""}>${name}</text>`;
    });

    /* Außengerät (gezeichnet, 3D) */
    let slats = "", grooves = "", spokes = "";
    for (let y = 392; y <= 602; y += 9) slats += `<line class="slat-d" x1="48" y1="${y}" x2="232" y2="${y}"/><line class="slat-l" x1="48" y1="${y + 1.6}" x2="232" y2="${y + 1.6}"/>`;
    for (let x = 318; x <= 346; x += 7) grooves += `<line class="u-groove" x1="${x}" y1="${(380 - (x - 310) * 0.76).toFixed(1)}" x2="${x}" y2="${(606 - (x - 310) * 0.76).toFixed(1)}"/>`;
    for (let a = 0; a < 360; a += 22.5) {
      const r1 = 14, r2 = 76, rad = (a * Math.PI) / 180;
      spokes += `M${(135 + r1 * Math.cos(rad)).toFixed(1)} ${(495 + r1 * Math.sin(rad)).toFixed(1)} L${(135 + r2 * Math.cos(rad)).toFixed(1)} ${(495 + r2 * Math.sin(rad)).toFixed(1)} `;
    }
    const blades = [0, 120, 240].map((a) =>
      `<path d="M135 495 C124 462 136 428 168 423 C183 449 167 481 135 495Z" transform="rotate(${a} 135 495)"/>`).join("");
    const unit = `
      <g${ek("compressor")}>
        <ellipse class="shadow" cx="200" cy="620" rx="172" ry="10" ${soft}/>
        <rect class="u-foot" x="62" y="604" width="38" height="16" rx="3"/>
        <rect class="u-foot" x="250" y="604" width="38" height="16" rx="3"/>
        <path class="u-foot" d="M300 600 L334 574 V588 L300 614 Z"/>
        <path class="u-side" d="M310 380 L352 348 V578 L310 610 Z"/>
        ${grooves}
        <path class="u-top" d="M40 380 L82 348 H352 L310 380 Z"/><path class="u-hl" d="M46 380 H304"/>
        <rect class="u-front" x="40" y="380" width="270" height="230" rx="6"/>
        <rect class="brush" x="40" y="380" width="270" height="230" rx="6" filter="url(#${u}-brushH)"/>
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
    const ports = [490, 514, 538, 562, 586, 610].map((x) => `<ellipse class="port" cx="${x}" cy="${PY - 5}" rx="7.5" ry="3.5"/><rect class="port" x="${x - 6}" y="${PY - 14}" width="12" height="9" rx="1.5"/><ellipse class="port-top" cx="${x}" cy="${PY - 14}" rx="6" ry="2.5"/>`).join("");
    const tank = `
      <ellipse class="shadow" cx="550" cy="626" rx="102" ry="8" ${soft}/>
      <rect class="t-plinth" x="466" y="604" width="168" height="20" rx="6"/>
      <rect class="t-body" x="460" y="372" width="180" height="240" rx="16"/>
      <rect class="brush" x="460" y="372" width="180" height="240" rx="16" filter="url(#${u}-brushV)"/>
      <rect class="t-cut" x="476" y="394" width="148" height="204" rx="10"/>
      <rect class="t-heat" x="476" y="394" width="148" height="204" rx="10" fill="url(#${u}-tank)"/>
      <rect x="476" y="394" width="148" height="204" rx="10" fill="url(#${u}-ao)"/>
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
      <path class="t-side" d="M638 ${PY + 6} L654 ${PY - 6} V${PY + 70} L638 ${PY + 80} Z"/>
      <path class="t-top" d="M468 ${PY} L482 ${PY - 11} H652 L638 ${PY} Z"/>
      <rect class="t-head" x="460" y="${PY}" width="180" height="82" rx="12"/>
      <path class="t-headhl" d="M472 ${PY + 3} H628"/>
      ${ports}
      <rect class="t-display" x="474" y="314" width="94" height="48" rx="6"/>
      <path d="M478 318 H540 L512 358 H478 Z" fill="url(#${u}-glass)"/>
      <g class="leds" data-on="compressor">
        <rect class="led" x="484" y="324" width="40" height="5" rx="2"/>
        <rect class="led" x="484" y="335" width="56" height="5" rx="2"/>
        <rect class="led" x="484" y="346" width="28" height="5" rx="2"/>
        <rect class="led" x="548" y="324" width="12" height="12" rx="3"/>
      </g>
      ${has("zone1_mixer") ? `<g${ek("zone1_mixer")}>
        <path class="mixer" d="M591 322 L615 338 L615 322 L591 338 Z M603 330 L595 345 L611 345 Z"/>
        <text class="s" x="603" y="372" text-anchor="middle"><tspan data-val="zone1_mixer">–</tspan></text></g>` : ""}`;

    /* Zapfstelle: Wand-Auslaufventil mit Gewinde, Sechskant, Kreuzgriff und Schlauchtülle */
    const tap = `
      <ellipse class="shadow" cx="896" cy="216" rx="24" ry="3.5" ${soft}/>
      <path class="tapc" d="M871 214 Q871 208 878 208 H914 Q921 208 921 214 Z"/>
      <path class="tapc" d="M883 150 H905 V194 Q905 205 914 208 H878 Q883 205 883 194 Z"/>
      <path class="tapc" d="M905 174 L949 171 Q955 171 955 176 V180 Q955 185 949 185 L905 188 Z"/>
      <rect class="tapc" x="943" y="184" width="9" height="5" rx="1.5"/>
      <rect class="tap-band" x="883" y="166" width="22" height="4"/>
      <path class="tap-hl" d="M887.5 153 V203"/>
      <path class="tap-hl" d="M908 175.5 L948 173"/>
      <path class="tapc" d="M882 152 Q883 141 895 139 L944 128 Q951 127 951 133 Q951 137 946 138 L900 149 Q892 151 892 156 Z"/>
      <path class="tap-hl" d="M887 145 Q892 141.5 899 140.5 L943 130.5"/>`;

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
              <stop id="${u}-mid" offset=".55" stop-color="#d0506a"/>
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
            ${lg("chromev", 1, 0, [[0, "#a3abb5"], [0.28, "#f7f9fb"], [0.55, "#d3d8de"], [1, "#8c949f"]])}
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
            <filter id="${u}-brushH" x="0" y="0" width="1" height="1">
              <feTurbulence type="fractalNoise" baseFrequency="0.004 0.55" numOctaves="2" seed="4" result="n"/>
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.6 -0.75" result="w"/>
              <feComposite in="w" in2="SourceGraphic" operator="in"/>
            </filter>
            <filter id="${u}-brushV" x="0" y="0" width="1" height="1">
              <feTurbulence type="fractalNoise" baseFrequency="0.5 0.004" numOctaves="2" seed="9" result="n"/>
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.6 -0.75" result="w"/>
              <feComposite in="w" in2="SourceGraphic" operator="in"/>
            </filter>
            <linearGradient id="${u}-glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity=".06"/><stop offset=".46" stop-color="#fff" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="${u}-ao" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".12" stop-color="#000" stop-opacity="0"/>
              <stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/>
            </linearGradient>
          </defs>
          ${back}
          ${front}
          ${unit}
          ${tank}
          ${tap}
          ${zoneSvg}
          ${primaryKey ? pumpG(256, 300, 17, "primary", primaryKey) : ""}
          ${has("circulation") ? pumpG(800, 188, 10, "circ", "circulation") : ""}
          ${pumps}
          ${house}
          ${softSvg}
          ${texts}
          ${chips}
          ${stats}
        </svg>
      </ha-card>`;

    this._finishBuild();
  }

  _finishBuild() {
    const c = this._config, u = this._uid;
    this._svg = this.shadowRoot.querySelector("svg");
    this._flagEls = [...this.shadowRoot.querySelectorAll("[data-on]")];
    this._valEls = [...this.shadowRoot.querySelectorAll("[data-val]")];
    this._leakEl = this.shadowRoot.querySelector(".leak");
    this._stopTop = this.shadowRoot.getElementById(`${u}-top`);
    this._stopBot = this.shadowRoot.getElementById(`${u}-bot`);
    this._stopMid = this.shadowRoot.getElementById(`${u}-mid`);
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

  /* ---------- Hintergrund ermitteln: integriert, eigenes Bild oder gezeichnet ---------- */
  _bgMode() {
    const c = this._config;
    if (c.background === "drawn" || c.background === "altherma" || c.background === "custom") return c.background;
    return c.background_image ? "custom" : "drawn";
  }

  _bgKey() {
    const c = this._config, mode = this._bgMode();
    if (mode === "altherma") return c.heating_type === "both" ? null : `builtin:${c.heating_type === "floor" ? "altherma_floor" : "altherma_radiator"}`;
    if (mode === "custom") {
      const v = c.background_image;
      const src = v && typeof v === "object" ? v.media_content_id || v.url : v;
      return src ? `custom:${src}` : null;
    }
    return null;
  }

  async _resolveBg(key) {
    if (key.startsWith("builtin:")) {
      HeatpumpFlowCard._imgMod = HeatpumpFlowCard._imgMod || import(new URL("./heatpump-flow-card-images.js", import.meta.url).href);
      const mod = await HeatpumpFlowCard._imgMod;
      const img = mod.HP_IMAGES[key.slice(8)];
      if (!img) throw new Error("Bild nicht gefunden");
      return { key, src: img.src, aspect: img.aspect };
    }
    let src = key.slice(7);
    if (src.startsWith("media-source://")) {
      for (let n = 0; n < 50 && !this._hass; n++) await new Promise((r) => setTimeout(r, 100));
      const res = await this._hass.callWS({ type: "media_source/resolve_media", media_content_id: src });
      src = res.url;
    }
    const aspect = Number(this._config.background_aspect) || await new Promise((resolve) => {
      const im = new Image();
      im.onload = () => resolve(im.naturalWidth && im.naturalHeight ? im.naturalWidth / im.naturalHeight : 1.266);
      im.onerror = () => resolve(1.266);
      im.src = src;
    });
    return { key, src, aspect };
  }

  _loadBg(key) {
    if (this._bg && this._bg.key === key) return this._buildImage(this._bg);
    if (this._bgPending !== key) {
      this._bgPending = key;
      this._resolveBg(key).then((bg) => {
        this._bg = bg;
        if (this._bgPending === key) this._bgPending = null;
        if (this._config && this._bgKey() === key) { this._build(); this._update(); }
      }).catch((e) => {
        console.warn("heatpump-flow-card: Hintergrundbild konnte nicht geladen werden", e);
        if (this._bgPending === key) this._bgPending = null;
        this._bgFailed = key;
        if (this._config && this._bgKey() === key) { this._build(); this._update(); }
      });
    }
    if (!this._svg) {
      this.shadowRoot.innerHTML = `<style>${HP_STYLE}</style><ha-card><div style="width:100%;aspect-ratio:1.27"></div></ha-card>`;
    }
  }

  /* ---------- Bild-Modus: Hintergrundbild + dynamische Elemente ---------- */
  _buildImage(bg) {
    const c = this._config;
    this._lang = hpLang(c, this._hass);
    const T = HP_I18N[this._lang].card;
    const u = this._uid;
    const has = (k) => !!c[k];
    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
    const ek = (k) => (k && has(k) ? ` data-entity-key="${k}"` : "");
    const aspect = bg.aspect;
    const W = 1000, IH = Math.round(W / aspect);
    const halo = `filter="url(#${u}-halo)"`;

    /* Positionen: Standard (passend zu den Altherma-Bildern) + eigene Werte aus "overlay" */
    const floor = c.heating_type === "floor";
    const def = JSON.parse(JSON.stringify(HP_IMG_DEFAULT));
    if (floor) Object.assign(def.flows, HP_IMG_DEFAULT_FLOOR.flows), Object.assign(def.labels, HP_IMG_DEFAULT_FLOOR.labels), Object.assign(def.captions, HP_IMG_DEFAULT_FLOOR.captions), (def.emitters = HP_IMG_DEFAULT_FLOOR.emitters);
    const ov = c.overlay && typeof c.overlay === "object" ? c.overlay : {};
    const pick = (grp) => ({ ...def[grp], ...(ov[grp] || {}) });
    const L = pick("labels"), F = pick("flows"), P = pick("pumps"), E = pick("emitters");
    const one = (k) => (ov[k] !== undefined ? ov[k] : def[k]);
    const X = (p) => (Number(p) * W) / 100, Y = (p) => (Number(p) * IH) / 100;
    const pts = (s) => String(s).trim().split(/\s+/).map((pr) => pr.split(",").map(Number)).filter((a) => a.length === 2 && !a.some(isNaN));
    const dOf = (s) => pts(s).map(([x, y], n) => `${n ? "L" : "M"}${X(x).toFixed(1)} ${Y(y).toFixed(1)}`).join(" ");
    const arrow = (x, y, dir, cls) => {
      const s = 8, rot = { r: 0, d: 90, l: 180, u: 270 }[dir];
      return `<path class="arrow ${cls}" transform="rotate(${rot} ${x} ${y})" d="M${x + s} ${y} L${x - s} ${y - s} L${x - s * 0.45} ${y} L${x - s} ${y + s} Z"/>`;
    };

    /* Zusätzliche Rohre (nicht im Bild): Enthärtung, Zirkulation */
    let extraPipes = "";
    if (c.softener && one("softener_pipe")) {
      const d = dOf(one("softener_pipe")), ap = pts(one("softener_pipe"))[0];
      extraPipes += `<path class="ovpipe-ol" d="${d}"/><path class="ovpipe dw" d="${d}"/>${arrow(X(ap[0] - 9), Y(ap[1]), "l", "dw")}`;
    }
    if (has("circulation") && one("circ_pipe")) {
      const d = dOf(one("circ_pipe"));
      extraPipes += `<path class="ovpipe-ol" d="${d}"/><path class="ovpipe hot" d="${d}"/>`;
    }

    /* Fluss-Pfade (Leuchten + wandernde Punkte über den Rohren) */
    const flowDefs = [
      ["primary_vl", "primary", "h", true], ["primary_rl", "primary", "c", true],
      ["circ", "circ", "h", has("circulation")], ["soft", "soft", "c", !!c.softener],
      ["z1_vl", "z1", "h", true], ["z1_rl", "z1", "c", true],
      ["z2_vl", "z2", "h", c.heating_type === "both"], ["z2_rl", "z2", "c", c.heating_type === "both"],
    ];
    const flows = flowDefs.filter(([k, , , show]) => show && F[k]).map(([k, flag, col]) => {
      const d = dOf(F[k]);
      return `<g class="ovf ${col}" data-on="${flag}">
        <path class="ovf-glow" d="${d}" filter="url(#${u}-blur)"/>
        <path class="ovf-line" d="${d}"/>
        <path class="ovf-dots" d="${d}" style="animation-duration:var(--${flag}-dur,1.2s)"/>
      </g>`;
    }).join("");

    /* Pumpen: komplett dynamisch, nur wenn eine Entität hinterlegt ist */
    const zkey = (i) => has(`zone${i}_pump`) ? `zone${i}_pump` : has(`zone${i}_pump_speed`) ? `zone${i}_pump_speed` : null;
    const pumpKeys = { primary: has("pump") ? "pump" : has("pump_speed") ? "pump_speed" : null, z1: zkey(1), z2: zkey(2), circ: has("circulation") ? "circulation" : null };
    const pumps = Object.entries(pumpKeys).filter(([f, k]) => k && P[f]).map(([f, k]) => {
      const [px, py, pr] = P[f]; const cx = X(px), cy = Y(py), r = X(pr || 1.7);
      return `<g class="pump" data-on="${f}"${ek(k)}>
        <circle class="pump-glow" cx="${cx}" cy="${cy}" r="${r + 6}" filter="url(#${u}-blur)"/>
        <circle class="pump-body" cx="${cx}" cy="${cy}" r="${r}"/>
        <circle class="pump-ol" cx="${cx}" cy="${cy}" r="${r + 2}"/>
        <g class="impeller" style="transform-origin:${cx}px ${cy}px;animation-duration:var(--${f}-dur,1s)">
          ${[0, 90, 180, 270].map((a) => `<path d="M${cx} ${cy} q ${r * 0.55} ${-r * 0.12} ${r * 0.68} ${-r * 0.68}" transform="rotate(${a} ${cx} ${cy})"/>`).join("")}
        </g>
        <circle class="pump-hub" cx="${cx}" cy="${cy}" r="${(r * 0.2).toFixed(1)}"/>
      </g>`;
    }).join("");

    /* Mischer im Innengerät */
    let mixer = "";
    const mp = one("mixer");
    if (mp && has("zone1_mixer")) {
      const mx = X(mp[0]), my = Y(mp[1]);
      mixer = `<path class="mixer"${ek("zone1_mixer")} d="M${mx - 12} ${my - 8} L${mx + 12} ${my + 8} L${mx + 12} ${my - 8} L${mx - 12} ${my + 8} Z M${mx} ${my} L${mx - 8} ${my + 15} L${mx + 8} ${my + 15} Z"/>`;
    }

    /* Lüfter: halbtransparente drehende Flügel */
    let fan = "";
    const fp = one("fan");
    if (fp && has("compressor")) {
      const [fx, fy, frx, fry] = fp; const cx = X(fx), cy = Y(fy), rx = X(frx), ry = Y(fry || frx * aspect);
      const blades = [0, 120, 240].map((a) => `<path d="M0 0 C-8 -${rx * 0.4} 3 -${rx * 0.8} ${rx * 0.38} -${rx * 0.86} C${rx * 0.55} -${rx * 0.55} ${rx * 0.36} -${rx * 0.16} 0 0Z" transform="rotate(${a})"/>`).join("");
      fan = `<g class="ovfan" data-on="fan" transform="translate(${cx} ${cy}) scale(1 ${(ry / rx).toFixed(3)})">
        <circle class="ovfan-blur" r="${rx * 0.9}"/>
        <g class="ovfan-blades">${blades}</g></g>`;
    }

    /* Abtauen: Frost, Eiskristalle, Tropfwasser */
    let frost = "";
    const fr = one("frost");
    if (fr && has("defrost")) {
      const poly = typeof fr === "string" ? pts(fr) : (() => { const [x, y, w, h] = fr.map(Number); return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; })();
      const xs = poly.map((q) => X(q[0])), ys = poly.map((q) => Y(q[1]));
      const x0 = Math.min(...xs), y0 = Math.min(...ys), ww = Math.max(...xs) - x0, hh = Math.max(...ys) - y0;
      const fl = (fx, fy, s) => `<path class="flake" d="M${fx} ${fy - s} V${fy + s} M${fx - s * 0.866} ${fy - s / 2} L${fx + s * 0.866} ${fy + s / 2} M${fx - s * 0.866} ${fy + s / 2} L${fx + s * 0.866} ${fy - s / 2}"/>`;
      frost = `<g class="defrost" data-on="defrost">
        <polygon class="frost" points="${poly.map((q) => `${X(q[0]).toFixed(1)},${Y(q[1]).toFixed(1)}`).join(" ")}"/>
        ${[[0.15, 0.2, 12], [0.55, 0.15, 9], [0.3, 0.7, 10], [0.7, 0.55, 13], [0.85, 0.3, 8]].map(([a, b, s]) => fl(x0 + ww * a, y0 + hh * b, s)).join("")}
        ${[0.2, 0.45, 0.7, 0.85].map((a, n) => `<circle class="drip" cx="${x0 + ww * a}" cy="${y0 + hh * 0.95}" r="3.5" style="animation-delay:${n * 0.35}s"/>`).join("")}
      </g>`;
    }

    /* Verdichter-Leuchten */
    let comp = "";
    const cp = one("compressor");
    if (cp && has("compressor")) {
      const [x, y, w, h] = cp.map(Number);
      comp = `<g class="ovcomp" data-on="compressor"${ek("compressor")}><rect x="${X(x)}" y="${Y(y)}" width="${X(w)}" height="${Y(h)}" rx="12" filter="url(#${u}-blur)"/></g>`;
    }

    /* Speicher-Färbung (nur Farbton, Helligkeit bleibt vom Bild) */
    let tank = "";
    const tp = one("tank");
    if (tp && (has("tank_top_temp") || has("tank_bottom_temp") || has("dhw_temp"))) {
      const [x, y, w, h] = tp.map(Number);
      tank = `<rect class="ovtank" x="${X(x)}" y="${Y(y)}" width="${X(w)}" height="${Y(h)}" rx="10" fill="url(#${u}-tank)"/>`;
    }

    /* Heizstab */
    let rod = "";
    const hp = one("heater");
    if (hp && has("heater_rod")) {
      const [x1, y1, x2, y2] = hp.map(Number);
      const rx0 = Math.min(X(x1), X(x2)), ry0 = Math.min(Y(y1), Y(y2)), rw = Math.abs(X(x2) - X(x1)), rh = Math.abs(Y(y2) - Y(y1));
      rod = `<g class="ovrod" data-on="heater_rod"${ek("heater_rod")}>
        <rect class="ovrod-glow" x="${rx0 - 9}" y="${ry0 - 9}" width="${rw + 18}" height="${rh + 18}" rx="9" filter="url(#${u}-blur)"/>
        <rect class="ovrod-core" x="${rx0 - 3}" y="${ry0}" width="${rw + 6}" height="${rh}" rx="3"/></g>`;
    }

    /* Heizkörper / FBH: warmes Leuchten + aufsteigende Wärme */
    const emit = ["z1", "z2"].filter((z) => E[z] && (z === "z1" || c.heating_type === "both")).map((z) => {
      const [x, y, w, h] = E[z].map(Number); const x0 = X(x), y0 = Y(y), ww = X(w), hh = Y(h);
      const wv = [0.2, 0.5, 0.8].map((f, n) => `<path class="wave" style="animation-delay:${n * 0.6}s" d="M${x0 + ww * f} ${y0 - 6} q 7 -6 0 -12 q -7 -6 0 -12"/>`).join("");
      return `<g class="emitter" data-on="${z}"${ek(zkey(z === "z1" ? 1 : 2))}><rect class="ovemit" x="${x0}" y="${y0}" width="${ww}" height="${hh}" rx="8" filter="url(#${u}-blur)"/>${wv}</g>`;
    }).join("");

    /* Werte */
    const tags = { vl_temp: ["h", T.vl], rl_temp: ["c", T.rl], zone1_vl_temp: ["h"], zone1_rl_temp: ["c"], zone2_vl_temp: ["h"], zone2_rl_temp: ["c"] };
    const pref = { dhw_setpoint: T.set + " " };
    const spdFlag = { pump_speed: "primary", zone1_pump_speed: "z1", zone2_pump_speed: "z2" };
    const skip = ["softener", "leak", "indoor_temp", "outdoor_temp"];
    const labels = Object.entries(L).filter(([k, p]) => !skip.includes(k) && has(k) && Array.isArray(p)).map(([k, p]) => {
      const x = X(p[0]), y = Y(p[1]), anchor = p[2] || "middle";
      if (tags[k]) {
        const [cls, pre] = tags[k];
        return `<g class="tag ${cls}" data-cx="${x}"${ek(k)}><rect x="${x - 40}" y="${y - 14}" width="80" height="28" rx="14"/>
          <text x="${x}" y="${y + 6}" text-anchor="middle">${pre ? `<tspan class="tp">${pre}</tspan>` : ""}<tspan data-val="${k}">–</tspan></text></g>`;
      }
      const fl = spdFlag[k];
      const big = !(fl || k === "zone1_mixer" || k === "zone2_mixer" || k === "dhw_setpoint");
      return `<text ${halo} class="ovt${big ? "" : " small"}${fl ? " spd" : ""}"${fl ? ` data-on="${fl}"` : ""} x="${x}" y="${y}" text-anchor="${anchor}"${ek(k)}>${pref[k] ? `<tspan class="ovl">${pref[k]}</tspan>` : ""}<tspan data-val="${k}">–</tspan></text>`;
    }).join("");

    /* Haus-Symbol mit Innen- und Außentemperatur */
    let house = "";
    const hs = one("house");
    if (hs && (has("indoor_temp") || has("outdoor_temp"))) {
      const hx = X(hs[0]), hy = Y(hs[1]);
      house = `<g transform="translate(${hx - 30} ${hy - 26})">
        <path class="house img" d="M30 72 L97 26 L164 72 M42 64 V134 H152 V64 M128 46 V30 H142 V56"/>
        ${has("indoor_temp") ? `<g${ek("indoor_temp")}><text ${halo} class="ovt ovl" x="97" y="93" text-anchor="middle" style="font-size:15px">${T.indoor}</text>
          <text ${halo} class="ovt" x="97" y="122" text-anchor="middle" style="font-size:23px" data-val="indoor_temp">–</text></g>` : ""}
        ${has("outdoor_temp") ? `<g${ek("outdoor_temp")}><text ${halo} class="ovt ovl" x="176" y="93" style="font-size:15px">${T.outdoor}</text>
          <text ${halo} class="ovt" x="176" y="122" style="font-size:23px" data-val="outdoor_temp">–</text></g>` : ""}
      </g>`;
    }

    /* Beschriftungen (in der gewählten Sprache) */
    const CP = pick("captions");
    const cap = (k, txt, cls = "ovcap") => CP[k] ? `<text ${halo} class="${cls}" x="${X(CP[k][0])}" y="${Y(CP[k][1])}" text-anchor="${CP[k][2] || "middle"}">${esc(txt)}</text>` : "";
    const emitName = (i, kind) => c[`zone${i}_name`] || (kind === "floor" ? T.floor : T.radiator);
    let captions = cap("primary", T.primary) + cap("primary2", T.heatpump, "ovcap small") + cap("dhw", T.dhw) +
      cap("unit", T.unit) + cap("tank", T.tank) + cap("emitter", emitName(1, floor ? "floor" : "radiator"));
    if (c.softener) captions += cap("softener", T.softener, "ovcap small");

    /* Enthärtung: Werte + Leckageschutz */
    let soft = "";
    if (c.softener) {
      const sp = L.softener || [89.3, 39.4], lp = L.leak || [98, 38.6];
      const data = [has("softener_flow") ? `<tspan data-val="softener_flow"${ek("softener_flow")}>–</tspan>` : "", has("softener_hardness") ? `<tspan data-val="softener_hardness"${ek("softener_hardness")}>–</tspan>` : ""].filter(Boolean).join(`<tspan class="ovl"> · </tspan>`);
      if (data) soft += `<text ${halo} class="ovt small" x="${X(sp[0])}" y="${Y(sp[1])}" text-anchor="middle">${data}</text>`;
      if (has("leak_alarm") || has("leak_valve")) {
        const sx = X(lp[0]), sy = Y(lp[1]), lk = has("leak_alarm") ? "leak_alarm" : "leak_valve";
        soft += `<g class="leak"${ek(lk)}>
          <path class="shield" d="M${sx} ${sy - 15} L${sx + 13} ${sy - 10} V${sy + 1} C${sx + 13} ${sy + 9} ${sx + 7} ${sy + 14} ${sx} ${sy + 17} C${sx - 7} ${sy + 14} ${sx - 13} ${sy + 9} ${sx - 13} ${sy + 1} V${sy - 10} Z"/>
          <path class="drop" d="M${sx} ${sy - 8} C${sx + 5} ${sy - 2} ${sx + 6} ${sy + 2} ${sx + 6} ${sy + 4} A6 6 0 0 1 ${sx - 6} ${sy + 4} C${sx - 6} ${sy + 2} ${sx - 5} ${sy - 2} ${sx} ${sy - 8} Z"/></g>`;
      }
    }

    /* Positionier-Raster */
    let grid = "";
    if (c.show_grid) {
      for (let p = 5; p < 100; p += 5) {
        const major = p % 10 === 0;
        grid += `<line class="grid${major ? " major" : ""}" x1="${X(p)}" y1="0" x2="${X(p)}" y2="${IH}"/><line class="grid${major ? " major" : ""}" x1="0" y1="${Y(p)}" x2="${W}" y2="${Y(p)}"/>`;
        if (major) grid += `<text class="gridt" x="${X(p) + 3}" y="14">${p}</text><text class="gridt" x="3" y="${Y(p) - 3}">${p}</text>`;
      }
    }

    /* Chips & untere Leiste unterhalb des Bildes */
    const chipDefs = [["compressor", "#22c55e"], ["defrost", "#38bdf8"], ["dhw_active", "#f59e0b"], ["dhw_boost", "#ef4444"], ["heater_rod", "#f97316"], ["circulation", "#a78bfa"]].filter(([k]) => has(k));
    const CW = 150, CG = 10, cx0 = 500 - (chipDefs.length * CW + (chipDefs.length - 1) * CG) / 2;
    const chipY = IH + 16;
    const chips = chipDefs.map(([k, col], n) => {
      const x = cx0 + n * (CW + CG);
      return `<g class="chip" data-on="${k}"${ek(k)} style="--chip-c:${col}"><rect x="${x}" y="${chipY}" width="${CW}" height="34" rx="17"/>
        <circle cx="${x + 19}" cy="${chipY + 17}" r="5.5"/><text x="${x + 33}" y="${chipY + 23}">${T[k]}</text></g>`;
    }).join("");
    const bottomKeys = ["power", "heat_power", "cop", "mode"].filter(has);
    const statY = chipDefs.length ? chipY + 50 : IH + 16;
    const H = bottomKeys.length ? statY + 72 : chipDefs.length ? chipY + 46 : IH;
    const gap = 12, bw = bottomKeys.length ? (940 - gap * (bottomKeys.length - 1)) / bottomKeys.length : 0;
    const stats = bottomKeys.map((k, n) => {
      const x = 30 + n * (bw + gap);
      return `<g class="stat"${ek(k)}><rect x="${x}" y="${statY}" width="${bw}" height="62" rx="12"/>
        <text class="l" x="${x + bw / 2}" y="${statY + 24}" text-anchor="middle">${T[k]}</text>
        <text class="v" x="${x + bw / 2}" y="${statY + 52}" text-anchor="middle" data-val="${k}">–</text></g>`;
    }).join("");

    this.shadowRoot.innerHTML = `
      <style>${HP_STYLE.replace(/UID/g, u)}</style>
      <ha-card class="${c.theme_background ? "themed" : ""}">
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="${u}-tank" x1="0" y1="0" x2="0" y2="1">
              <stop id="${u}-top" offset="0" stop-color="#e5483e"/>
              <stop id="${u}-mid" offset=".55" stop-color="#d0506a"/>
              <stop id="${u}-bot" offset="1" stop-color="#3f7fd9"/>
            </linearGradient>
            <radialGradient id="${u}-pump" cx=".4" cy=".35"><stop offset="0" stop-color="#3a414c"/><stop offset="1" stop-color="#15181d"/></radialGradient>
            <filter id="${u}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
            <filter id="${u}-halo" x="-10%" y="-40%" width="120%" height="180%">
              <feMorphology in="SourceAlpha" operator="dilate" radius="2.4" result="d"/>
              <feGaussianBlur in="d" stdDeviation="1.2" result="b"/>
              <feFlood flood-color="#000" flood-opacity=".85"/><feComposite in2="b" operator="in" result="s"/>
              <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <clipPath id="${u}-clip"><rect x="0" y="0" width="${W}" height="${IH}" rx="10"/></clipPath>
          </defs>
          <g clip-path="url(#${u}-clip)">
            <image href="${esc(bg.src)}" x="0" y="0" width="${W}" height="${IH}" preserveAspectRatio="none"/>
            ${extraPipes}${tank}${comp}${emit}${rod}${flows}${fan}${frost}${pumps}${mixer}
            ${c.title ? `<text ${halo} class="title ovt" x="500" y="${Y(one("title_y") || 7.5)}" text-anchor="middle">${esc(c.title)}</text>` : ""}
            ${captions}${house}${labels}${soft}${grid}
          </g>
          ${chips}${stats}
        </svg>
      </ha-card>`;
    this._finishBuild();
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
    this.shadowRoot.querySelectorAll(".tag[data-cx]").forEach((g) => {
      try {
        const t = g.querySelector("text"), r = g.querySelector("rect"), w = t.getComputedTextLength() + 24, cx = Number(g.dataset.cx);
        if (w > 30) { r.setAttribute("width", w.toFixed(1)); r.setAttribute("x", (cx - w / 2).toFixed(1)); }
      } catch (e) { /* noch nicht sichtbar */ }
    });

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

    /* Speicherfarbe: oben nach Temperatur (blau → violett → rot).
       Unten wird diese Farbe Richtung Blau gemischt – immer etwas,
       stärker je größer die Differenz oben/unten (max. ~5 K). */
    const rgbOf = (x) => {
      const hh = ((215 + 145 * x) % 360) / 360, ss = 0.75, ll = 0.52;
      const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss, pp = 2 * ll - q;
      const f = (t) => { t = (t + 1) % 1; return t < 1 / 6 ? pp + (q - pp) * 6 * t : t < 0.5 ? q : t < 2 / 3 ? pp + (q - pp) * (2 / 3 - t) * 6 : pp; };
      return [f(hh + 1 / 3), f(hh), f(hh - 1 / 3)].map((v) => Math.round(v * 255));
    };
    const BLUE = [63, 127, 217];
    const css = (c3) => `rgb(${c3.join(",")})`;
    const mix = (a3, w) => a3.map((v, n) => Math.round(v * (1 - w) + BLUE[n] * w));
    const tTop = num("tank_top_temp") ?? num("dhw_temp");
    const tBot = num("tank_bottom_temp");
    let top = null, mid = null, bot = null;
    const ref = tTop ?? tBot;
    if (ref !== null) {
      const base = rgbOf(Math.min(1, Math.max(0, (ref - 20) / 38)));
      const diff = tTop !== null && tBot !== null ? Math.min(5, Math.max(0, tTop - tBot)) : 0;
      top = css(base);
      mid = css(mix(base, 0.12 + 0.08 * (diff / 5)));
      bot = css(mix(base, 0.5 + 0.35 * (diff / 5)));
    }
    if (this._stopMid && mid) this._stopMid.setAttribute("stop-color", mid);
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
    const bgMode = this._config.background || (this._config.background_image ? "custom" : "drawn");
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
    schema.push({
      type: "expandable", name: "sec_img", flatten: true, title: t.sec.img,
      schema: [
        {
          name: "background",
          selector: { select: { mode: "dropdown", options: [
            { value: "drawn", label: t.opt.bg_drawn }, { value: "altherma", label: t.opt.bg_altherma }, { value: "custom", label: t.opt.bg_custom },
          ] } },
        },
        ...(bgMode === "custom" ? [{ name: "background_image", selector: { image: {} } }] : []),
        ...(bgMode !== "drawn" ? [{ name: "show_grid", selector: { boolean: {} } }, { name: "overlay", selector: { object: {} } }] : []),
      ],
    });
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
