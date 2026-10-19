# Wärmepumpen Flow Card

Animierte Home-Assistant-Karte für Wärmepumpen – entworfen für die **Daikin Altherma 4 mit ECH₂O-Speicher**, aber mit jeder Wärmepumpe nutzbar.

![Vorschau](images/preview.png)

## Funktionen

- Außengerät mit drehendem Lüfter (Verdichter läuft) und Abtau-Animation (Frost, Eiskristalle, Tropfwasser)
- Umwälzpumpen mit drehendem Laufrad – Geschwindigkeit folgt der Pumpenleistung in %
- Wasserfluss in den Rohren mit Richtungspfeilen, sobald die jeweilige Pumpe läuft
- Speicher mit Innengerät, Wärmetauscher-Wendel mit temperaturabhängiger Färbung, senkrechtem Heizstab und Mischer
- Warmwasser mit Zirkulationspumpe, Sollwert, Speicherüberhöhung (leistungsstark)
- Wärmeverteilung wählbar: **Heizkörper**, **Fußbodenheizung** oder **beides** (2 Heizkreise mit Pumpe und Mischer)
- Strom, Wärme, COP und Betriebsmodus in der unteren Leiste
- Alle Datenpunkte im visuellen Editor auswählbar, nicht belegte werden ausgeblendet
- Klick auf einen Wert öffnet den Detail-Dialog der Entität
- Skaliert von der kleinen Karte bis zum Vollbild-Panel

## Installation über HACS

1. HACS öffnen → oben rechts ⋮ → **Benutzerdefinierte Repositories**
2. Repository: `https://github.com/IngoPodolak/heatpump-flow-card`, Typ: **Dashboard**
3. „Wärmepumpen Flow Card“ suchen → **Herunterladen**
4. Browser neu laden (Strg+F5)

## Manuelle Installation

1. `heatpump-flow-card.js` nach `/config/www/` kopieren
2. Einstellungen → Dashboards → ⋮ → Ressourcen → `/local/heatpump-flow-card.js` als JavaScript-Modul hinzufügen

## Konfiguration

Karte im Dashboard hinzufügen und nach **„Wärmepumpen Flow Card“** suchen – alles weitere im Editor.
Ein vollständiges YAML-Beispiel für die Altherma 4 steht in [`beispiel-konfiguration.yaml`](beispiel-konfiguration.yaml).

| Option | Beschreibung |
|---|---|
| `title` | Titel (optional) |
| `heating_type` | `radiator`, `floor` oder `both` |
| `theme_background` | `true` = Hintergrund vom HA-Theme statt dunkel |
| `zone1_mixer` | Mischerstellung im Innengerät (mischt Heizkreis und Wärmepumpenkreis) |
| `outdoor_temp`, `indoor_temp` | Außen-/Innentemperatur |
| `compressor` | Verdichter läuft |
| `defrost` | Abtauen aktiv |
| `vl_temp`, `rl_temp` | Vor-/Rücklauf Wärmepumpe |
| `pump`, `pump_speed` | Umwälzpumpe läuft / Leistung in % |
| `pressure` | Druck im Heizsystem |
| `power`, `heat_power`, `cop`, `mode` | Strom, Wärme, COP, Betriebsmodus |
| `dhw_temp`, `dhw_setpoint` | Brauchwasser Ist / Soll |
| `tank_top_temp`, `tank_bottom_temp` | Speicher oben / unten |
| `dhw_active`, `dhw_boost`, `heater_rod`, `circulation` | WW-Bereitung, Überhöhung, Heizstab, Zirkulation |
| `zone1_name`, `zone1_vl_temp`, `zone1_rl_temp`, `zone1_pump`, `zone1_pump_speed` | Heizkreis 1 |
| `zone2_…`, `zone2_mixer` | Heizkreis 2 (nur bei `both`), mit eigenem Mischer |

Ein-/Aus-Datenpunkte akzeptieren `binary_sensor`, `switch`, `input_boolean` oder Zahlen-Sensoren (> 0 = an).
Ist für einen Heizkreis keine Pumpe gewählt, gilt er als aktiv, wenn die Umwälzpumpe läuft und keine Brauchwasserbereitung aktiv ist.
