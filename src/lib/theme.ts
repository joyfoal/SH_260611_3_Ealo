export const themes = {
  warm: {
    bg: { primary: '#FFFAF5', card: '#FAEEDA', dark: '#1A0E05', surface: '#412402' },
    text: { primary: '#412402', secondary: '#854F0B', muted: '#888780', onDark: '#FAEEDA' },
    accent: { primary: '#BA7517', secondary: '#EF9F27', light: '#FAC775', highlight: '#BA7517' },
    border: '#D3D1C7',
    tab: { active: '#854F0B', inactive: '#888780' },
  },
  dark: {
    bg: { primary: '#1a1a2e', card: '#26215C', dark: '#0D0D1F', surface: '#13132B' },
    text: { primary: '#EEEDFE', secondary: '#AFA9EC', muted: '#5F5E5A', onDark: '#EEEDFE' },
    accent: { primary: '#534AB7', secondary: '#7F77DD', light: '#CECBF6', highlight: '#534AB7' },
    border: '#3C3489',
    tab: { active: '#AFA9EC', inactive: '#5F5E5A' },
  },
  green: {
    bg: { primary: '#F4F9F0', card: '#EAF3DE', dark: '#0F2010', surface: '#162E18' },
    text: { primary: '#173404', secondary: '#3B6D11', muted: '#888780', onDark: '#EAF3DE' },
    accent: { primary: '#639922', secondary: '#97C459', light: '#C0DD97', highlight: '#3B6D11' },
    border: '#C0DD97',
    tab: { active: '#3B6D11', inactive: '#888780' },
  },
  blue: {
    bg: { primary: '#F4F8FC', card: '#E7EFF7', dark: '#0A1524', surface: '#14243A' },
    text: { primary: '#0F2337', secondary: '#234875', muted: '#888780', onDark: '#E7EFF7' },
    accent: { primary: '#1E3A5F', secondary: '#4A72A8', light: '#C7D9EC', highlight: '#234875' },
    border: '#C7D9EC',
    tab: { active: '#234875', inactive: '#888780' },
  },
} as const

export type ThemeName = keyof typeof themes
export type Theme = (typeof themes)[ThemeName]
