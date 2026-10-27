## 🇩🇪 Deutsch

### Neu

- **Geräte aus anderen Bereichen und ohne Bereich:** Über der Geräteliste eines Raums wählst du jetzt die Quelle: **Dieser Bereich**, **Andere Bereiche** oder **Ohne Bereich** (Template-Lichter, Gruppen, Helfer, Sensoren ohne Bereich). So setzt du auch Geräte in einen Raum, die in Home Assistant woanders oder gar nicht zugeordnet sind.
- **„Alle platzieren“ entschärft:** Der große Knopf ist weg. Unter der Liste steht ein kleiner Link **Alle … platzieren**, der vorher nachfragt – kein voller Raum mehr durch einen versehentlichen Klick.
- **Raumklima je Raum:** Im Raumformular wählst du unter **Raumklima**, welche Sensoren Temperatur, Luftfeuchte und CO₂ des Raums liefern. *Automatisch* lässt jetzt Gerätetemperaturen weg – etwa die Düse eines 3D-Druckers oder den Vorlauf einer Wärmepumpe – und zählt im Raum platzierte Sensoren mit.

### Behoben

- **Höhe über Boden bei eingebauten Möbeln:** Trockner, Regale, Kommoden und alle anderen eingebauten Möbel blieben in 3D am Boden, auch wenn eine *Höhe über Boden* eingetragen war. Jetzt steht z. B. der Trockner auf der Waschmaschine. Danke an @Jehon840 (#13).
- **Oberschränke tiefer hängen:** Die *Höhe über Boden* zählt jetzt immer vom Boden. Ein Oberschrank zeigt seine 1,45 m und lässt sich auch tiefer setzen, ebenso Wand-Fernseher und Heizkörper.

Nach dem Update Home Assistant neu starten und die Seite neu laden.

---

## 🇬🇧 English

### New

- **Devices from other areas and without an area:** above a room's device list you now choose the source: **This area**, **Other areas** or **No area** (template lights, groups, helpers, sensors without an area). So you can put devices into a room that Home Assistant assigns elsewhere or nowhere.
- **"Place all" made safe:** the big button is gone. Below the list a small link **Place all …** asks first – no more room full of devices from one accidental click.
- **Room climate per room:** in the room form, **Room climate** picks the sensors for the room's temperature, humidity and CO₂. *Automatic* now leaves out device temperatures – e.g. a 3D printer's nozzle or a heat pump's flow – and counts sensors placed in the room.

### Fixed

- **Height above floor for built-in furniture:** dryers, shelves, dressers and all other built-in items stayed on the floor in 3D even with a *Height above floor* set. Now the dryer sits on the washing machine, for example. Thanks to @Jehon840 (#13).
- **Lower wall cabinets:** the *Height above floor* now always counts from the floor. A wall cabinet shows its 1.45 m and can be set lower too, as can wall TVs and radiators.

Restart Home Assistant after updating and reload the page.
