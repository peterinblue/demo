**NeonPlan 3D 1.18.2** is a round of fixes from your reports: light wells you can leave out, sound rings back on their speakers, live energy curves, roof windows over lower floors, round mirrors you can see, daylight under roof windows, calmer pets – and the right mouse button pans the plan.

### New

- **Light wells your way (#524):** a window below the ground can do without its light well (the tick **Light well** in the window form – e.g. where a path runs past), and **Rim above the ground** raises the well's rim and grate above gravel or a path laid around the house.
- **A solar string can end at a battery (D410):** under *Connected to* a string can now also choose a battery with a solar input of its own (a power station such as EcoFlow) – its cable then runs there instead of to the nearest inverter.
- **Pan with the right mouse button (D518):** drag the plan with the right (or middle) mouse button; a right click without dragging still opens the menu.
- **Furniture down to 1 cm (D520):** width and depth can be typed down to 1 cm, e.g. for a narrow worktop strip.

### Fixed

- **Sound rings (Klang & Kino) on upper floors** floated far above the speakers – the floor's height was counted twice (#521).
- **Energy cards:** the day curve stopped updating after the view had left the page once (another dashboard view and back) and only came back with a reload; it now refreshes again, at once when a wall tablet's screen comes back on, and no longer drops to zero for the last minutes the recorder has no value for yet (#527).
- **Roof windows:** a soft patch of daylight lies under every roof window with an open blind – also when the sun is on the other side of the roof or so low that its light fell onto the walls of a small room (D340).
- **Pets:** they no longer sink into rugs, a dog lies along the sofa instead of half inside it, and they wander through more of the house instead of going back and forth between two places (D507).
- **Cables:** a double click on a cable point takes it out again (D410).
- **Round parts that looked hollow:** cylinders lying along the depth showed only their outline from the front, and one end of every lying cylinder was missing – e.g. the **round mirror with light** of the Bath pack, a camera's lens and some pack items. They are solid again (#534). The Bath pack gets an update with a brighter mirror and a light ring round it.
- **Roof windows over a lower floor:** where the slope reaches down over the floor below, floating roof windows now show with that floor when the roof fades out (#482).
- **Light wells under a lawn or path:** a lawn, path or terrace drawn up to the house no longer covers the light well – its rim stands just above the surface by itself (#524).
- **Furniture type list:** it offered devices of the energy tool and parts not released yet (e.g. a ball valve) that are not in the library; it now offers what the library offers (#530).
- **Sidebar panel:** with themes that set safe-area insets it was taller than the window and its bottom was cut off (#529 – thanks @brentgl for the precise report).

### How to update

Settings → System → Updates. HACS only looks for new versions every few hours, so a fresh update may not show there yet. Then: HACS → NeonPlan 3D → ⋮ → **Update information** → **Download**. Restart Home Assistant and reload the page (Ctrl+F5).

---

**NeonPlan 3D 1.18.2** ist eine Runde Fixes aus euren Meldungen: Lichtschächte zum Weglassen, Klang-Ringe wieder an den Lautsprechern, Energie-Kurven live, Dachfenster über unteren Etagen, sichtbare runde Spiegel, Tageslicht unter Dachfenstern, entspanntere Haustiere – und die rechte Maustaste verschiebt den Plan.

### Neu

- **Lichtschächte nach Wunsch (#524):** Ein Fenster unter dem Gelände kann ohne Lichtschacht auskommen (Haken **Lichtschacht** im Fensterformular – etwa wenn außen ein Weg vorbeiführt), und **Rand über dem Gelände** hebt Rand und Gitter über Kies oder einen Weg ums Haus.
- **Ein Solar-Strang kann an einem Speicher enden (D410):** Unter *Angeschlossen an* wählt ein Strang jetzt auch einen Stromspeicher mit eigenem Solareingang (eine Powerstation wie EcoFlow) – seine Leitung läuft dann dorthin statt zum nächsten Wechselrichter.
- **Verschieben mit der rechten Maustaste (D518):** Den Plan ziehst du mit der rechten (oder mittleren) Maustaste; ein Rechtsklick ohne Ziehen öffnet weiter das Menü.
- **Möbel bis 1 cm (D520):** Breite und Tiefe lassen sich bis auf 1 cm eintippen, etwa für eine schmale Arbeitsplatte.

### Behoben

- **Klang-Ringe (Klang & Kino) in oberen Etagen** schwebten weit über den Lautsprechern – die Etagenhöhe wurde doppelt gerechnet (#521).
- **Energie-Karten:** Die Tageskurve blieb stehen, nachdem die Ansicht einmal die Seite verlassen hatte (andere Dashboard-Ansicht und zurück), und kam erst mit Neuladen wieder; jetzt aktualisiert sie sich wieder, sofort wenn ein Wandtablet aufwacht, und fällt am Ende nicht mehr auf null für die letzten Minuten, für die der Recorder noch keinen Wert hat (#527).
- **Dachfenster:** Unter jedem Dachfenster mit offenem Rollo liegt ein sanfter Tageslichtfleck – auch wenn die Sonne auf der anderen Dachseite steht oder so tief, dass ihr Licht in einem kleinen Raum auf die Wände fiel (D340).
- **Haustiere:** Sie versinken nicht mehr im Teppich, ein Hund liegt längs vor dem Sofa statt halb darin, und sie laufen mehr durchs Haus statt zwischen zwei Plätzen hin und her (D507).
- **Leitungen:** Ein Doppelklick auf einen Leitungspunkt nimmt ihn wieder heraus (D410).
- **Runde Teile, die hohl aussahen:** Zylinder, die in der Tiefe liegen, zeigten von vorn nur ihren Umriss, und bei allen liegenden Zylindern fehlte ein Ende – etwa beim **runden Spiegel mit Licht** aus dem Bad-Pack, bei einer Kamera-Linse und einigen Pack-Möbeln. Sie sind wieder massiv (#534). Das Bad-Pack bekommt ein Update mit hellerem Spiegel und Leuchtring.
- **Dachfenster über einer unteren Etage:** Reicht die Dachschräge über die Etage darunter, zeigen sich schwebende Dachfenster jetzt mit dieser Etage, wenn das Dach ausblendet (#482).
- **Lichtschächte unter Rasen oder Weg:** Ein Rasen, Weg oder eine Terrasse bis ans Haus deckt den Lichtschacht nicht mehr zu – sein Rand steht von selbst knapp darüber (#524).
- **Möbel-Typliste:** Sie bot Geräte des Energie-Werkzeugs und noch nicht veröffentlichte Teile an (z. B. einen Kugelhahn), die es in der Bibliothek nicht gibt; jetzt bietet sie, was die Bibliothek anbietet (#530).
- **Seitenleisten-Panel:** Mit Themes, die Abstände für Notch-Bereiche setzen, war es höher als das Fenster und unten abgeschnitten (#529 – danke an @brentgl für die genaue Meldung).

### So bekommst du das Update

Einstellungen → System → Updates. HACS sucht nur alle paar Stunden nach neuen Versionen, deshalb fehlt ein frisches Update dort manchmal noch. Dann: HACS → NeonPlan 3D → ⋮ → **Informationen aktualisieren** → **Herunterladen**. Home Assistant neu starten und die Seite neu laden (Strg+F5).
