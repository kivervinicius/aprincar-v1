import { createTheme } from '@mantine/core';
export type AprincarThemeName = 'standard' | 'pastel' | 'contrast' | 'night';
export const theme = createTheme({
  primaryColor: 'aprincar',
  fontFamily: 'Inter, system-ui, sans-serif',
  headings: { fontFamily: 'Nunito Sans, Inter, system-ui, sans-serif' },
  defaultRadius: 'lg',
  colors: {
    aprincar: [
      '#f7f4ff',
      '#efeafe',
      '#ded5ff',
      '#c4b5ff',
      '#a391f7',
      '#8772e7',
      '#6f5bd7',
      '#5d49cc',
      '#4939a5',
      '#342978',
    ],
  },
});
export const themeStyles: Record<AprincarThemeName, { background: string; surface: string; text: string }> = {
  standard: { background: '#F7F6F2', surface: '#FFFFFF', text: '#242523' },
  pastel: { background: '#FFF4F7', surface: '#FFFDFE', text: '#342B34' },
  contrast: { background: '#000000', surface: '#151515', text: '#FFFFFF' },
  night: { background: '#101426', surface: '#191F36', text: '#F3F5FF' },
};
