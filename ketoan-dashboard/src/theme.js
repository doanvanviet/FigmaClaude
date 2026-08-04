import { COLORS as MDS_COLORS } from '@mds/theme.js'

export { currentTheme, applyTheme, currentMode, applyMode, DENSITIES, currentDensity, applyDensity, useTheme, useDensity } from '@mds/theme.js'

export const COLORS = [
  ...MDS_COLORS,
  {
    id:       'gradient',
    label:    'Gradient',
    main:     '#245fdf',
    light:    '#f0f6fe',
    gradient: 'linear-gradient(90deg, #245FDF 0%, #0FBF79 100%)'
  }
]
