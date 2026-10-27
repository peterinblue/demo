**NeonPlan 3D 1.20.2** brings fixes for light wells, stairwells, the media card and voice control on Android tablets, and more control over the devices of outdoor areas.

### Fixed

- **Pool values (discussion #600):** pH, redox/ORP (mV), salt (mg/L, ppm) and conductivity sensors were left out of a room's or area's devices – only the water temperature showed. They count now. Thanks @Deninho91, and @Anrolosia for finding the cause!
- **Waste bin colours in Blueprint and Day (#609):** the bins lost their colours in the light looks (only the yellow lid stayed). They now keep their full colour in every look. Thanks @TheBhim!
- **Waste bins showed "in 2026 days" (Household Pro):** a sensor that shows a date, like Waste Collection Schedule's "on Mon, 26.10.2026", was read as a number – since 1.20.1 the year, before that the day of the month. A date in the text is now read as a date (also "28.10.", "29/10/2026", "2026-10-29"). Thanks km65 and the Discord beta testers!
- **Light well switch missing (discussion #575):** the **Light well** tick in a cellar window's form did not show unless the plan had its own ground height, so light wells could not be switched off. It shows now for every window below the ground. Thanks @LortusX and @1970lexi!
- **Light well lifted by a balcony (#602):** a balcony on the floor above raised the cellar window's light well up to itself. Only areas on the ground count now. Thanks @d14tk for the precise analysis!
- **Floor opening over tall stairs (#375):** an opening above stairs that reach higher than the floor was not cut at all when the opening and the stairs' own hole together reached past the room. Each opening is now cut room by room. Thanks @wouter-b for narrowing it down and the plan, and @LarsTh86!
- **▶ after ⏸ on the media card (#400):** on players that can pause but do not report "play" (an Echo through Alexa Media Player) the ▶ button was greyed out and sent nothing. It now resumes playback. Thanks @domodial!
- **Voice control on Android tablets (#579):** some WebViews (e.g. Fully Kiosk on a Huawei tablet) recorded only silence, because the audio was started too late after the tap. It now starts on the tap itself. If only silence still comes in, NeonPlan says why: usually another app holds the microphone, for example Fully Kiosk's acoustic motion detection. Thanks @PetrMa!

### Improved

- **Order of the room bar (discussion #599):** in the editor's room list (nothing selected), **↑** and **↓** move a room – the room bar of the 3D view follows. Thanks @groby66!
- **House without roof in the card (discussion #601):** the card option **Show the roof** (`roof: false`) leaves the roof out altogether, for those who drew it only for the solar fields. Thanks @Kanecaine!
- **Devices of outdoor areas (#597):** an outdoor area acting as a room lists its area's devices in the editor with the same buttons as a room. **☆** shows a device in the room panel without placing it, **👁** hides it there, and **Aa** leaves out its state text. Thanks @RkcCorian!

### How to update

Settings → System → Updates. HACS only looks for new versions every few hours, so a fresh update may not show there yet. Then: HACS → NeonPlan 3D → ⋮ → **Update information** → **Download**. Restart Home Assistant and reload the page (Ctrl+F5).

---

**NeonPlan 3D 1.20.2** bringt Fehlerbehebungen für Lichtschächte, Treppenöffnungen, die Medienkarte und die Sprachsteuerung auf Android-Tablets, dazu mehr Kontrolle über die Geräte von Außenflächen.

### Behoben

- **Pool-Werte (Diskussion #600):** pH-, Redox- (mV), Salz- (mg/L, ppm) und Leitfähigkeitssensoren fehlten bei den Geräten eines Raums oder einer Fläche – nur die Wassertemperatur erschien. Jetzt zählen sie mit. Danke an @Deninho91 und an @Anrolosia fürs Finden der Ursache!
- **Mülltonnen-Farben in Blueprint und Tag (#609):** In den hellen Looks verloren die Tonnen ihre Farben (nur der gelbe Deckel blieb). Jetzt behalten sie in jedem Look ihre volle Farbe. Danke an @TheBhim!
- **Mülltonnen zeigten „in 2026 Tagen“ (Haushalt Pro):** Ein Sensor, der ein Datum zeigt, etwa „on Mon, 26.10.2026“ von Waste Collection Schedule, wurde als Zahl gelesen – seit 1.20.1 das Jahr, davor der Tag im Monat. Jetzt wird ein Datum im Text als Datum gelesen (auch „28.10.“, „29/10/2026“, „2026-10-29“). Danke an km65 und die Beta-Tester im Discord!
- **Lichtschacht-Haken fehlte (Diskussion #575):** Der Haken **Lichtschacht** im Formular eines Kellerfensters erschien nur, wenn der Plan eine eigene Geländehöhe hatte. Lichtschächte ließen sich so nicht abschalten. Jetzt erscheint er bei jedem Fenster unter dem Gelände. Danke an @LortusX und @1970lexi!
- **Lichtschacht vom Balkon hochgezogen (#602):** Ein Balkon im Geschoss darüber zog den Lichtschacht des Kellerfensters bis zu sich hoch. Jetzt zählen nur Flächen auf dem Gelände. Danke an @d14tk für die genaue Analyse!
- **Bodenöffnung über hohen Treppen (#375):** Eine Öffnung über einer Treppe, die höher reicht als die Etage, wurde gar nicht ausgeschnitten, wenn Öffnung und Treppenloch zusammen über den Raum hinausreichten. Jetzt wird jede Öffnung Raum für Raum ausgeschnitten. Danke an @wouter-b für das Eingrenzen und den Plan, und an @LarsTh86!
- **▶ nach ⏸ auf der Medienkarte (#400):** Bei Playern, die pausieren können, aber kein „Play“ melden (ein Echo über Alexa Media Player), war ▶ ausgegraut und schickte nichts. Jetzt geht die Wiedergabe weiter. Danke an @domodial!
- **Sprachsteuerung auf Android-Tablets (#579):** Manche WebViews (z. B. Fully Kiosk auf einem Huawei-Tablet) nahmen nur Stille auf, weil der Ton zu spät nach dem Antippen gestartet wurde. Jetzt startet er direkt beim Antippen. Kommt trotzdem nur Stille an, sagt NeonPlan, woran es liegt: Meist hält eine andere App das Mikrofon fest, etwa die Bewegungserkennung per Geräusch in Fully Kiosk. Danke an @PetrMa!

### Verbessert

- **Reihenfolge der Raumleiste (Diskussion #599):** In der Raumliste des Editors (ohne Auswahl) verschieben **↑** und **↓** einen Raum, und die Raumleiste der 3D-Ansicht folgt. Danke an @groby66!
- **Haus ohne Dach in der Karte (Diskussion #601):** Die Karten-Option **Dach zeigen** (`roof: false`) lässt das Dach ganz weg, für alle, die es nur wegen der Solarfelder gezeichnet haben. Danke an @Kanecaine!
- **Geräte von Außenflächen (#597):** Eine Außenfläche, die wie ein Raum wirkt, listet die Geräte ihres Bereichs im Editor mit denselben Knöpfen wie ein Raum. **☆** zeigt ein Gerät im Raumfenster, ohne es zu platzieren, **👁** blendet es dort aus, und **Aa** lässt seinen Zustandstext weg. Danke an @RkcCorian!

### So bekommst du das Update

Einstellungen → System → Updates. HACS sucht nur alle paar Stunden nach neuen Versionen, deshalb fehlt ein frisches Update dort manchmal noch. Dann: HACS → NeonPlan 3D → ⋮ → **Informationen aktualisieren** → **Herunterladen**. Home Assistant neu starten und die Seite neu laden (Strg+F5).
