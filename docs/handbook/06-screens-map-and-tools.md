# 6. Screens, map, and tools

## Chrome pieces

`TopBar` shows the wordmark, scenario, game, `StatusBadge`, the game-state chip, the clock, and `UserMenu`. Layout-2 passes `floating` so the bar sits on a paper card over the map. Layout-4 passes the phase switch as `trailing` on a wide screen, and repeats it under the bar on a phone.

`StatusBadge` shows Live, Offline, or Replay when `flags.statusBadge` is on. Replay wins over Live. Demo shows when the flag `demoMode` is on, or, before the directory loads, when `session.demoMode` is true.

`IconRail` is a vertical nav. Collapsed width 56, expanded 220. Groups scroll. `IconStrip` is the same data in a row and calls `onSelect(id, event)`. Layout-1’s phone drawer uses the rail. Layout-2’s phone uses the strip. Layout-3 uses the strip only. Layout-4 uses the rail on the right (`edge="end"`).

`ToolPanel` is the frame: title from the panel id, close button, `PanelBody`. Width 300 on a wide screen. On a phone the shell puts it in a bottom drawer.

`ConfirmDialog` is the shared yes/no. Scenario and game confirmation use their own dialog in `ScenarioContext.jsx` because that flow must keep the old value selected until confirm.

## Picture workspace

| Variant | Used by | Behaviour |
| --- | --- | --- |
| `dock` | layout-1 | Feature table under the map when the flag is on and the screen is at least `sm`. |
| `overlay` | layout-2 | Map readout floats. A button toggles Picture and Board. The workspace itself is in normal flow (`flex: 1`) so the phone column still has a height. |
| `plain` | layout-3 | No extra chrome. Open Planning from the strip. |
| `phase` | layout-4 | Plan forces the board. Conduct shows the alert strip. Review docks the table. |

`setSurface` also sets the tool back to select and clears the measure text. Do not call it on every render. Layout-4’s effect depends on `variant` and `phaseId` only.

## Map stage

`MapStage` reads filters from the session and opacity from the directory. When the basemap source is `osm`, base filters are hidden and `MapWorkbench` inserts an OSM tile layer at index 0. When the source is `wms`, `serviceUrl` is the directory GeoServer address, or the session default.

`readout="bar"` is a 32px strip under the map. `readout="overlay"` is a small paper at the bottom left. Both show latitude, longitude, EPSG:3857, and zoom.

Changing the GeoServer URL changes `serviceUrl`, which recreates the map. That is intentional.

## Situation map

`SituationMap` creates one OpenLayers `Map` in an effect. It is not a React wrapper. The div is `position: absolute; inset: 0` inside a `position: relative` parent. If that parent’s height is 0, the map is invisible. Layout-2 used to hit that when the workspace was taken out of flow. Keep the parent a flex child with `minHeight: 0` and `flex: 1`.

Tiles are `TileWMS`, version 1.1.1, `serverType: 'geoserver'`, tiled. No `crossOrigin`. Visibility and opacity update in a second effect so the map is not rebuilt when a slider moves.

`onMap(map)` runs after create, and `onMap(null)` on cleanup. `MapWorkbench` waits until `map` is set.

Home animation listens to `resetToken` from the session store. The first run is skipped so login does not animate.

`ResizeObserver` calls `map.updateSize()` so a opening panel does not leave a grey strip.

## Workbench

`MapWorkbench` renders nothing. It adds and removes layers and interactions.

Dependencies that rebuild the vector layer: `revision`, `surface`, `tool`, `curved`, `stampId`, `symbolId`, `userId`, `graphicQuery`. `revision` changes only when the snapshot’s JSON changes.

On the picture it draws features. Units are hidden when team markers are off. Replay positions and scenario markers are extra points. Scenario markers respect the playback flag.

On the board it draws graphics the person owns, or graphics shared with them when `planView` is `shared`. Layer and phase text filters are substrings.

Draw end:

- Measure sets `measure` and does not open the name dialog.
- Anything else sets `pending`. `DraftDialog` asks for a name and a team, then `createFeature` or `createGraphic`. An empty name is rejected by the API with “Enter a name.”

Edit uses `Modify`. The listener is `modify.on('modifyend')`. It is not `map.on('modifyend')`. That event does not exist on the map.

Select uses OpenLayers `Select` with the click condition and opens the entity dialog.

Saved views: `moveend` waits 500 ms and calls `saveMapView` when map settings are on. A ref applies a saved centre once, so the save does not fight the camera.

## Panels

`PanelBody` switches on the panel id. If the directory has not loaded and the panel has a flag, it shows “Opening the directory”. If the flag is off, “This capability is switched off.”

| Panel id | Component | Notes |
| --- | --- | --- |
| filters | `FilterList` | On/off plus opacity slider 0.15–1, step 0.05, committed |
| resources | records from the session | Role-filtered |
| plans | records from the session | Role-filtered |
| exercise-control | `ExerciseControls` | APEX |
| features | `FeatureTable` | Also exported for the dock |
| properties | selected feature, remove | Remove asks `ConfirmDialog` |
| draw | select, unit, route, zone, edit, distance, area, curve, extend | Extend is disabled until something is selected |
| teams | colour legend | |
| map-settings | basemap, URL, layer, zoom, reset views | Apply sends `updateBasemap` |
| planning | board toggle, shapes, stamps, symbols, undo, export, share, comment, promote | |
| alerts | list and mute | |
| sessions | record, name, save, discard, load, scrub, step | |
| scenario-play | play, pause, seek, reset | Slider commits |
| simulation | cadence, time/event, playback, scrub | Scrub also calls `session.seek` |
| stream | address, topic, connect | |
| zones / routes | catalogue edit and delete | |
| directory | users, teams, roles | |
| flags | on/off rows | Not an MUI `Switch`. Those inputs are invisible to automation and easy to miss. |

MUI `Select` accessible name is often the selected value (“Northern Approach”), not the label “Scenario”. When you look for the control in the browser, search the value.

## Theme rules that have already bitten this app

`createAppTheme` must not set `color` on typography variants. MUI then paints text the wrong colour on dark paper.

`MuiIconButton` style overrides must not force `color`. A selected rail icon has to use the primary colour.

`Typography` `display="block"` is the HTML attribute, not CSS. For a block caption use `sx={{ display: 'block' }}`.

`ListItemText` in MUI 9 takes `slotProps`, not `primaryTypographyProps`.

Primary colours that pass contrast:

| Theme | Main | Contrast text |
| --- | --- | --- |
| Field | `#3caf72` | `#062116` |
| Night watch | `#8eb7e0` | `#0c1218` |
| Sand | `#5a4616` | `#fffdf8` |

## Drawing a unit, the short version

1. Open Draw and measure.
2. Press Unit.
3. Click the map.
4. The draft dialog opens. Enter a name. Team may be None.
5. Keep. The feature appears in the table and on the map.
6. Cancel discards the geometry. Nothing is stored.

Routes and zones are the same with a line or a ring. Planning shapes work after “Show the planning board” or, on layout-2, the Board button, or, on layout-4, the Plan phase.
