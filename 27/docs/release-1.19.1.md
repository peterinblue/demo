**NeonPlan 3D 1.19.1** is a round of fixes for 1.19.0, with three ideas from forks and moving curtains: the flat roof sits on its walls again, awnings show where they are as soon as the card opens, blinds stay outside, a sliding gate moves its door – and old Fire tablets get the roof back.

### New

- **Garage door from a switch:** a garage door can follow a **switch or input_boolean** that drives it (on = open, a tap in 3D switches it) – for a relay instead of a cover. Idea from the fork of @diegood.
- **Curtains and projection screens that move (#511):** the **motorised curtain** (pack *Architecture & fit-out*) now opens to both sides with its cover, as far as its position says. The **roll-down projection screen** (pack *Home cinema*) rolls up and down. The screen can now be linked to its motor's cover. Like an awning, both take a live position sensor (as for blinds), a run time and **Reverse direction**. Thanks to everyone who asked, by issue and by mail.

### Fixed

- **Flat roof floating (#556):** once fully shown, the roof floated about 13 cm above the walls. It now sits on them – thanks @Cle2301 for finding the exact spot.
- **Awning closed at the start (#546):** an awning that was already out showed rolled in until it moved again. It now shows its position as soon as the card opens. The same goes for a smart fridge door that is already open.
- **Blinds on the inside (#542):** a window in an outer wall that was filed under the neighbouring room had its blind box (and tilting sash) on the room side. Blinds in outer walls are now always outside.
- **Sliding gate on a door (#544):** a gate or garage-door cover on a door no longer draws a roller shutter over it. It moves the door leaf, as far as its position says.
- **Old wall tablets:** Fire tablets with an old WebView (before Chrome 91, e.g. with Fully Kiosk) failed on the roof. The code they can't run is gone, and the build now refuses it. Reported in the fork of @diegood.
- **Light up to the walls:** the room light on the floor now reaches every wall. There are no more dark strips along walls that lie off the light grid, e.g. in L-shaped rooms. Found by @Thundras.
- **Newer Home Assistant:** background images and restore points are turned into JSON outside the event loop again, so large plans don't slow Home Assistant down. Pointed out by @hohoanganh.
- **Supporter code:** the copy button now copies the code alone, and the hint explains how `/supporter` works in Discord. Pick the command from the list, then paste the code into the field. Never send the code as a normal message.

### How to update

Settings → System → Updates. HACS only looks for new versions every few hours, so a fresh update may not show there yet. Then: HACS → NeonPlan 3D → ⋮ → **Update information** → **Download**. Restart Home Assistant and reload the page (Ctrl+F5).

---

**NeonPlan 3D 1.19.1** ist eine Runde Fixes für 1.19.0, mit drei Ideen aus Forks und Vorhängen, die sich bewegen: Das Flachdach sitzt wieder auf den Wänden, Markisen zeigen sofort, wo sie stehen, Rollläden bleiben außen, ein Schiebetor bewegt seine Tür – und alte Fire-Tablets bekommen ihr Dach zurück.

### Neu

- **Garagentor über einen Schalter:** Ein Garagentor kann einem **Schalter oder input_boolean** folgen, der es antreibt (an = offen, Antippen in 3D schaltet ihn) – für ein Relais statt eines Covers. Idee aus dem Fork von @diegood.
- **Vorhänge und Leinwände, die sich bewegen (#511):** Der **motorisierte Vorhang** (Pack *Architektur & Ausbau*) öffnet sich jetzt mit seinem Cover zu beiden Seiten, so weit seine Position sagt. Die **ausrollbare Leinwand** (Pack *Heimkino*) fährt hoch und runter. Die Leinwand lässt sich jetzt mit dem Cover ihres Motors verknüpfen. Wie die Markise nehmen beide einen Live-Positionssensor (wie bei Rollläden), eine Laufzeit und **Richtung umkehren**. Danke an alle, die per Issue und Mail gefragt haben.

### Behoben

- **Schwebendes Flachdach (#556):** Ganz eingeblendet schwebte das Dach etwa 13 cm über den Wänden. Jetzt sitzt es auf – danke an @Cle2301 für die genaue Fundstelle.
- **Markise beim Start eingefahren (#546):** Eine schon ausgefahrene Markise erschien eingefahren, bis sie sich wieder bewegte. Jetzt zeigt sie ihre Position, sobald die Karte öffnet. Das gilt auch für eine schon offene Smart-Kühlschranktür.
- **Rollläden innen (#542):** Ein Fenster in einer Außenwand, das dem Nachbarraum zugeordnet war, hatte Rollladenkasten (und Kippflügel) auf der Raumseite. Rollläden in Außenwänden sitzen jetzt immer außen.
- **Schiebetor an einer Tür (#544):** Ein Tor- oder Garagen-Cover an einer Tür zeichnet keinen Rollladen mehr darüber. Es bewegt das Türblatt, so weit seine Position sagt.
- **Alte Wandtablets:** Fire-Tablets mit altem WebView (vor Chrome 91, z. B. mit Fully Kiosk) scheiterten am Dach. Der Code, den sie nicht ausführen können, ist raus, und der Build lässt ihn nicht mehr zu. Gemeldet im Fork von @diegood.
- **Licht bis an die Wände:** Das Raumlicht auf dem Boden reicht jetzt an jede Wand. Es gibt keine dunklen Streifen mehr an Wänden, die schräg zum Lichtraster liegen, etwa in L-förmigen Räumen. Gefunden von @Thundras.
- **Neueres Home Assistant:** Hintergrundbilder und Wiederherstellungspunkte werden wieder außerhalb der Event-Loop in JSON umgewandelt, damit große Pläne Home Assistant nicht bremsen. Hinweis von @hohoanganh.
- **Supporter-Code:** Der Kopieren-Knopf kopiert jetzt nur den Code, und der Hinweis erklärt, wie `/supporter` in Discord geht. Den Befehl aus der Liste wählen und dann den Code ins Feld einfügen. Den Code nie als normale Nachricht senden.

### So bekommst du das Update

Einstellungen → System → Updates. HACS sucht nur alle paar Stunden nach neuen Versionen, deshalb fehlt ein frisches Update dort manchmal noch. Dann: HACS → NeonPlan 3D → ⋮ → **Informationen aktualisieren** → **Herunterladen**. Home Assistant neu starten und die Seite neu laden (Strg+F5).
