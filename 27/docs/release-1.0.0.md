## NeonPlan 3D 1.0 – the first public release

Draw your home right inside Home Assistant and control it in a neon 3D view. No external tools, no cloud, made for wall tablets.

![The house in the neon 3D view](https://raw.githubusercontent.com/Mastershort/neonplan3d/main/docs/images/view-house.jpg)

### Highlights

- **Plan editor in Home Assistant** – floors, rooms, automatic walls, doors, windows and garage doors with sensors, stairs and floor openings, outdoor areas, roof, a floor plan image as template, and the 3D view next to the plan while you draw.
- **Live 3D view** – tap to switch, swipe to dim or move blinds, long press for colours and positions; lamps light their rooms in their colours, windows tilt and open, doors swing, TVs and appliances glow while they run.
- **40 built-in furniture models and lamps**, room packages that furnish a room in one go, parking spots with vehicles, a robot vacuum that drives its lanes.
- **Cameras** on walls and ceilings with their field of view on the floor, red on motion, snapshots with a tap.
- **Wall tablet ready** – warnings (smoke, gas, CO, water, alarm, windows open in the rain), kiosk mode with idle return, night dimming and a screensaver turn, scene buttons, a *Tablet* quality level, zero frames while idle.
- **Dashboard card** with a visual editor, three looks (Neon, Blueprint, Day), heatmap, sunlight through the windows, search, restore points and a full backup.

### Optional extras

Furniture packs and the Pro add-ons *Camera cockpit*, *Weather outside* and *Live screens* are available at [mastershort.de](https://mastershort.de/neonplan3d/) and install from the new **Extensions** tab with a licence key. Everything in this repository stays free and open source.

### Installation

[![Open your Home Assistant instance and open the NeonPlan 3D repository inside HACS.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Mastershort&repository=neonplan3d&category=integration)

HACS → Custom repositories → `https://github.com/Mastershort/neonplan3d` (Integration) → install → restart → add the integration *NeonPlan 3D*.

Requires Home Assistant 2025.1 or newer. Manual (German): [docs/anleitung.md](https://github.com/Mastershort/neonplan3d/blob/main/docs/anleitung.md).
