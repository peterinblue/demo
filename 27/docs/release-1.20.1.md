**NeonPlan 3D 1.20.1** is a fix-up: old wall tablets show the house again, waste bins show the right day, and supporters see their beta add-ons properly.

### Fixed

- **Old wall tablets show the house again:** on older WebViews (Fire 7 and others before Chrome 108) the NeonPlan page lost its height since 1.18.2 – only the header was left and the 3D view stayed empty. Fixed, and the build now refuses the newer browser functions those tablets lack. Thanks to @diegood, whose CasaNeon fork found it!
- **Bins emptied every two or four weeks (#585):** a bin whose next pickup was more than 10 days away showed nothing. NeonPlan now reads the waste calendar six weeks ahead. Thanks @sir-captain-awesome!
- **Wrong number of days from a sensor:** a sensor whose text holds another number ("Restabfalltonne 2-wöchentlich in 4 Tagen") showed that number instead of the days. Thanks @LortusX!
- **Pickup day one day early:** across the change to winter time the day shown on a tap on the bin was one day early.
- **Supporters and beta add-ons (#583):** a Supporter-Pass holder whose key does not have a beta add-on yet saw "Become a supporter". Now it says the beta is theirs, and a beta pack waiting on the key says to install it. Thanks @twynne!

### How to update

Settings → System → Updates. HACS only looks for new versions every few hours, so a fresh update may not show there yet. Then: HACS → NeonPlan 3D → ⋮ → **Update information** → **Download**. Restart Home Assistant and reload the page (Ctrl+F5).

---

**NeonPlan 3D 1.20.1** ist ein Nachbesserungs-Update: Alte Wandtablets zeigen das Haus wieder, Mülltonnen den richtigen Tag, und Supporter sehen ihre Beta-Erweiterungen richtig.

### Behoben

- **Alte Wandtablets zeigen das Haus wieder:** Auf älteren WebViews (Fire 7 und andere vor Chrome 108) verlor die NeonPlan-Seite seit 1.18.2 ihre Höhe – nur die Kopfzeile blieb, die 3D-Ansicht war leer. Behoben, und der Build lässt die neueren Browser-Funktionen, die diese Tablets nicht kennen, gar nicht mehr durch. Danke an @diegood, dessen Fork CasaNeon das gefunden hat!
- **Tonnen, die alle zwei oder vier Wochen kommen (#585):** Lag die nächste Abholung mehr als 10 Tage entfernt, zeigte die Tonne nichts. NeonPlan liest den Müllkalender jetzt sechs Wochen voraus. Danke an @sir-captain-awesome!
- **Falsche Tageszahl von einem Sensor:** Stand im Text eines Sensors noch eine andere Zahl („Restabfalltonne 2-wöchentlich in 4 Tagen“), zeigte die Tonne diese Zahl statt der Tage. Danke an @LortusX!
- **Abholtag einen Tag zu früh:** Über die Umstellung auf Winterzeit hinweg zeigte ein Tipp auf die Tonne den Vortag.
- **Supporter und Beta-Erweiterungen (#583):** Wer den Supporter-Pass hat, auf dessen Schlüssel eine Beta-Erweiterung aber noch fehlt, sah „Supporter werden“. Jetzt steht dort, dass die Beta ihm zusteht. Liegt das Pack schon auf dem Schlüssel, steht dort, dass es zum Installieren bereitliegt. Danke an @twynne!

### So bekommst du das Update

Einstellungen → System → Updates. HACS sucht nur alle paar Stunden nach neuen Versionen, deshalb fehlt ein frisches Update dort manchmal noch. Dann: HACS → NeonPlan 3D → ⋮ → **Informationen aktualisieren** → **Herunterladen**. Home Assistant neu starten und die Seite neu laden (Strg+F5).
