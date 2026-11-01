import { useState } from 'react'
import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  ScaleControl,
  TileLayer,
  WMSTileLayer,
  ZoomControl,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function PointerTracker({ onPointer, onZoom }) {
  useMapEvents({
    mousemove(event) {
      onPointer({ latitude: event.latlng.lat, longitude: event.latlng.lng })
    },
    zoomend(event) {
      onZoom(event.target.getZoom())
    },
  })
  return null
}

function markerIcon(unit, color, selected) {
  const safe = String(unit.callsign || unit.id || 'UNIT')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return L.divIcon({
    className: 'force-marker',
    iconSize: [92, 28],
    iconAnchor: [46, 14],
    html: `<div style="height:28px;display:flex;align-items:center;justify-content:center;border-radius:6px;background:${color};color:#fff;font:600 12px Roboto,Segoe UI,sans-serif;box-shadow:${selected ? '0 0 0 3px #d4b15a' : '0 1px 4px rgba(0,0,0,.45)'};">${safe}</div>`,
  })
}

function GisLayer({ layer }) {
  if (!layer?.url) return null
  if (layer.type === 'xyz') {
    return <TileLayer attribution={layer.attribution || ''} url={layer.url} />
  }
  return (
    <WMSTileLayer
      url={layer.url}
      attribution={layer.attribution || ''}
      params={{
        layers: layer.layers || '',
        format: layer.format || 'image/png',
        transparent: Boolean(layer.transparent),
        version: layer.version || '1.1.1',
      }}
    />
  )
}

export default function SituationMap({ mapConfig, units, selectedId, onSelect, onPointer, onZoom }) {
  const view = mapConfig?.view || {}
  const gis = mapConfig?.gis || {}
  const base = gis.base
  const overlays = gis.overlays || []
  const center = [Number(view.latitude) || 0, Number(view.longitude) || 0]
  const zoom = Number(view.zoom) || 6

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={Number(view.minZoom) || 1}
      maxZoom={Number(view.maxZoom) || 18}
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <ZoomControl position="bottomright" />
      <ScaleControl position="bottomleft" imperial={false} />
      <PointerTracker onPointer={onPointer} onZoom={onZoom} />
      <LayersControl position="topright">
        {base?.url ? (
          <LayersControl.BaseLayer checked name={base.name || 'Base map'}>
            <GisLayer layer={base} />
          </LayersControl.BaseLayer>
        ) : null}
        {overlays.filter((layer) => layer?.url).map((layer) => (
          <LayersControl.Overlay
            key={layer.id || layer.name}
            checked={layer.visible !== false}
            name={layer.name || layer.layers || 'Overlay'}
          >
            <GisLayer layer={layer} />
          </LayersControl.Overlay>
        ))}
      </LayersControl>
      {(units || []).map((unit) => {
        const latitude = Number(unit.latitude)
        const longitude = Number(unit.longitude)
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
        const color = mapConfig?.sides?.[unit.side] || mapConfig?.sides?.neutral || '#c2b280'
        return (
          <Marker
            key={unit.id}
            position={[latitude, longitude]}
            icon={markerIcon(unit, color, unit.id === selectedId)}
            eventHandlers={{ click: () => onSelect(unit.id) }}
          >
            <Popup>
              <strong>{unit.callsign}</strong>
              <br />
              {unit.name}
              <br />
              {latitude.toFixed(5)}, {longitude.toFixed(5)}
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
