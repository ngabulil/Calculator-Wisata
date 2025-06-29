import { createContext, useState, useEffect, useRef } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"

export const CalculatorContext = createContext()

export const CalculatorProvider = ({ children }) => {
  const [savedState, setSavedState] = useLocalStorage("calc_data", null)

  const [hotels, setHotels] = useState([])
  const [villas, setVillas] = useState([])
  const [tours, setTours] = useState([])
  const [extras, setExtras] = useState([])

  const hasLoaded = useRef(false)

  useEffect(() => {
    if (savedState && !hasLoaded.current) {
      setHotels(Array.isArray(savedState.hotels) ? savedState.hotels : [])
      setVillas(Array.isArray(savedState.villas) ? savedState.villas : [])
      setTours(Array.isArray(savedState.tours) ? savedState.tours : [])
      setExtras(Array.isArray(savedState.extras) ? savedState.extras : [])
      hasLoaded.current = true
    }
  }, [savedState])

  useEffect(() => {
    if (hasLoaded.current) {
      setSavedState({ hotels, villas, tours, extras })
    }
  }, [hotels, villas, tours, extras])

  const updateHotels = (items) => setHotels(items)
  const updateVillas = (items) => setVillas(items)

  const removeHotel = (index) => setHotels((prev) => prev.filter((_, i) => i !== index))
  const removeVilla = (index) => setVillas((prev) => prev.filter((_, i) => i !== index))

  const updateTours = (newTours) => setTours(newTours)
  const addTour = (tour) => setTours((prev) => [...prev, tour])
  const removeTour = (index) => setTours((prev) => prev.filter((_, i) => i !== index))

  const updateExtras = (newExtras) => setExtras(newExtras)
  const addExtra = (extra) => setExtras((prev) => [...prev, extra])
  const removeExtra = (index) => setExtras((prev) => prev.filter((_, i) => i !== index))

  const resetAll = () => {
    setHotels([])
    setVillas([])
    setTours([])
    setExtras([])
    setSavedState(null)
  }

  const totalPrice =
    hotels.reduce((sum, h) => sum + (h.totalPrice || 0), 0) +
    villas.reduce((sum, v) => sum + (v.totalPrice || 0), 0) +
    tours.reduce((sum, t) => sum + (t.finalPrice || 0), 0) +
    extras.reduce((sum, e) => sum + (e.finalPrice || 0), 0)

  return (
    <CalculatorContext.Provider
      value={{
        hotels, villas, tours, extras,
        updateHotels, updateVillas, updateTours, updateExtras,
        addTour, removeTour,
        addExtra, removeExtra,
        removeHotel, removeVilla,
        totalPrice,
        resetAll,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  )
}