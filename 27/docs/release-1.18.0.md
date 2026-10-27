**NeonPlan 3D 1.18** brings cellars into the ground – with earth around them, cellar windows and light wells – and a tidied-up editor: a clear toolbar in groups, a floor menu that is always at hand, tools that stay in use and a sidebar you can fold away.

### New

- **Cellar and ground:** a new section **Ground** in the editor (without a selection, at the bottom of the sidebar). **Ground height** says where the ground lies around the house – lawns, paths and terraces lie on it; lower it for a semi-basement, e.g. to −1.2 m. **Show cellars in the earth:** floors below the ground sit in the earth in 3D, and an opened cellar looks like a building pit. A house standing above the ground gets a plinth, so nothing floats. A cellar is simply a floor with a negative elevation, e.g. −2.6 m.
- **Cellar window:** a button in the window form sets 100 × 50 cm, 25 cm under the ceiling. A window below the ground gets a light well with a grate in 3D by itself.
- **A tidier editor toolbar** without emojis, in groups: **Select**, **Build ▾** (room as rectangle, free shape or by measure, wall, doors & windows, floor opening, roof), **Outside ▾** (outdoor areas with their type and shape, pool with its shape), **Furniture**, **Energy**, undo and redo as **↶ ↷**, then **3D beside**, **Wall view** and **Whole plan**. A group's button names the tool in use, e.g. "Room: Free shape".
- **Floor menu:** **Floor: Ground floor ▾** on the far left of the toolbar, in every tool – switch floors, **Add floor** (also from Home Assistant's floors) and **Floor settings**, without going back to Select first.
- **Tools stay in use:** after placing a door, window, room, outdoor area or floor opening the tool stays active, so you can place several in a row. **Esc** or **Select** ends it.
- **Fold the sidebar away:** **Collapse ›** at the top of the sidebar folds it to a narrow strip – more room on the plan, e.g. for moving furniture. **‹** unfolds it, a glowing **⚙** opens the selection's settings; choosing another tool unfolds it again.
- **Whole plan** (formerly *Show all*) also fits the garden while you draw outdoor areas or a pool.
- **3D view:** the switches (walls, floors, roof, heat map, room names, Pro displays) are in one **Show ▾** menu; the view options in the header (quality, look, icons, FPS) sit behind the **⚙** on every screen.
- **Extensions tab:** a clear badge instead of the small dot – **"2 ready"** for bought or given packs to install or update, **"3 new"** for new offers in the shop. A pack that newly belongs to you is also announced once in Home Assistant's notifications and dismissed when it is installed.

### Changed

- **Lock floor plan** moved from the toolbar to the floor settings; it is still in the right-click menu of a room.

### Fixed

- **UniFi cameras** are no longer folded under another entity of their device and can be chosen again (#517).
- **Front door with a sidelight:** the sidelight has a frame over the whole depth of the door frame, a mullion beside the leaf and its glass in the plane of the leaf (#519).
- **Media buttons** the player cannot serve (previous, next, pause, play) are greyed out (#400).
- **Flickering furniture:** corner bathtub, outdoor kitchen and network rack no longer flicker – with the pack updates Bath (release 4), Garden (release 4) and Smart Home (release 3), which install by themselves with a shop connection (#516).

### How to update

Settings → System → Updates. HACS only looks for new versions every few hours, so a fresh update may not show there yet. Then: HACS → NeonPlan 3D → ⋮ → **Update information** → **Download**. Restart Home Assistant and reload the page (Ctrl+F5).

---

**NeonPlan 3D 1.18** bringt Keller ins Erdreich – mit Erde ringsum, Kellerfenstern und Lichtschächten – und einen aufgeräumten Editor: eine klare Werkzeugleiste in Gruppen, ein Etagen-Menü, das immer da ist, Werkzeuge, die aktiv bleiben, und eine Seitenleiste zum Einklappen.

### Neu

- **Keller und Gelände:** ein neuer Abschnitt **Gelände** im Editor (ohne Auswahl unten in der Seitenleiste). **Geländehöhe** sagt, wo der Boden um das Haus liegt – Rasen, Wege und Terrassen liegen darauf; für ein Souterrain senkst du sie, etwa auf −1,2 m. **Keller in der Erde zeigen:** Etagen unter dem Gelände stecken in 3D im Erdreich, ein geöffneter Keller sieht aus wie eine Baugrube. Ein Haus über dem Gelände bekommt einen Sockel, nichts schwebt. Ein Keller ist einfach eine Etage mit negativer Höhe, etwa −2,6 m.
- **Kellerfenster:** ein Knopf im Fensterformular setzt 100 × 50 cm, 25 cm unter der Decke. Ein Fenster unter dem Gelände bekommt in 3D von selbst einen Lichtschacht mit Gitterrost.
- **Aufgeräumte Werkzeugleiste** im Editor, ohne Emojis, in Gruppen: **Auswählen**, **Bauen ▾** (Raum als Rechteck, Freie Form oder Nach Maß, Wand, Tür & Fenster, Bodenöffnung, Dach), **Draußen ▾** (Außenflächen mit Art und Form, Pool mit Form), **Möbel**, **Energie**, Rückgängig und Wiederholen als **↶ ↷**, dazu **3D daneben**, **Wandansicht** und **Grundriss komplett**. Ein Gruppenknopf zeigt das Werkzeug, das gerade läuft, etwa „Raum: Freie Form“.
- **Etagen-Menü:** **Etage: Erdgeschoss ▾** ganz links in der Werkzeugleiste, in jedem Werkzeug – Etage wechseln, **Etage hinzufügen** (auch aus den Etagen von Home Assistant) und **Etagen-Einstellungen**, ohne erst zu Auswählen zu gehen.
- **Werkzeuge bleiben aktiv:** Nach dem Setzen einer Tür, eines Fensters, Raums, einer Außenfläche oder Bodenöffnung bleibt das Werkzeug an – mehrere hintereinander setzen geht ohne Umweg. **Esc** oder **Auswählen** beendet es.
- **Seitenleiste einklappen:** **Einklappen ›** oben in der Seitenleiste macht sie zu einem schmalen Streifen – mehr Platz im Grundriss, etwa zum Verschieben von Möbeln. **‹** klappt sie auf, ein leuchtendes **⚙** öffnet die Einstellungen der Auswahl; ein anderes Werkzeug klappt sie von selbst wieder auf.
- **Grundriss komplett** (bisher *Alles zeigen*) holt beim Zeichnen von Außenflächen und Pools auch den Garten ins Bild.
- **3D-Ansicht:** Die Schalter (Wände, Etagen, Dach, Heatmap, Raumnamen, Pro-Anzeigen) stecken in einem Menü **Anzeige ▾**; die Ansichtsoptionen in der Kopfzeile (Qualität, Look, Symbole, FPS) liegen auf jedem Bildschirm hinter dem **⚙**.
- **Reiter Erweiterungen:** ein klares Abzeichen statt des kleinen Punkts – **„2 bereit“** für gekaufte oder geschenkte Packs zum Installieren oder Aktualisieren, **„3 neu“** für neue Angebote im Shop. Ein Pack, das neu in dein Konto kommt, meldet Home Assistant außerdem einmal unter Benachrichtigungen; nach dem Installieren verschwindet die Meldung.

### Geändert

- **Grundriss sperren** ist aus der Werkzeugleiste in die Etagen-Einstellungen umgezogen; im Rechtsklick-Menü eines Raums steht es weiterhin.

### Behoben

- **UniFi-Kameras** werden nicht mehr unter einer anderen Entität ihres Geräts zusammengefasst und lassen sich wieder auswählen (#517).
- **Haustür mit Seitenteil:** Das Seitenteil hat einen Rahmen über die ganze Tiefe der Zarge, eine Sprosse neben dem Türblatt und sein Glas in der Ebene des Türblatts (#519).
- **Medien-Tasten**, die der Player nicht kann (zurück, vor, Pause, Play), sind ausgegraut (#400).
- **Flackernde Möbel:** Eckbadewanne, Außenküche und Netzwerkschrank flackern nicht mehr – mit den Pack-Updates Bad (Release 4), Garten (Release 4) und Smart Home (Release 3), die mit Shop-Verbindung von selbst kommen (#516).

### So bekommst du das Update

Einstellungen → System → Updates. HACS sucht nur alle paar Stunden nach neuen Versionen, deshalb fehlt ein frisches Update dort manchmal noch. Dann: HACS → NeonPlan 3D → ⋮ → **Informationen aktualisieren** → **Herunterladen**. Home Assistant neu starten und die Seite neu laden (Strg+F5).
