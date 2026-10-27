**NeonPlan 3D 1.20.0: talk to your house.** A microphone button in the 3D view: say "Show the living room" and NeonPlan goes there. A wall tablet that flies to the front door by itself when the doorbell rings. Gardens and terraces that open like rooms, and light that falls down the stairwell.

### New

- **🎙️ Voice control – new, free for everyone:** a microphone button at the bottom left of the 3D view. Tap it and speak:
  - "Show the living room", "upper floor", "the whole house" or just "kitchen" opens the place.
  - "Show the washing machine" or "Where is the floor lamp?" flies to the device and makes it flash.
  - "Show the front door camera" looks through the camera, and "Show the cameras" opens the camera wall (with the Camera Cockpit).
  - Anything else ("turn on the hall light", "how warm is it outside?") goes to Home Assistant's **Assist**, and its answer shows as a speech bubble.

  NeonPlan knows the names of your rooms, floors and devices by itself, so nothing has to be taught. Speech to text is done by your own Assist pipeline (Home Assistant Cloud, Whisper or Speech-to-Phrase). The microphone is only open while you speak, which spares old tablets. It is off by default; switch it on per device (editor → **🎙️ Voice control**) or in the dashboard card (`voice: true`). It needs https and the microphone allowed (Fully Kiosk: Web Content Settings → microphone access). **Test the microphone** checks a device step by step. *Voice control is new and still in development – it is released for everyone and already works well, and it will keep growing. If a sentence is not understood the way you mean it, tell us the sentence on Discord or in an issue.* Manual: section 5.10.
