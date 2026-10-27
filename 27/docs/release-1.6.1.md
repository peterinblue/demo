### Neu

- Die Warnung „Fenster offen bei Regen“ lässt sich einzeln abschalten: Editor → Einstellungen, bei den Wetter-Effekten.
- Saugroboter fahren im Raum, den sie melden: Ein Sensor „Aktueller Raum“ (Roborock, Dreame …) wird am Gerät des Roboters von selbst gefunden und über den Raum- oder Bereichsnamen zugeordnet. Ohne Sensor bleibt er wie bisher im Raum seiner Station.
- Saugroboter fahren um Schränke, Sofas, Betten und Geräte herum, unter Tischen, Schreibtischen und Stühlen aber durch.

### Behoben

- Eine Tischleuchte, Stehleuchte oder ein Deckenfluter mit von Hand gesetzter Höhe über dem Boden wird jetzt selbst angehoben, nicht nur ihr Auswahlrahmen (#20).
- Heatmap und Raumfenster mit °F: Sensoren in °F werden umgerechnet, Legende und Werte zeigen die Einheit von Home Assistant.
- Überlappende Bodenöffnungen werden als ein Umriss ausgeschnitten (zum Beispiel eine L-Form), statt den Boden zu zerreißen.
- Eine Bodenöffnung, die an der Raumkante eingerastet ist, wird jetzt ausgeschnitten, statt als „ragt über die Raumgrenze“ zu gelten.
- Die Regenwarnung nimmt die in den Einstellungen gewählte Wetter-Entität.

---

### New

- The warning for a window open in the rain can be switched off on its own: Editor → Settings, next to the weather effects.
- Robot vacuums clean the room they report: a "current room" sensor (Roborock, Dreame …) is found on the robot's device by itself and matched by room or area name. Without one it stays in the room of its dock as before.
- Robot vacuums drive around cabinets, sofas, beds and appliances, but under tables, desks and chairs.

### Fixed

- A table lamp, floor lamp or uplight with a height above the floor set by hand now moves the lamp itself, not only its selection box (#20).
- Heatmap and room panel with °F: sensors in °F are converted, the legend and values show Home Assistant's unit.
- Overlapping floor openings are cut as one outline (an L shape, for example) instead of breaking the floor.
- A floor opening snapped to the room's edge is cut instead of being reported as outside the room.
- The rain warning uses the weather entity chosen in the settings.
