import { useEffect, useRef } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS'
import Zoom from 'ol/control/Zoom'
import ScaleLine from 'ol/control/ScaleLine'
import { fromLonLat, toLonLat } from 'ol/proj'
import { Box } from '@mui/material'
import 'ol/ol.css'

function createTileLayer(serviceUrl, filter) {
  if (!serviceUrl || !filter?.layers) return null
  const layer = new TileLayer({
    source: new TileWMS({
      url: serviceUrl,
      params: {
        LAYERS: filter.layers,
        TILED: true,
        VERSION: '1.1.1',
        TRANSPARENT: Boolean(filter.transparent),
      },
      serverType: 'geoserver',
      transition: 0,
    }),
    visible: filter.visible !== false,
  })
  layer.set('filterId', filter.id)
  return layer
}

export default function SituationMap({ view, serviceUrl, layers, resetToken, onPointer, onZoom, onView, onMap, focusKey = null, showControls = true, label = 'Situation map' }) {
  const targetRef = useRef(null)
  const mapRef = useRef(null)
  const viewRef = useRef(view)
  const layersRef = useRef(layers)
  const onPointerRef = useRef(onPointer)
  const onZoomRef = useRef(onZoom)
  const onViewRef = useRef(onView)
  const onMapRef = useRef(onMap)
  const skipReset = useRef(true)
  viewRef.current = view
  layersRef.current = layers
  const layerKey = (layers || []).map((layer) => layer.id).join('|')
  const visibilityKey = (layers || []).map((layer) => `${layer.id}:${layer.visible ? 1 : 0}:${layer.opacity ?? 1}`).join('|')

  useEffect(() => {
    onPointerRef.current = onPointer
    onZoomRef.current = onZoom
    onViewRef.current = onView
    onMapRef.current = onMap
  })

  useEffect(() => {
    const home = viewRef.current || {}
    const items = [...(layersRef.current || [])].sort((left, right) => Number(right.base) - Number(left.base))
    const map = new Map({
      target: targetRef.current,
      layers: [],
      controls: showControls ? [new Zoom(), new ScaleLine({ units: 'metric' })] : [],
      view: new View({
        center: fromLonLat([Number(home.longitude) || 0, Number(home.latitude) || 0]),
        zoom: Number(home.zoom) || 5,
        minZoom: Number(home.minZoom) || 1,
        maxZoom: Number(home.maxZoom) || 18,
      }),
    })
    mapRef.current = map
    onMapRef.current?.(map)
    for (const filter of items) {
      const layer = createTileLayer(serviceUrl, filter)
      if (layer) map.addLayer(layer)
    }

    map.on('pointermove', (event) => {
      if (event.dragging) return
      const [longitude, latitude] = toLonLat(event.coordinate)
      onPointerRef.current?.({ latitude, longitude })
    })

    const publishZoom = () => {
      const mapView = map.getView()
      const zoom = mapView.getZoom()
      const rounded = zoom == null ? null : Math.round(zoom * 10) / 10
      onViewRef.current?.({ zoom: rounded, resolution: mapView.getResolution() ?? null })
      if (rounded != null) onZoomRef.current?.(rounded)
    }
    map.getView().on('change:resolution', publishZoom)
    publishZoom()

    const observer = new ResizeObserver(() => map.updateSize())
    if (targetRef.current) observer.observe(targetRef.current)

    return () => {
      observer.disconnect()
      onMapRef.current?.(null)
      map.setTarget(null)
      mapRef.current = null
    }
  }, [serviceUrl, layerKey, showControls])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const current = layersRef.current || []
    map.getLayers().forEach((layer) => {
      const id = layer.get('filterId')
      if (!id) return
      const match = current.find((item) => item.id === id)
      if (match) {
        layer.setVisible(Boolean(match.visible))
        layer.setOpacity(match.opacity ?? 1)
      }
    })
  }, [visibilityKey])

  useEffect(() => {
    if (skipReset.current) {
      skipReset.current = false
      return
    }
    const map = mapRef.current
    const home = viewRef.current
    if (!map || !home) return
    map.getView().animate({
      center: fromLonLat([Number(home.longitude) || 0, Number(home.latitude) || 0]),
      zoom: Number(home.zoom) || 5,
      duration: 350,
    })
  }, [resetToken])

  const focusSeen = useRef(focusKey)
  useEffect(() => {
    if (focusKey == null) return
    if (focusSeen.current === focusKey) return
    focusSeen.current = focusKey
    const map = mapRef.current
    const home = viewRef.current
    if (!map || !home) return
    map.getView().animate({
      center: fromLonLat([Number(home.longitude) || 0, Number(home.latitude) || 0]),
      zoom: Number(home.zoom) || 5,
      duration: 350,
    })
  }, [focusKey])

  return (
    <Box
      ref={targetRef}
      className="situation-map"
      role="application"
      aria-label={label}
      sx={{ position: 'absolute', inset: 0, bgcolor: 'background.default' }}
    />
  )
}
