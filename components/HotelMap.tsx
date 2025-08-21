'use client'

import { useEffect, useRef } from 'react'
import maplibregl, { Map } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const HOTEL_COORDS: [number, number] = [13.52853, 45.49736] // lon, lat

export default function HotelMap() {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const styleUrl = `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: styleUrl,
      center: HOTEL_COORDS,
      zoom: 14,
      // Make interactions explicit (they're true by default, but this avoids surprises):
      dragPan: true,
      dragRotate: false,
      touchZoomRotate: true,
      scrollZoom: true,
      boxZoom: false,
      keyboard: true,
    })

    // Basic UI
    map.addControl(
      new maplibregl.NavigationControl({ visualizePitch: true }),
      'top-right',
    )

    // Marker + popup
    const popup = new maplibregl.Popup({ offset: 12 }).setText(
      'Hotel Kempinski Adriatic',
    )
    new maplibregl.Marker().setLngLat(HOTEL_COORDS).setPopup(popup).addTo(map)

    // Helper to center with a little upward offset so the marker/popup is nicely visible on mobile
    const recenter = () => {
      // offset: [x, y] in screen pixels. Negative y moves the point up on screen.
      map.easeTo({
        center: HOTEL_COORDS,
        zoom: 15.5,
        offset: [0, -80],
        duration: 500,
      })
    }

    // Ensure the canvas has its final size, then center nicely
    map.on('load', () => {
      map.resize()
      requestAnimationFrame(() => {
        map.resize()
        recenter()
      })
    })

    // Re-center on window resizes / orientation changes
    const onWinResize = () => {
      map.resize()
      recenter()
    }
    window.addEventListener('resize', onWinResize)

    // Some mobile browsers change devicePixelRatio on zoom; keep tiles crisp & center stable
    let dpr = window.devicePixelRatio
    const dprInterval = setInterval(() => {
      if (window.devicePixelRatio !== dpr) {
        dpr = window.devicePixelRatio
        map.resize()
        recenter()
      }
    }, 500)

    // If your map is inside a tab/modal that becomes visible later, expose this if needed:
    // setTimeout(() => { map.resize(); recenter(); }, 0);

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
      aria-label='Map showing Hotel Kempinski Adriatic'
      // These styles help ensure touch works even if parent styles interfere
      style={{
        // Prevent parent page from hijacking touch gestures
        touchAction: 'none',
        // If you had any overlay shenanigans, make sure the map can receive events:
        pointerEvents: 'auto',
      }}
    />
  )
}
