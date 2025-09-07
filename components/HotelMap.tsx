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
      center: HOTEL_COORDS,
      zoom: 14,
      dragPan: true,
      dragRotate: false,
      touchZoomRotate: true,
      scrollZoom: true,
      boxZoom: false,
      keyboard: true,
    })

    map.addControl(
      new maplibregl.NavigationControl({ visualizePitch: true }),
      'top-right',
    )

    const popup = new maplibregl.Popup({ offset: 12 }).setText(
      'Hotelska obala',
    )
    new maplibregl.Marker().setLngLat(HOTEL_COORDS).setPopup(popup).addTo(map)

    const recenter = () => {
      map.easeTo({
        center: HOTEL_COORDS,
        zoom: 15.5,
        offset: [0, -80],
        duration: 500,
      })
    }

    map.on('load', () => {
      map.resize()
      requestAnimationFrame(() => {
        map.resize()
        recenter()
      })
    })

    const onWinResize = () => {
      map.resize()
      recenter()
    }
    window.addEventListener('resize', onWinResize)
    let dpr = window.devicePixelRatio
    const dprInterval = setInterval(() => {
      if (window.devicePixelRatio !== dpr) {
        dpr = window.devicePixelRatio
        map.resize()
        recenter()
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
      aria-label='Map showing Hotel Kempinski Adriatic'
      style={{
        touchAction: 'none',
        pointerEvents: 'auto',
      }}
    />
  )
}