import { ref } from 'vue'

export const COLORS = [
  { id: 'blue',      label: 'Xanh dương', main: '#245fdf', light: '#f0f6fe' },
  { id: 'green',     label: 'Xanh lá',    main: '#0e9a62', light: '#e6f5ef' },
  { id: 'blue-gray', label: 'Xanh xám',   main: '#4e5ba6', light: '#fcfcfd' },
  { id: 'teal',      label: 'Xanh ngọc',  main: '#0e9384', light: '#f0fdfa' },
  { id: 'cyan',      label: 'Xanh lơ',    main: '#00a2cf', light: '#f0fbff' },
  { id: 'indigo',    label: 'Chàm',        main: '#4155f5', light: '#ecf4ff' },
  { id: 'purple',    label: 'Tím',         main: '#744ec7', light: '#f7f5fd' },
  { id: 'pink',      label: 'Hồng',        main: '#c64691', light: '#fcf3f9' },
  { id: 'red',       label: 'Đỏ',          main: '#c34266', light: '#fbf4f7' },
  { id: 'orange',    label: 'Cam',         main: '#ea580c', light: '#fff7ed' },
]

const _saved = localStorage.getItem('mds-theme') || 'green'
export const currentTheme = ref(_saved)

export function applyTheme(theme) {
  currentTheme.value = theme
  if (theme === 'blue') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', theme)
  }
  localStorage.setItem('mds-theme', theme)
}

export function useTheme() {
  return { currentTheme, applyTheme, COLORS }
}

/* ── Density ── */
export const DENSITIES = [
  { id: 'medium',      label: 'Trung bình', height: 32, description: 'Mặc định — phù hợp đa số màn hình' },
  { id: 'compact',     label: 'Compact',    height: 28, description: 'Thu gọn — hiển thị nhiều dữ liệu hơn' },
  { id: 'comfortable', label: 'Rộng',       height: 36, description: 'Rộng rãi — dễ thao tác trên màn to' },
]

const _savedDensity = localStorage.getItem('mds-density') || 'medium'
export const currentDensity = ref(_savedDensity)

export function applyDensity(density) {
  currentDensity.value = density
  if (density === 'medium') {
    document.documentElement.removeAttribute('data-density')
  } else {
    document.documentElement.setAttribute('data-density', density)
  }
  localStorage.setItem('mds-density', density)
}

export function useDensity() {
  return { currentDensity, applyDensity, DENSITIES }
}

/* ── Header mode (color = brand bg, light = white bg) ── */
const _savedMode = localStorage.getItem('mds-header-mode') || 'color'
export const currentMode = ref(_savedMode)

export function applyMode(mode) {
  currentMode.value = mode
  localStorage.setItem('mds-header-mode', mode)
}

/* ── Wallpaper ── */
// type: 'image' → url là path file; type: 'gradient' → url là CSS gradient string trực tiếp
const _UP = 'https://images.unsplash.com/photo-'
const _Q  = '?auto=format&w=1920&q=80'
const _QT = '?auto=format&w=320&q=70'
export const WALLPAPERS = [
  { id: 'none',    label: 'Không có',    type: 'image', url: '', thumb: '' },
  // ── Ảnh local ──
  { id: 'aurora',  label: 'Aurora',      type: 'image', url: '/bg-aurora.jpg',   thumb: '/bg-aurora.jpg' },
  { id: 'ocean',   label: 'Đại dương',   type: 'image', url: '/bg-ocean.jpg',    thumb: '/bg-ocean.jpg' },
  { id: 'mist',    label: 'Sương mờ',    type: 'image', url: '/bg-mist.jpg',     thumb: '/bg-mist.jpg' },
  { id: 'mountain',label: 'Núi sương',   type: 'image', url: '/bg-mountain.jpg', thumb: '/bg-mountain.jpg' },
  { id: 'desert',  label: 'Sa mạc',      type: 'image', url: '/bg-desert.jpg',   thumb: '/bg-desert.jpg' },
  { id: 'lake',    label: 'Hồ núi',      type: 'image', url: '/bg-lake.jpg',     thumb: '/bg-lake.jpg' },
  // ── Ảnh Unsplash — tone tối, ít chi tiết ──
  { id: 'starry',  label: 'Đêm sao',     type: 'image', url: _UP+'1419242902214-272b3f66ee7a'+_Q, thumb: _UP+'1419242902214-272b3f66ee7a'+_QT },
  { id: 'forest',  label: 'Rừng tối',    type: 'image', url: _UP+'1448375240586-882707db888b'+_Q, thumb: _UP+'1448375240586-882707db888b'+_QT },
  { id: 'valley',  label: 'Thung lũng',  type: 'image', url: _UP+'1506905925346-21bda4d32df4'+_Q, thumb: _UP+'1506905925346-21bda4d32df4'+_QT },
  { id: 'fogmtn',  label: 'Núi mây',     type: 'image', url: _UP+'1511497584788-876760111969'+_Q, thumb: _UP+'1511497584788-876760111969'+_QT },
  { id: 'snowmtn', label: 'Tuyết sơn',   type: 'image', url: _UP+'1464822759023-fed622ff2c3b'+_Q, thumb: _UP+'1464822759023-fed622ff2c3b'+_QT },
  { id: 'darkwave',label: 'Sóng tối',    type: 'image', url: _UP+'1505118380757-91f5f5632de0'+_Q, thumb: _UP+'1505118380757-91f5f5632de0'+_QT },
]

const _savedWP = localStorage.getItem('mds-wallpaper') || 'none'
export const currentWallpaper = ref(_savedWP)

export function applyWallpaper(id) {
  currentWallpaper.value = id
  localStorage.setItem('mds-wallpaper', id)
  const wp = WALLPAPERS.find(w => w.id === id)
  if (wp && wp.url) {
    document.documentElement.setAttribute('data-wallpaper', id)
    const cssVal = wp.type === 'gradient' ? wp.url : `url(${wp.url})`
    document.documentElement.style.setProperty('--wallpaper-url', cssVal)
  } else {
    document.documentElement.removeAttribute('data-wallpaper')
    document.documentElement.style.removeProperty('--wallpaper-url')
  }
}
