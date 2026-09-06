import { create } from 'zustand'

export const useWaterfallStore = create((set) => ({
  cameraMode: 'default', // 'default' | 'cinematic' | 'explore'
  isHovered: false,
  isSelected: false,
  fogEnabled: true,
  cinematicMode: false,
  zoomLevel: 0,
  selectedObject: null,

  setCameraMode: (mode) => set({ cameraMode: mode }),
  toggleFog: () => set((state) => ({ fogEnabled: !state.fogEnabled })),
  toggleCinematicMode: () =>
    set((state) => {
      const nextCinematic = !state.cinematicMode
      return {
        cinematicMode: nextCinematic,
        cameraMode: nextCinematic ? 'cinematic' : 'default',
      }
    }),
  resetCamera: () => set({ cameraMode: 'default', isSelected: false, zoomLevel: 0, selectedObject: null }),
  setHovered: (hovered) => set({ isHovered: hovered }),
  setSelected: (selected) => set({ isSelected: selected, cameraMode: selected ? 'cinematic' : 'default' }),
  setZoomLevel: (zoom) => set({ zoomLevel: Math.max(0, Math.min(1, zoom)) }),
  setSelectedObject: (obj) => set({ selectedObject: obj }),
}))
