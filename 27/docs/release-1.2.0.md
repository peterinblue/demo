## 🇩🇪 Deutsch

### Neu

- **Wandhöhe je Wand:** Jede Wand kann jetzt niedriger sein als der Raum, z. B. als Brüstung, Theke oder halbhohe Raumtrennung.
  - **Räume** (Rechteck und freie Form): Raum auswählen, im Kasten **Wandhöhen** die Höhe jeder einzelnen Wand eintragen. Fährst du über eine Zeile, leuchtet die Wand im Plan auf. Die Ecken des Raums sind im Plan nummeriert („Wand 2–3“). ↥ setzt eine Wand auf volle Raumhöhe zurück.
  - **Freie Wände:** Wand antippen und im Formular die **Höhe** einstellen.
  - Teilen sich zwei Räume eine Wand, gilt die niedrigere Höhe. Fenster und Türen in einer niedrigen Wand enden an der Wandhöhe. Niedrige Wände erscheinen im Plan heller, in 3D bekommen sie eine leuchtende Oberkante.
- **Türen und Fenster in einzelnen Wänden:** Mit **Tür & Fenster** auf eine frei stehende Wand tippen, schon sitzt dort eine Tür oder ein Fenster, mit allen Arten, Stilen und Sensoren wie in Raumwänden. Löschst du die Wand, verschwinden ihre Türen und Fenster mit.
- **Höhe von Wandleuchten und LED-Streifen:** Im Formular gibt es jetzt **Höhe über Boden**, etwa für einen Streifen unter den Hängeschränken oder eine Wandleuchte neben dem Bett. Ein Streifen unter 1 m, etwa an der Sockelleiste, strahlt nach oben an die Wand. Ohne Angabe bleibt alles wie bisher (Wandleuchte 1,75 m, Streifen unter der Decke).
- **Firstrichtung beim Satteldach:** Unter *Einstellungen → Dach* legt **First** fest, ob der First entlang der langen oder der kurzen Seite läuft. Damit stimmt das Dach bei Reihenhäusern und anderen schmalen, tiefen Häusern. Danke an @aphulinh-sys für die Idee (#1).
- **Pfeiltasten im Editor:** Das Ausgewählte (Raum, Ecke, Möbel, Gerät, Wand, Außenfläche) rückt um einen Rasterschritt, mit **Umschalt** um 10 cm, mit **Alt** um 1 cm. Türen und Fenster wandern entlang ihrer Wand.

### Behoben

- **Mehrere Leuchten an einem Licht:** Hängen zwei oder mehr Leuchten an derselben Entität (z. B. zwei LED-Leisten an einem Shelly), leuchtete in 3D nur eine richtig, die anderen blieben dauerhaft grün. Jetzt folgen alle dem Licht.

### Community

- **Ideen und Abstimmung:** Wünsche gehören jetzt in [Discussions → Ideas](https://github.com/Mastershort/neonplan3d/discussions/categories/ideas). Dort kann jede und jeder mit 👍 abstimmen, die beliebtesten Ideen kommen zuerst.
- **Fehler melden** geht über ein kurzes Formular unter [Issues](https://github.com/Mastershort/neonplan3d/issues/new/choose), Fragen unter [Q&A](https://github.com/Mastershort/neonplan3d/discussions/categories/q-a).
- Alle Änderungen auf einen Blick: [CHANGELOG](https://github.com/Mastershort/neonplan3d/blob/main/CHANGELOG.md).

Nach dem Update Home Assistant neu starten und die Seite neu laden.

---

## 🇬🇧 English

### New

- **Wall height per wall:** any wall can now be lower than the room, e.g. a parapet, a counter or a half-height divider.
  - **Rooms** (rectangle and free shape): select the room and enter the height of each wall in the **Wall heights** box. Hovering a row lights the wall up in the plan. The room's corners are numbered in the plan ("Wall 2–3"). ↥ resets a wall to full room height.
  - **Free walls:** tap the wall and set its **Height** in the form.
  - If two rooms share a wall, the lower height applies. Windows and doors in a low wall end at the wall height. Low walls look lighter in the plan and get a glowing top edge in 3D.
- **Doors and windows in single walls:** tap a free-standing wall with **Doors & windows** to put a door or window into it, with all types, styles and sensors as in room walls. Deleting the wall removes its doors and windows as well.
- **Height of wall lights and LED strips:** the form now has **Height above floor**, e.g. for a strip under the wall cabinets or a wall light beside the bed. A strip below 1 m, e.g. on the skirting board, shines up the wall. Without a value nothing changes (wall light at 1.75 m, strip under the ceiling).
- **Ridge direction of gable roofs:** under *Settings → Roof*, **Ridge** sets whether the ridge runs along the long or the short side. Terraced houses and other narrow, deep houses get the right roof now. Thanks to @aphulinh-sys for the idea (#1).
- **Arrow keys in the editor:** the selection (room, corner, furniture, device, wall, outdoor area) moves by one grid step, with **Shift** by 10 cm, with **Alt** by 1 cm. Doors and windows slide along their wall.

### Fixed

- **Several lamps on one light:** when two or more lamps share one entity (e.g. two LED strips on one Shelly), only one lit up correctly in 3D, the others stayed green. Now they all follow the light.

### Community

- **Ideas and voting:** feature requests now go to [Discussions → Ideas](https://github.com/Mastershort/neonplan3d/discussions/categories/ideas). Everyone can vote with 👍, the most wanted ideas come first.
- **Bug reports** use a short form under [Issues](https://github.com/Mastershort/neonplan3d/issues/new/choose), questions go to [Q&A](https://github.com/Mastershort/neonplan3d/discussions/categories/q-a).
- All changes at a glance: [CHANGELOG](https://github.com/Mastershort/neonplan3d/blob/main/CHANGELOG.md).

Restart Home Assistant after updating and reload the page.
