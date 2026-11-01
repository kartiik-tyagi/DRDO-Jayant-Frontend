import { useEffect, useRef, useState } from 'react'
import { Box, Checkbox, FormControlLabel, Paper, Typography } from '@mui/material'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import TileWMS from 'ol/source/TileWMS'
import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { fromLonLat, toLonLat } from 'ol/proj'
import { Fill, Stroke, Style, Text } from 'ol/style'
import ScaleLine from 'ol/control/ScaleLine'
import Zoom from 'ol/control/Zoom'
import 'ol/ol.css'

function createTileLayer(layer) {
  if (!layer?.url) return null
  const title = layer.name || layer.layers || 'Layer'
  if (layer.type === 'xyz') {
    return new TileLayer({
      properties: { title },
      source: new XYZ({
        url: layer.url,
        attributions: layer.attribution || '',
      }),
    })
  }
  return new TileLayer({
    properties: { title },
    source: new TileWMS({
      url: layer.url,
      attributions: layer.attribution || '',
      serverType: 'geoserver',
      transition: 0,
      params: {
        LAYERS: layer.layers || '',
        FORMAT: layer.format || 'image/png',
        TRANSPARENT: Boolean(layer.transparent),
        VERSION: layer.version || '1.1.1',
        TILED: true,
      },
    }),
  })
}

function unitStyle(unit, color, selected) {
  return new Style({
    text: new Text({
      text: String(unit.callsign || unit.id || 'UNIT'),
      font: '600 12px Roboto, "Segoe UI", sans-serif',
      fill: new Fill({ color: '#fff' }),
      backgroundFill: new Fill({ color }),
      backgroundStroke: new Stroke({
        color: selected ? '#d4b15a' : 'rgba(0,0,0,0.45)',
        width: selected ? 3 : 1,
      }),
      padding: [5, 8, 5, 8],
    }),
  })
}

function syncUnits(source, units, selectedId, sides) {
  source.clear()
  for (const unit of units || []) {
    const latitude = Number(unit.latitude)
    const longitude = Number(unit.longitude)
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue
    const color = sides?.[unit.side] || sides?.neutral || '#c2b280'
    const feature = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
      unitId: unit.id,
    })
    feature.setStyle(unitStyle(unit, color, unit.id === selectedId))
    source.addFeature(feature)
  }
}

function overlayKey(layer) {
  return layer.id || layer.name || layer.layers
}

export default function SituationMap({ mapConfig, units, selectedId, onSelect, onPointer, onZoom }) {
  const targetRef = useRef(null)
  const mapRef = useRef(null)
  const sourceRef = useRef(null)
  const tileLayersRef = useRef([])
  const onSelectRef = useRef(onSelect)
  const onPointerRef = useRef(onPointer)
  const onZoomRef = useRef(onZoom)
  const gis = mapConfig?.gis || {}
  const overlays = (gis.overlays || []).filter((layer) => layer?.url)
  const [overlayVisible, setOverlayVisible] = useState(() =>
    Object.fromEntries(overlays.map((layer) => [overlayKey(layer), layer.visible !== false])),
  )

  useEffect(() => {
    onSelectRef.current = onSelect
    onPointerRef.current = onPointer
    onZoomRef.current = onZoom
  })

  const overlayVisibleRef = useRef(overlayVisible)
  overlayVisibleRef.current = overlayVisible

  useEffect(() => {
    const view = mapConfig?.view || {}
    const source = new VectorSource()
    sourceRef.current = source
    const map = new Map({
      target: targetRef.current,
      layers: [new VectorLayer({ source })],
      controls: [new Zoom(), new ScaleLine({ units: 'metric' })],
      view: new View({
        center: fromLonLat([Number(view.longitude) || 0, Number(view.latitude) || 0]),
        zoom: Number(view.zoom) || 6,
        minZoom: Number(view.minZoom) || 1,
        maxZoom: Number(view.maxZoom) || 18,
      }),
    })
    mapRef.current = map

    const gisConfig = mapConfig?.gis || {}
    const created = []
    let index = 0
    const baseLayer = createTileLayer(gisConfig.base)
    if (baseLayer) {
      map.getLayers().insertAt(index, baseLayer)
      index += 1
      created.push(baseLayer)
    }
    for (const overlay of gisConfig.overlays || []) {
      const layer = createTileLayer(overlay)
      if (!layer) continue
      const key = overlayKey(overlay)
      layer.set('overlayId', key)
      layer.setVisible(overlayVisibleRef.current[key] !== false)
      map.getLayers().insertAt(index, layer)
      index += 1
      created.push(layer)
    }
    tileLayersRef.current = created

    map.on('pointermove', (event) => {
      if (event.dragging) return
      const [longitude, latitude] = toLonLat(event.coordinate)
      onPointerRef.current?.({ latitude, longitude })
      const hit = map.hasFeatureAtPixel(event.pixel, { hitTolerance: 8 })
      const element = map.getTargetElement()
      if (element) element.style.cursor = hit ? 'pointer' : ''
    })

    map.on('singleclick', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (item) => item, { hitTolerance: 8 })
      const unitId = feature?.get('unitId')
      if (unitId) onSelectRef.current?.(unitId)
    })

    const publishZoom = () => {
      const zoom = map.getView().getZoom()
      if (zoom != null) onZoomRef.current?.(Math.round(zoom))
    }
    map.getView().on('change:resolution', publishZoom)
    publishZoom()

    return () => {
      map.setTarget(null)
      mapRef.current = null
      sourceRef.current = null
      tileLayersRef.current = []
    }
  }, [mapConfig])

  useEffect(() => {
    for (const layer of tileLayersRef.current) {
      const key = layer.get('overlayId')
      if (!key || !(key in overlayVisible)) continue
      layer.setVisible(Boolean(overlayVisible[key]))
    }
  }, [overlayVisible])

  useEffect(() => {
    const source = sourceRef.current
    if (!source) return
    syncUnits(source, units, selectedId, mapConfig?.sides)
  }, [units, selectedId, mapConfig])

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <Box
        ref={targetRef}
        className="situation-map"
        role="application"
        aria-label="Situation map"
        sx={{ position: 'absolute', inset: 0 }}
      />
      <Paper sx={{ position: 'absolute', zIndex: 2, top: 12, right: 12, p: 1.5, maxWidth: 260 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Base map
        </Typography>
        <Typography variant="body2">{gis.base?.name || 'Base map'}</Typography>
        {overlays.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Overlays
            </Typography>
            {overlays.map((layer) => {
              const key = overlayKey(layer)
              return (
                <FormControlLabel
                  key={key}
                  sx={{ display: 'flex', mr: 0 }}
                  control={
                    <Checkbox
                      size="small"
                      checked={overlayVisible[key] !== false}
                      onChange={() =>
                        setOverlayVisible((current) => ({
                          ...current,
                          [key]: current[key] === false,
                        }))
                      }
                    />
                  }
                  label={layer.name || layer.layers || 'Overlay'}
                />
              )
            })}
          </Box>
        )}
      </Paper>
    </Box>
  )
}
