## 🇩🇪 Deutsch

### Neu

- **Grundriss sperren und Möbel fixieren:** **🔒 Grundriss** in der Werkzeugleiste sperrt Räume, Wände, Türen, Fenster und Außenflächen, damit nichts mehr versehentlich verrutscht. Möbel und Geräte fixierst du einzeln: Schloss im Formular, Taste **L** oder **Rechtsklick** (Tablet: langes Drücken). Das neue Rechtsklick-Menü kann außerdem duplizieren, drehen und löschen.
- **Mehr Sensoren im Plan:** Neben Temperatur, Luftfeuchte, CO₂ und Leistung lassen sich jetzt auch Gas- und Wasserzähler, Energie, Helligkeit, Luftdruck und Luftqualität (Feinstaub, VOC, CO) platzieren. Zähler ohne Geräteklasse zählen mit, wenn ihre Einheit passt (m³, l, kWh, lx), etwa von AI-on-the-edge. Werte erscheinen mit den Nachkommastellen aus Home Assistant. Danke an @Lice2 (#7).
- **Fernseher an der Steckdose:** Ein Fernseher lässt sich jetzt auch mit dem Schalter einer smarten Steckdose verknüpfen statt mit einem Media-Player. Der Bildschirm leuchtet, solange die Steckdose an ist, ein Tipp schaltet sie. Danke an @turbospielt (#5).
- **Symbol in 3D je Gerät:** Im Formular eines Geräts oder elektrischen Möbels wählst du *Automatisch*, *Immer zeigen*, *Ohne Watt* oder *Ausblenden*. So verschwinden etwa die Watt an Steckdosen, und ein Temperatursensor ist immer zu sehen. Danke an @henninghartwig für die Idee.
- **Markieren wenn geschlossen:** Türen und Fenster können jetzt leuchten, solange sie *geschlossen* sind statt offen, etwa die WC- oder Kinderzimmertür. Einstellung *Markieren in 3D* im Formular der Tür. Danke an @StevenKRT für die Idee.

### Behoben

- **Möbel mit Gerät in 3D verschieben:** Eine Waschmaschine, ein Fernseher oder eine Leuchte mit verknüpfter Entität ließ sich in der 3D-Ansicht nicht ziehen, wenn man das Möbel oder sein Symbol packte. Jetzt verschieben sich diese Möbel in 3D wie alle anderen.

Nach dem Update Home Assistant neu starten und die Seite neu laden.

---

## 🇬🇧 English

### New

- **Locking the floor plan and fixing furniture:** **🔒 Floor plan** in the toolbar locks rooms, walls, doors, windows and outdoor areas so nothing slips by accident. Furniture and devices are fixed one by one: lock in the form, key **L** or **right-click** (tablet: long press). The new right-click menu can also duplicate, turn and delete.
- **More sensors in the plan:** besides temperature, humidity, CO₂ and power you can now place gas and water meters, energy, illuminance, pressure and air quality (particulates, VOC, CO). Meters without a device class count too when their unit fits (m³, l, kWh, lx), e.g. from AI-on-the-edge. Values show the decimals set in Home Assistant. Thanks to @Lice2 (#7).
- **TV on a smart plug:** a TV can now link the switch of a smart plug instead of a media player. The screen glows while the plug is on, a tap switches it. Thanks to @turbospielt (#5).
- **Marker in 3D per device:** in the form of a device or electric furniture item choose *Automatic*, *Always show*, *Without watts* or *Hide*. Plugs lose their watts, a temperature sensor is always visible. Thanks to @henninghartwig for the idea.
- **Highlight when closed:** doors and windows can now glow while they are *closed* instead of open, e.g. the WC or a child's room door. Setting *Highlight in 3D* in the door's form. Thanks to @StevenKRT for the idea.

### Fixed

- **Moving furniture with a device in 3D:** a washing machine, a TV or a lamp with a linked entity could not be dragged in the 3D view when you grabbed the item or its marker. Now they move in 3D like all other furniture.

Restart Home Assistant after updating and reload the page.
