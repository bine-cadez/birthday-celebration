'use client'

import { useEffect, useRef } from 'react'
import maplibregl, { Map } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const HOTEL_COORDS: [number, number] = [13.52853, 45.49736]
const GOLF_COORDS: [number, number] = [13.5331835, 45.4951623]

export default function HotelMap() {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const styleUrl = `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: styleUrl,
      center: GOLF_COORDS,
      zoom: 12,
      dragPan: true,
      dragRotate: false,
      touchZoomRotate: true,
      scrollZoom: true,
      boxZoom: false,
      keyboard: true,
    })

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')

    const fitBothPoints = () => {
      const bounds = new maplibregl.LngLatBounds()
      bounds.extend(HOTEL_COORDS).extend(GOLF_COORDS)
      map.fitBounds(bounds, {
        padding: { top: 140, bottom: 100, left: 100, right: 100 },
        maxZoom: 15, // slightly zoomed out
        duration: 500,
      })
    }

    const fetchRouteGeoJSON = async (start: [number, number], end: [number, number]) => {
      const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`OSRM error: ${res.status}`)
      const data = await res.json()
      const route = data?.routes?.[0]
      if (!route?.geometry) throw new Error('No route geometry')
      return {
        type: 'Feature',
        properties: {},
        geometry: route.geometry, // LineString
      } as GeoJSON.Feature<GeoJSON.LineString>
    }

    const drawRoute = async () => {
      try {
        const feature = await fetchRouteGeoJSON(HOTEL_COORDS, GOLF_COORDS)
        if (!map.getSource('route')) {
          map.addSource('route', { type: 'geojson', data: feature })
          // casing under the main line
          map.addLayer({
            id: 'route-casing',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#ffffff', 'line-width': 7, 'line-opacity': 0.7 },
          })
          map.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#2563eb', 'line-width': 5, 'line-opacity': 0.95 },
          })
        } else {
          ;(map.getSource('route') as maplibregl.GeoJSONSource).setData(feature)
        }
      } catch (e) {
        console.error(e)
      }
    }

    const addCirclePoints = () => {
      const points = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'Hotel Kempinski Adriatic', kind: 'hotel' },
            geometry: { type: 'Point', coordinates: HOTEL_COORDS },
          },
          {
            type: 'Feature',
            properties: { name: 'Golf Adriatic', kind: 'golf' },
            geometry: { type: 'Point', coordinates: GOLF_COORDS },
          },
        ],
      } as GeoJSON.FeatureCollection

      if (!map.getSource('stops')) {
        map.addSource('stops', { type: 'geojson', data: points })

        map.addLayer({
          id: 'stops-glow',
          type: 'circle',
          source: 'stops',
          paint: {
            'circle-radius': 12,
            'circle-color': [
              'match',
              ['get', 'kind'],
              'hotel', '#ef4444',
              'golf', '#16a34a',
              /* other */ '#2563eb',
            ],
            'circle-opacity': 0.2,
            'circle-blur': 0.6,
          },
        })

        // fill (over)
        map.addLayer({
          id: 'stops-fill',
          type: 'circle',
          source: 'stops',
          paint: {
            'circle-radius': 6,
            'circle-color': [
              'match',
              ['get', 'kind'],
              'hotel', '#ef4444',
              'golf', '#16a34a',
              /* other */ '#2563eb',
            ],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2,
          },
        })

        map.on('mouseenter', 'stops-fill', () => (map.getCanvas().style.cursor = 'pointer'))
        map.on('mouseleave', 'stops-fill', () => (map.getCanvas().style.cursor = ''))
        map.on('click', 'stops-fill', (e: maplibregl.MapLayerMouseEvent) => {
          const f = e.features?.[0]
          if (!f) return
          if (f.geometry.type === 'Point' && Array.isArray((f.geometry as GeoJSON.Point).coordinates)) {
            new maplibregl.Popup({ offset: 10 })
              .setLngLat((f.geometry as GeoJSON.Point).coordinates as [number, number])
              .setText(f.properties?.name || '')
              .addTo(map)
          }
        })
      }
    }

    const ensureLayerOrder = () => {
      if (map.getLayer('stops-glow')) map.moveLayer('stops-glow')
      if (map.getLayer('stops-fill')) map.moveLayer('stops-fill')
    }

    const onWinResize = () => {
      map.resize()
      fitBothPoints()
    }

    map.on('load', async () => {
      map.resize()

      await drawRoute()
      addCirclePoints()
      ensureLayerOrder()

      fitBothPoints()

      requestAnimationFrame(() => {
        map.resize()
        fitBothPoints()
      })
    })

    window.addEventListener('resize', onWinResize)
    let dpr = window.devicePixelRatio
    const dprInterval = setInterval(() => {
      if (window.devicePixelRatio !== dpr) {
        dpr = window.devicePixelRatio
        map.resize()
        fitBothPoints()
      }
    }, 500)

    mapInstance.current = map
    return () => {
      window.removeEventListener('resize', onWinResize)
      clearInterval(dprInterval)
      map.remove()
    }
  }, [])

  return (
    <div
      ref={mapRef}
      className="w-full h-[500px] rounded-2xl overflow-hidden"
      aria-label="Map showing route from Hotel Kempinski Adriatic to Golf Adriatic"
      style={{ touchAction: 'none', pointerEvents: 'auto' }}
    />
  )
}