- **🎬 Live director (Camera Cockpit):** your wall tablet shows by itself what happens in the house. When the doorbell rings, the view flies to the front door and looks through the camera there. It also flies to where a camera sees someone, to a washer that has finished, or to a new warning, and goes back afterwards. Every event is its own switch and all are off until you switch them on (editor → **🎬 Live director**). You also choose the screen: this device, or the card option `director: true`. Someone using the tablet is only interrupted by the doorbell and by warnings. Free for everyone who has the Camera Cockpit.
- **Outdoor areas like rooms (#100, #59):** give a lawn, terrace, balcony or pool a name and a Home Assistant area. It then appears in the room bar, opens on a tap in 3D with its area's lights, sockets and sensors, and shows its outdoor temperature under "Values". In the editor its devices are listed to place on the area. Thanks @rolandarends and @denisb88!
- **Light between floors (#570):** a lamp over a stairwell or floor opening, or close to it, also lights the floor below through the opening, in its colour and a little weaker. Thanks @PetrMa!
- **Pets walk around furniture:** the cats and dogs of the fun pack find their way round sofas, tables and cupboards instead of walking through them, and hop onto their place on the sofa or bed. Idea from Thundras' fork.

### Fixed

- **Furniture library:** with the 3D view beside the plan, an item's preview picture showed beside or below the library instead of next to the item.
- **Manual (FAQ):** NeonPlan closing on a two-finger move on iPhone or iPad is the Home Assistant app's own gesture. Set it to "None" in the app's settings (#571).

### How to update

Settings → System → Updates. HACS only looks for new versions every few hours, so a fresh update may not show there yet. Then: HACS → NeonPlan 3D → ⋮ → **Update information** → **Download**. Restart Home Assistant and reload the page (Ctrl+F5).

---

**NeonPlan 3D 1.20.0: Sprich mit deinem Haus.** Ein Mikrofon-Knopf in der 3D-Ansicht: Sag „Zeig das Wohnzimmer“, und NeonPlan geht hin. Ein Wandtablet, das von selbst zur Haustür fliegt, wenn es klingelt. Gärten und Terrassen, die sich wie Räume öffnen, und Licht, das ins Treppenhaus fällt.

### Neu

- **🎙️ Sprachsteuerung – neu, für alle kostenlos:** ein Mikrofon-Knopf unten links in der 3D-Ansicht. Antippen und sprechen:
  - „Zeig das Wohnzimmer“, „Obergeschoss“, „das ganze Haus“ oder einfach „Küche“ öffnet den Ort.
  - „Zeig die Waschmaschine“ oder „Wo ist die Stehlampe?“ fliegt zum Gerät und lässt es aufblinken.
  - „Zeig die Kamera Haustür“ schaut durch die Kamera, und „Zeig die Kameras“ öffnet die Kamera-Wand (mit dem Kamera-Cockpit).
  - Alles andere („Licht im Flur an“, „Wie warm ist es draußen?“) geht an **Assist** von Home Assistant, und die Antwort erscheint als Sprechblase.

  Die Namen deiner Räume, Etagen und Geräte kennt NeonPlan von selbst, beibringen musst du nichts. Die Spracherkennung macht deine eigene Assist-Pipeline (Home Assistant Cloud, Whisper oder Speech-to-Phrase). Das Mikrofon ist nur offen, solange du sprichst, das schont alte Tablets. Standardmäßig ist die Sprachsteuerung aus. Du schaltest sie pro Gerät ein (Editor → **🎙️ Sprachsteuerung**) oder in der Dashboard-Karte (`voice: true`). Sie braucht https und die Mikrofon-Freigabe (Fully Kiosk: Web Content Settings → Mikrofonzugriff). **Mikrofon testen** prüft ein Gerät Schritt für Schritt. *Die Sprachsteuerung ist neu und noch in Entwicklung. Sie ist für alle freigegeben, funktioniert schon gut und wird weiter ausgebaut. Wird ein Satz nicht so verstanden, wie du ihn meinst, schreib uns den Satz in den Discord oder in ein Issue.* Anleitung: Abschnitt 5.10.
- **🎬 Live-Regie (Kamera-Cockpit):** Dein Wandtablet zeigt von selbst, was im Haus passiert. Klingelt es, fliegt die Ansicht zur Haustür und schaut durch die Kamera dort. Sie fliegt auch dorthin, wo eine Kamera jemanden sieht, zu einer fertigen Waschmaschine oder zu einer neuen Warnung, und kehrt danach zurück. Jedes Ereignis hat einen eigenen Schalter, und alle sind aus, bis du sie einschaltest (Editor → **🎬 Live-Regie**). Den Bildschirm wählst du auch: dieses Gerät oder die Karten-Option `director: true`. Wer das Tablet gerade bedient, wird nur von der Klingel und von Warnungen unterbrochen. Kostenlos für alle mit dem Kamera-Cockpit.
- **Außenflächen wie Räume (#100, #59):** Gib einem Rasen, einer Terrasse, einem Balkon oder Pool einen Namen und einen Home-Assistant-Bereich. Dann steht die Fläche in der Raumleiste, öffnet sich per Tipp in 3D mit den Lichtern, Steckdosen und Sensoren ihres Bereichs und zeigt unter „Werte“ ihre Außentemperatur. Im Editor stehen ihre Geräte zum Platzieren bereit. Danke an @rolandarends und @denisb88!
- **Licht zwischen den Etagen (#570):** Eine Lampe über einem Treppenloch oder einer Deckenöffnung, oder nah daran, beleuchtet durch die Öffnung auch die Etage darunter, in ihrer Farbe und etwas schwächer. Danke an @PetrMa!
- **Haustiere laufen um Möbel herum:** Die Katzen und Hunde aus dem Fun-Pack finden ihren Weg um Sofa, Tisch und Schrank, statt hindurchzulaufen, und springen auf ihren Platz auf dem Sofa oder Bett. Die Idee stammt aus dem Fork von Thundras.

### Behoben

- **Möbel-Bibliothek:** Stand die 3D-Ansicht neben dem Plan, erschien das Vorschaubild eines Möbelstücks neben oder unter der Bibliothek statt neben dem Möbelstück.
- **Anleitung (FAQ):** Dass sich NeonPlan auf iPhone oder iPad bei einer Zwei-Finger-Bewegung schließt, ist eine Geste der Home-Assistant-App. In den App-Einstellungen auf „Keine“ stellen (#571).

### So bekommst du das Update

Einstellungen → System → Updates. HACS sucht nur alle paar Stunden nach neuen Versionen, deshalb fehlt ein frisches Update dort manchmal noch. Dann: HACS → NeonPlan 3D → ⋮ → **Informationen aktualisieren** → **Herunterladen**. Home Assistant neu starten und die Seite neu laden (Strg+F5).
