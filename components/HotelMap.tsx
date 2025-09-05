'use client'

import { useEffect, useRef } from 'react'
import maplibregl, { Map } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const HOTEL_COORDS: [number, number] = [13.52853, 45.49736]
const BEACH_COORDS: [number, number] = [13.5276845, 45.5001984]
const MAX_INITIAL_ZOOM = 15

export default function HotelMap() {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<Map | null>(null)
  const routeGeometryRef = useRef<GeoJSON.LineString | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const styleUrl = `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: styleUrl,
      center: [
        ...HOTEL_COORDS
      ],
      zoom: MAX_INITIAL_ZOOM,
      dragPan: true,
      dragRotate: false,
      touchZoomRotate: true,
      scrollZoom: true,
      boxZoom: false,
      keyboard: true,
    })

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')

    const addLabeledMarker = (
      coords: [number, number],
      label: string,
      options?: { popupText?: string; anchor?: maplibregl.TextAnchor; color?: string },
    ) => {
      const wrapper = document.createElement('div')
      wrapper.style.display = 'inline-flex'
      wrapper.style.alignItems = 'center'
      wrapper.style.gap = '8px'
      wrapper.style.pointerEvents = 'auto'

      const pin = document.createElement('div')
      pin.style.width = '12px'
      pin.style.height = '12px'
      pin.style.borderRadius = '999px'
      pin.style.boxShadow = '0 0 0 2px #fff, 0 2px 6px rgba(0,0,0,0.25)'
      pin.style.background = options?.color ?? '#ef4444'
      wrapper.appendChild(pin)

      const bubble = document.createElement('span')
      bubble.textContent = label
      bubble.style.fontSize = '12px'
      bubble.style.lineHeight = '1'
      bubble.style.fontWeight = '600'
      bubble.style.padding = '6px 8px'
      bubble.style.borderRadius = '8px'
      bubble.style.background = 'rgba(255,255,255,0.9)'
      bubble.style.backdropFilter = 'saturate(1.2) blur(2px)'
      bubble.style.border = '1px solid rgba(0,0,0,0.05)'
      bubble.style.boxShadow = '0 1px 2px rgba(0,0,0,0.12)'
      bubble.style.whiteSpace = 'nowrap'
      wrapper.appendChild(bubble)

      const marker = new maplibregl.Marker({ element: wrapper, anchor: options?.anchor ?? 'left' })
        .setLngLat(coords)

      if (options?.popupText) {
        const popup = new maplibregl.Popup({ offset: 12 }).setText(options.popupText)
        marker.setPopup(popup)
      }

      marker.addTo(map)
      return marker
    }

    addLabeledMarker(HOTEL_COORDS, 'Hotel Kempinski Adriatic', {
      popupText: 'Hotel Kempinski Adriatic',
      anchor: 'left',
      color: '#10b981',
    })
    addLabeledMarker(BEACH_COORDS, 'Hotelska Plaža', {
      popupText: 'Hotelska Plaža',
      anchor: 'left',
      color: '#3b82f6',
    })

    const fitNicely = () => {
      const b = new maplibregl.LngLatBounds()
      const geom = routeGeometryRef.current
      if (geom && geom.type === 'LineString' && geom.coordinates.length) {
        geom.coordinates.forEach((c) => b.extend(c as [number, number]))
      } else {
        b.extend(HOTEL_COORDS).extend(BEACH_COORDS)
      }
      map.fitBounds(b, {
        padding: { top: 100, bottom: 60, left: 60, right: 60 },
        duration: 500,
        maxZoom: MAX_INITIAL_ZOOM,
      })
    }

    map.on('load', async () => {
      if (!map.getSource('route')) {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: [] },
            properties: {},
          },
        })
      }

      if (!map.getLayer('route-line')) {
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: {
            'line-color': '#2563eb',
            'line-width': 5,
            'line-opacity': 0.9,
          },
        })
      }

      const fetchRoute = async (
        from: [number, number],
        to: [number, number],
        profile: 'driving' | 'foot' | 'bike' = 'driving',
      ) => {
        const coords = `${from[0]},${from[1]};${to[0]},${to[1]}`
        const url = `https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=full&geometries=geojson`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Routing failed: ${res.status}`)
        const data = await res.json()
        const route = data?.routes?.[0]
        if (!route?.geometry) throw new Error('No route found')
        return route as {
          geometry: GeoJSON.LineString
          distance: number
          duration: number
        }
      }

      const drawRoute = (geometry: GeoJSON.LineString) => {
        routeGeometryRef.current = geometry
        const src = map.getSource('route') as maplibregl.GeoJSONSource
        src.setData({ type: 'Feature', geometry, properties: {} } as GeoJSON.Feature)
        fitNicely()
      }

      try {
        const route = await fetchRoute(HOTEL_COORDS, BEACH_COORDS, 'driving') // change to 'foot' if you want a walking path
        drawRoute(route.geometry)
      } catch (e) {
        console.error(e)
        routeGeometryRef.current = null
        fitNicely()
      }

      map.resize()
      requestAnimationFrame(() => map.resize())
    })

    const onWinResize = () => {
      map.resize()
      // re-fit while respecting the max zoom cap
      fitNicely()
    }
    window.addEventListener('resize', onWinResize)

    let dpr = window.devicePixelRatio
    const dprInterval = setInterval(() => {
      if (window.devicePixelRatio !== dpr) {
        dpr = window.devicePixelRatio
        map.resize()
        fitNicely()
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
      className='w-full h-[500px] rounded-2xl overflow-hidden'
      aria-label='Map showing Hotel Kempinski Adriatic and route to the beach'
      style={{ touchAction: 'none', pointerEvents: 'auto' }}
    />
  )
}
