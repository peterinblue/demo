**NeonPlan 3D 1.21.0** brings sloping walls, light switches and sockets, ceiling fans with light, a Wi-Fi access point and a water heater, a 3D lock for wall tablets, your own background behind the house – and a good round of fixes. It still runs on old and weak wall tablets: the new moving parts (fan blades) only draw while they run, at a reduced frame rate.

### New

- **Sloping walls (discussion #569):** in a room's wall heights, **◢ Sloping** gives a wall its own height at each end – for garages, carports and walls that follow a slope. The top runs straight between the two heights, windows and doors stay below it. Thanks @Vicente-Ch!
- **Light switches and sockets (#593, discussions #523, #540):** under **Furniture → Home technology**: 1 to 4 buttons or sockets in one frame, each with its own entity. A button glows while it is on (a light in its colour), a socket green – brighter with what it draws, and with a power sensor it counts as a consumer. A tap switches it; with several, a small menu opens. **The same entity may sit on several sockets** – two sockets on one relay, inside and outside. There is an outdoor socket with a lid too. Thanks @RkcCorian, @SvenBarracuda and @daene85!
- **Ceiling fan with light (discussion #606):** under **Furniture → Lights**. The light switches the lamp; link a fan and its blades turn with its speed. The fan gets its own symbol with its speed (tap: on/off, hold: speed). Thanks @ishai89!
- **Wi-Fi access point (discussion #582):** on the ceiling or the wall. Its ring glows blue while it is online and red when it is gone – then its symbol shows "Offline". With a sensor, the number of connected clients stands at the symbol. Diagnostic entities, like UniFi's, can be linked. Thanks @wolly3000!
- **Water heater:** a standing tank or a slim one on the wall. It glows warm while it heats and shows the water temperature (from a sensor or the device itself).
- **🔒 3D lock:** in the view settings (card option `angle_lock: true`). The angle stays fixed, a drag moves the view, zooming still works – nobody turns the house on a wall tablet by accident. Idea from dlavrantonis' fork.
- **Your own background** behind the 3D house: the look's sky (as before), one colour, a gradient or a picture with a darkening veil (editor → Background). Idea from damonxxu's fork.
- **Device symbols:** a new mode **In the room** – no symbols in the house and floor views, in an open room only its own (discussions #477, #595) – and a **symbol size** small / normal / large (view settings, card option `marker_size`; discussion #596). Thanks @DomeGr694, @SMSch1989 and @haddung!
- **LED strips can rise** along their length (**Rise °**), up the stairs or along a handrail; light and glow climb with them (discussion #539). Thanks @Kuddelsoft!
- **Ceiling lamps and LED panels can be lowered** like spots (**Height above floor**), e.g. under a staircase.
- **Room devices (discussion #484):** a device's further entities (under "more") can each be hidden (👁) or shown without state (Aa) on their own. Thanks @RkcCorian!
- **Camera Cockpit – live director:**
  - **Own triggers (discussion #615):** any entity that goes on or open – a second doorbell, the garage door, the garden gate – flies the view there and looks through the camera you chose for it. Thanks @karli4711!
  - **Live picture when looking through (discussion #589):** the camera's video instead of a still every few seconds (off by default; it needs more power). Thanks @djbassmind-sketch!
- **⛶ Full screen** when looking through a camera. Where the browser cannot (old tablets), Home Assistant's camera view opens – with sound. Idea from dlavrantonis' fork.
- **Energy Pro:** the hologram's bar is called **Self-sufficiency now** (it is the momentary value), and it no longer shows 100 % when the grid reading is missing (discussion #590). Thanks @Cle2301!

### Fixed

- **Lamp under stairs built from worktops (#614):** a lamp placed under a high worktop step jumped onto the step. Whatever fits under a worktop from 1.2 m up now stays on the floor; on kitchen and bar worktops things still stand on top. Thanks @crowler007!
- **Washer and dryer (#516):** while running they glowed with a square patch over their round door; now a ring of light runs round the door. Thanks @R1N4x!
- **Roof windows over the room (#598):** the pane was opaque, so a closed blind was hard to tell. The pane is now see-through like a wall window's, and the blind has slats. Thanks @RkcCorian!
- **Waste bins in the Blueprint and Day looks (#609):** the lower half fell back to the look's grey. Coloured bins now keep their colour down to the ground. Thanks @TheBhim!
- **Furniture packs on Home Assistant 2026.9 and newer:** a pack with an item kind this version does not know yet showed "invalid content" instead of asking for an update. Pointed out by hohoanganh.
- **Unloading the integration** could fail on newer Home Assistant; NeonPlan is now also tested against the current Home Assistant.

### How to update

Settings → System → Updates. HACS only looks for new versions every few hours, so a fresh update may not show there yet. Then: HACS → NeonPlan 3D → ⋮ → **Update information** → **Download**. Restart Home Assistant and reload the page (Ctrl+F5).

---

**NeonPlan 3D 1.21.0** bringt schräge Wände, Lichtschalter und Steckdosen, Deckenventilatoren mit Licht, einen WLAN-Access-Point und einen Warmwasserspeicher, eine 3D-Sperre für Wandtablets, einen eigenen Hintergrund hinter dem Haus – und eine ordentliche Runde Fehlerbehebungen. Es läuft weiter auch auf alten und schwachen Wandtablets: Die neuen beweglichen Teile (Ventilatorflügel) werden nur gezeichnet, solange sie laufen, und mit weniger Bildern pro Sekunde.

### Neu

- **Schräge Wände (Diskussion #569):** In den Wandhöhen eines Raums gibt **◢ Schräg** einer Wand an jedem Ende eine eigene Höhe – für Garagen, Carports und Wände unter einer Schräge. Die Oberkante läuft gerade zwischen beiden Höhen, Fenster und Türen bleiben darunter. Danke an @Vicente-Ch!
- **Lichtschalter und Steckdosen (#593, Diskussionen #523, #540):** unter **Möbel → Haustechnik**: 1 bis 4 Tasten oder Dosen in einem Rahmen, jede mit eigener Entität. Eine Taste leuchtet, solange sie an ist (ein Licht in seiner Farbe), eine Steckdose grün – heller, je mehr sie zieht, und mit Leistungssensor zählt sie als Verbraucher. Antippen schaltet; bei mehreren öffnet sich ein kleines Menü. **Dieselbe Entität darf an mehreren Dosen hängen** – zwei Steckdosen an einem Relais, innen und außen. Eine Außensteckdose mit Klappe gibt es auch. Danke an @RkcCorian, @SvenBarracuda und @daene85!
- **Deckenventilator mit Licht (Diskussion #606):** unter **Möbel → Leuchten**. Das Licht schaltet die Leuchte; mit einem verknüpften Ventilator drehen sich die Flügel mit seiner Stufe. Der Ventilator bekommt ein eigenes Symbol mit der Stufe (Tippen: an/aus, lange drücken: Stufe). Danke an @ishai89!
- **WLAN-Access-Point (Diskussion #582):** an der Decke oder an der Wand. Sein Ring leuchtet blau, solange er online ist, und rot, wenn er fehlt – dann zeigt sein Symbol „Offline“. Mit einem Sensor steht die Zahl der verbundenen Geräte am Symbol. Auch Diagnose-Entitäten, etwa von UniFi, lassen sich verknüpfen. Danke an @wolly3000!
- **Warmwasserspeicher:** als Standspeicher oder flach an der Wand. Er glüht warm, solange er heizt, und zeigt die Wassertemperatur (aus einem Sensor oder vom Gerät selbst).
- **🔒 3D-Sperre:** in den Ansicht-Einstellungen (Karten-Option `angle_lock: true`). Der Blickwinkel bleibt fest, Ziehen verschiebt die Ansicht, Zoomen geht weiter – auf dem Wandtablet dreht niemand das Haus aus Versehen. Idee aus dem Fork von dlavrantonis.
- **Eigener Hintergrund** hinter dem 3D-Haus: der Himmel des Looks (wie bisher), eine Farbe, ein Verlauf oder ein Bild mit abdunkelndem Schleier (Editor → Hintergrund). Idee aus dem Fork von damonxxu.
- **Gerätesymbole:** ein neuer Modus **Im Raum** – keine Symbole in Haus- und Etagenansicht, in einem geöffneten Raum nur seine eigenen (Diskussionen #477, #595) – und eine **Symbolgröße** klein / normal / groß (Ansicht-Einstellungen, Karten-Option `marker_size`; Diskussion #596). Danke an @DomeGr694, @SMSch1989 und @haddung!
- **LED-Streifen können ansteigen** (**Anstieg °**), die Treppe hinauf oder am Handlauf entlang; Licht und Leuchten steigen mit (Diskussion #539). Danke an @Kuddelsoft!
- **Deckenleuchten und LED-Panels lassen sich absenken** wie Spots (**Höhe über Boden**), etwa unter eine Treppe.
- **Geräte im Raum (Diskussion #484):** Die weiteren Entitäten eines Geräts (unter „mehr“) lassen sich jede für sich ausblenden (👁) oder ohne Zustand zeigen (Aa). Danke an @RkcCorian!
- **Kamera-Cockpit – Live-Regie:**
  - **Eigene Auslöser (Diskussion #615):** Jede Entität, die an- oder aufgeht – eine zweite Klingel, das Garagentor, das Gartentor –, lässt die Ansicht hinfliegen und durch die dafür gewählte Kamera schauen. Danke an @karli4711!
  - **Livebild beim Durchschauen (Diskussion #589):** das Video der Kamera statt alle paar Sekunden ein Standbild (standardmäßig aus, braucht mehr Leistung). Danke an @djbassmind-sketch!
- **⛶ Vollbild** beim Durchschauen durch eine Kamera. Wo der Browser das nicht kann (alte Tablets), öffnet sich die Kameraansicht von Home Assistant – mit Ton. Idee aus dem Fork von dlavrantonis.
- **Energie Pro:** Der Balken im Hologramm heißt **Autarkie jetzt** (es ist der Augenblickswert) und zeigt keine 100 % mehr, wenn der Netzwert fehlt (Diskussion #590). Danke an @Cle2301!

### Behoben

- **Leuchte unter einer Treppe aus Arbeitsplatten (#614):** Eine Leuchte unter einer hohen Stufe sprang auf die Stufe. Was unter eine Arbeitsplatte ab 1,2 m Höhe passt, bleibt jetzt am Boden; auf Küchen- und Barplatten stehen Dinge weiter oben drauf. Danke an @crowler007!
- **Waschmaschine und Trockner (#516):** Im Betrieb leuchteten sie mit einem eckigen Feld über der runden Tür; jetzt läuft ein Lichtring um die Tür. Danke an @R1N4x!
- **Dachfenster über dem Raum (#598):** Die Scheibe war undurchsichtig, ein geschlossener Rollladen kaum zu erkennen. Jetzt ist sie durchsichtig wie bei einem Wandfenster, und der Rollladen hat Lamellen. Danke an @RkcCorian!
- **Mülltonnen in den Looks Blueprint und Tag (#609):** Die untere Hälfte fiel ins Grau des Looks zurück. Farbige Tonnen behalten jetzt ihre Farbe bis zum Boden. Danke an @TheBhim!
- **Möbel-Packs ab Home Assistant 2026.9:** Ein Pack mit einer Möbelart, die diese Version noch nicht kennt, meldete „ungültiger Inhalt“ statt um ein Update zu bitten. Hinweis von hohoanganh.
- **Entladen der Integration** konnte auf neuerem Home Assistant fehlschlagen; NeonPlan wird jetzt auch gegen das aktuelle Home Assistant getestet.

### So bekommst du das Update

Einstellungen → System → Updates. HACS sucht nur alle paar Stunden nach neuen Versionen, deshalb fehlt ein frisches Update dort manchmal noch. Dann: HACS → NeonPlan 3D → ⋮ → **Informationen aktualisieren** → **Herunterladen**. Home Assistant neu starten und die Seite neu laden (Strg+F5).
