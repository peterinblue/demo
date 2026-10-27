**NeonPlan 3D 1.19.0** brings awnings that run out with their cover, waste bins and mailboxes for everyone, **Household Pro** as a beta, and a new **import page** (beta) that turns plans from other programs into a NeonPlan plan.

### New

- **Awnings (D170, D274, D502):** under *Furniture → Terrace & balcony*. The kinds are **folding-arm** over a terrace, **drop-arm** for a balcony or window, **vertical / ZIP** in side rails, **pergola / conservatory** with a frame and posts, and a **side awning** pulled out from a post.
  - The awning runs out and in with its cover in Home Assistant, like a blind. With a position it moves slowly along; with only "opening/closing" it takes its run time.
  - Settings: pitch of the fabric, valance, a position sensor of its own, and a switch for covers that count the other way round.
- **Waste bins and mailboxes – for everyone:** under *Furniture → Household*.
  - **Bins:** wheelie bins 120 l and 240 l, a 1100 l container, a multi-compartment bin, a bag, a caddy and an underground container.
  - **Colours:** each kind of waste starts in the colours usual in your country (from Home Assistant's country setting), and body and lid can be changed freely.
  - **Mailboxes:** a wall mailbox, a mailbox on a post with a flag, a post box with a newspaper holder, a parcel box and a mailbox bank.
- **Household Pro – beta, first for supporters:** the household shows what is due, right where it happens. Feedback is welcome on Discord (#beta-feedback) or on GitHub.
  - **Bins** read your waste calendar (e.g. Waste Collection Schedule) or a sensor. A small tag on the lid says "Today", "Tomorrow" or "in 3 days", and a tap shows the next pickups.
  - **The mailbox** glows while post is in it, until it is emptied.
  - **Plants** show when they are thirsty.
  - **Washer, dryer and dishwasher** show their time left and then "Done!" until the door opens.
  - **Filters and consumables** that are due glow yellow.
  - **Fridge:** an open fridge door warns after two minutes, and the smart side-by-side fridge comes with Household Pro.
  - **A glass card "Today in the household"** lists it all.
- **Import page – beta:** [neonplan3d.mastershort.de/import](https://neonplan3d.mastershort.de/import/) turns a plan from another program into a NeonPlan file, right in the browser (the file stays on your computer). Afterwards you load the file under *Backup*.
  - **Formats:** Sweet Home 3D, iPhone/iPad scans (RoomPlan), CAD (DXF), 3D models from Blender or SketchUp (glTF/GLB, OBJ, STL), Floorplanner, Valetudo robot vacuum maps, and a simple format that an AI can write.
  - The link is under *Backup* in the editor.
  - If a file does not work, please send it with a short note on GitHub or Discord.

### Improved

- **Colour pickers** in the editor show their colour as a full swatch, e.g. "only this colour" of a lamp.

### How to update

Settings → System → Updates. HACS only looks for new versions every few hours, so a fresh update may not show there yet; then use HACS → NeonPlan 3D → ⋮ → **Update information** → **Download**. Restart Home Assistant and reload the page (Ctrl+F5).

---

**NeonPlan 3D 1.19.0** bringt Markisen, die mit ihrem Cover ausfahren, Mülltonnen und Briefkästen für alle, **Haushalt Pro** als Beta und eine neue **Import-Seite** (Beta), die Pläne aus anderen Programmen in einen NeonPlan-Plan verwandelt.

### Neu

- **Markisen (D170, D274, D502):** unter *Möbel → Terrasse & Balkon*. Die Arten sind **Gelenkarm** über der Terrasse, **Fallarm** für Balkon oder Fenster, **Senkrecht / ZIP** in Seitenschienen, **Pergola / Wintergarten** mit Rahmen und Pfosten und eine **Seitenmarkise** aus einem Pfosten.
  - Die Markise fährt mit ihrem Cover aus Home Assistant aus und ein, wie ein Rollladen. Mit Position fährt sie langsam mit; meldet das Cover nur „öffnet/schließt“, braucht sie ihre Laufzeit.
  - Einstellungen: Neigung des Tuchs, Volant, ein eigener Positionssensor und ein Schalter für Covers, die andersherum zählen.
- **Mülltonnen und Briefkästen – für alle:** unter *Möbel → Haushalt*.
  - **Tonnen:** Rolltonnen 120 l und 240 l, ein Container 1100 l, eine Mehrkammer-Tonne, ein Sack, ein Eimer und ein Unterflur-Container.
  - **Farben:** Jede Abfallart startet in den Farben, die in deinem Land üblich sind (nach der Ländereinstellung von Home Assistant); Korpus und Deckel sind frei wählbar.
  - **Briefkästen:** ein Wandbriefkasten, ein Briefkasten auf Pfosten mit Fähnchen, ein Standbriefkasten mit Zeitungsfach, eine Paketbox und eine Briefkastenanlage.
- **Haushalt Pro – Beta, zuerst für Supporter:** Das Haus zeigt, was im Haushalt ansteht, genau dort, wo es passiert. Rückmeldungen gern auf Discord (#beta-feedback) oder auf GitHub.
  - **Tonnen** lesen deinen Abfallkalender (z. B. Waste Collection Schedule) oder einen Sensor. Ein kleines Schildchen auf dem Deckel sagt „Heute“, „Morgen“ oder „in 3 Tagen“, ein Tipp zeigt die nächsten Termine.
  - **Der Briefkasten** leuchtet, solange Post drin ist, bis er geleert wurde.
  - **Pflanzen** zeigen, wenn sie Durst haben.
  - **Waschmaschine, Trockner und Spüler** zeigen ihre Restzeit und danach „Fertig!“, bis die Tür aufgeht.
  - **Fällige Filter und Verbrauchsteile** leuchten gelb.
  - **Kühlschrank:** Eine offene Kühlschranktür warnt nach zwei Minuten, und der Smart-Kühlschrank (Side-by-Side) kommt mit Haushalt Pro.
  - **Eine Glaskarte „Heute im Haushalt“** listet alles auf.
- **Import-Seite – Beta:** [neonplan3d.mastershort.de/import](https://neonplan3d.mastershort.de/import/) verwandelt einen Plan aus einem anderen Programm in eine NeonPlan-Datei, direkt im Browser (die Datei bleibt auf deinem Computer). Danach lädst du die Datei unter *Sicherung*.
  - **Formate:** Sweet Home 3D, iPhone-/iPad-Scans (RoomPlan), CAD (DXF), 3D-Modelle aus Blender oder SketchUp (glTF/GLB, OBJ, STL), Floorplanner, Valetudo-Saugroboterkarten und ein einfaches Format, das auch eine KI schreiben kann.
  - Der Link steht im Editor unter *Sicherung*.
  - Klappt eine Datei nicht, schick sie gern mit einer kurzen Beschreibung auf GitHub oder Discord.

### Verbessert

- **Farbwähler** im Editor zeigen ihre Farbe als volle Fläche, etwa bei „nur diese Farbe“ einer Lampe.

### So aktualisierst du

Einstellungen → System → Updates. HACS schaut nur alle paar Stunden nach neuen Versionen, ein frisches Update ist dort also vielleicht noch nicht zu sehen; dann HACS → NeonPlan 3D → ⋮ → **Informationen aktualisieren** → **Herunterladen**. Home Assistant neu starten und die Seite neu laden (Strg+F5).
