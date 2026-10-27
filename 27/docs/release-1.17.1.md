**NeonPlan 3D 1.17.1** comes with a present: **pets** 🐱🐶🐰 – a thank-you for your great support. Many of you report bugs, test, send ideas and buy packs, and that is what keeps NeonPlan 3D going. So here is something just for fun.

Besides that, 1.17.1 fixes what you reported after 1.17.0: terrace doors that open outwards, the robot vacuum with dock from the Smart Home pack, smoke detectors with binary sensors and roof windows in the room view. The wall view can zoom now, and pools get a real depth.

![NeonPlan 3D 1.17.1: pets – a cat on the sofa, a labrador and a cat taking the stairs, fish in the aquarium](https://raw.githubusercontent.com/Mastershort/neonplan3d/main/docs/images/pets.jpg)

### 🎁 A present: pets (fun pack)

- **A cat, a rabbit or a dog** – dachshund, pug, terrier, labrador or shepherd – live in your 3D house. They walk through the doors from room to room and **up and down the stairs**, a cat jumps onto the **sofa or bed** from the front, a dog lies down in front of it, and at night they sleep curled up.
- A door whose contact reports it shut stops them. In the **aquariums** of the Pets pack, colourful **fish** swim.
- They are only drawn while one moves – resting, they cost nothing, even on old wall tablets.
- **How to get it:** the fun pack *Pets* is **free in the shop (0 €)** for everyone who already supports NeonPlan 3D with a pack – no invoice; give something if you like, but you don't have to. Then **Extensions → 🎈 Fun packs → + Add a pet**. In the dashboard card, **Show the pets** (`pets: false`) leaves them out, e.g. on the wall tablet. Admins get a short note in the editor once.
- More fun packs will follow now and then, e.g. for Halloween or Christmas.

### New

- **Wall view – zoom:** in *Wall from the front* the mouse wheel zooms towards the pointer, two fingers on a tablet; **＋ / − / ⤢** at the bottom right, arrows move the view while zoomed. Small parts such as connections are easy to hit now.
- **Pools with depth:** a pool has a **basin depth** (1.50 m unless set) and a **rim above the lawn** – a 1.50 m pool that stands 20 cm out of the lawn: depth 1.50, rim 0.20. In 3D you look through the water onto the basin's walls and floor. The depth shows when the pool lies in a lawn, terrace or other area; without ground around it, it stays flat as before.
- **Terrace doors open outwards:** **⇅ Reverse opening direction** now works for terrace doors too; in 3D the sashes swing outside (#492).
- **Extensions page tidier:** the shop's packs and your installed packs fold into one bar each – installed, updates, not installed yet – with the list on a tap and **Install/update all**.

### Fixed

- **Robot vacuum with dock (Smart Home pack):** it gets the **Current room (sensor)** field, links to the vacuum in its room by itself and drives its lanes through the reported room in 3D like the built-in robot (#470, thanks MKRAFT3D and frops83).
- **Smoke detectors** take binary sensors (`binary_sensor.…_smoke`); other items offer binary sensors of alarm classes (smoke, gas, CO, water, heat) (#490, thanks frops83).
- **Roof windows** stay in the slope when the roof fades out over a floor or a room – open, tilted, blind down; a closed rim between roof and frame, so a low view no longer looks through into the room below (#482 thanks RkcCorian, #490).
- **Wall view:** the Del key there no longer reaches what is chosen in the plan behind it.
- **Pool warnings** (frost, pH, chlorine) no longer make every room of the house pulse – they show at the top only.

### How to update

Settings → System → Updates. HACS only looks for new versions every few hours, so a fresh update may not show there yet. Then: HACS → NeonPlan 3D → ⋮ → **Update information** → **Download**. Restart Home Assistant and reload the page (Ctrl+F5).

---

**NeonPlan 3D 1.17.1** bringt ein Geschenk mit: **Haustiere** 🐱🐶🐰 – als Dankeschön für eure großartige Unterstützung. Viele von euch melden Fehler, testen, schicken Ideen und kaufen Packs, und genau das hält NeonPlan 3D am Laufen. Darum gibt es jetzt etwas einfach nur zum Spaß.

Außerdem behebt die 1.17.1, was ihr nach der 1.17.0 gemeldet habt: Terrassentüren, die nach außen öffnen, den Saugroboter mit Station aus dem Pack Smart Home, Rauchmelder mit Binärsensoren und Dachfenster in der Raumansicht. Die Wandansicht kann jetzt zoomen, und Pools bekommen eine echte Tiefe.

![NeonPlan 3D 1.17.1: Haustiere – Katze auf dem Sofa, Labrador und Katze auf der Treppe, Fische im Aquarium](https://raw.githubusercontent.com/Mastershort/neonplan3d/main/docs/images/pets.jpg)

### 🎁 Ein Geschenk: Haustiere (Fun-Pack)

- **Katze, Kaninchen oder Hund** – Dackel, Mops, Terrier, Labrador oder Schäferhund – leben in deinem 3D-Haus. Sie laufen durch die Türen von Raum zu Raum und **die Treppe hoch und runter**, die Katze springt von vorne aufs **Sofa oder Bett**, der Hund legt sich davor, und nachts schlafen sie eingerollt.
- Eine Tür, deren Kontakt „zu“ meldet, ist für sie zu. In den **Aquarien** aus dem Pack Haustiere schwimmen bunte **Fische**.
- Gezeichnet wird nur, solange sich ein Tier bewegt – ruhend kosten sie nichts, auch nicht auf alten Wandtablets.
- **So bekommst du es:** Das Fun-Pack *Haustiere* gibt es **kostenlos im Shop (0 €)** für alle, die NeonPlan 3D schon mit einem Pack unterstützen – ohne Rechnung; wer mag, gibt freiwillig etwas dazu, muss aber nicht. Dann **Erweiterungen → 🎈 Fun-Packs → + Haustier hinzufügen**. In der Dashboard-Karte blendet **Haustiere zeigen** (`pets: false`) sie aus, etwa am Wandtablet. Admins bekommen einmal einen kurzen Hinweis im Editor.
- Weitere Fun-Packs gibt es ab und zu, zum Beispiel zu Halloween oder Weihnachten.

### Neu

- **Wandansicht – Zoom:** In *Wand von vorne* zoomt das Mausrad dorthin, wo die Maus steht, am Tablet zwei Finger; **＋ / − / ⤢** unten rechts, vergrößert schieben Pfeile den Ausschnitt. Kleine Teile wie Anschlüsse triffst du so leicht.
- **Pools mit Tiefe:** Ein Pool hat eine **Beckentiefe** (sonst 1,50 m) und einen **Rand über dem Rasen** – ein 1,50 m tiefer Pool, der 20 cm aus dem Rasen schaut: Tiefe 1,50, Rand 0,20. In 3D siehst du durch das Wasser auf Wände und Boden des Beckens. Die Tiefe zeigt sich, wenn der Pool in einer Rasen-, Terrassen- oder anderen Fläche liegt; ohne Boden drumherum bleibt er flach wie bisher.
- **Terrassentüren nach außen:** **⇅ Öffnungsrichtung umdrehen** gibt es jetzt auch bei Terrassentüren; in 3D schwingen die Flügel nach draußen (#492).
- **Erweiterungen aufgeräumt:** Die Packs aus dem Shop und deine installierten Packs sind je in einem Balken zusammengefasst – installiert, Updates, noch nicht installiert – die Liste klappt auf Tippen auf, dazu **Alle installieren/aktualisieren**.

### Behoben

- **Saugroboter mit Station (Pack Smart Home):** Er hat jetzt das Feld **Aktueller Raum (Sensor)**, verknüpft sich von selbst mit dem Sauger im Raum und fährt in 3D seine Bahnen durch den gemeldeten Raum wie der eingebaute Roboter (#470, danke MKRAFT3D und frops83).
- **Rauchmelder** nehmen Binärsensoren (`binary_sensor.…_smoke`); andere Möbel bieten Binärsensoren mit Alarm-Klasse an (Rauch, Gas, CO, Wasser, Hitze) (#490, danke frops83).
- **Dachfenster** bleiben in der Schräge stehen, wenn das Dach über einer Etage oder einem Raum ausblendet – offen, gekippt, Rollladen unten; ein geschlossener Rand zwischen Dach und Rahmen, so schaut man von schräg vorne nicht mehr in den Raum darunter (#482 danke RkcCorian, #490).
- **Wandansicht:** Die Taste Entf erreicht dort nicht mehr, was im Grundriss dahinter ausgewählt ist.
- **Pool-Warnungen** (Frost, pH, Chlor) lassen nicht mehr alle Räume im Haus pulsieren – sie stehen nur oben als Hinweis.

### So bekommst du das Update

Einstellungen → System → Updates. HACS sucht nur alle paar Stunden nach neuen Versionen, deshalb fehlt ein frisches Update dort manchmal noch. Dann: HACS → NeonPlan 3D → ⋮ → **Informationen aktualisieren** → **Herunterladen**. Home Assistant neu starten und die Seite neu laden (Strg+F5).
