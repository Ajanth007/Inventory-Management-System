export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', surface: '#F8FAFC', ink: '#0F172A', muted: '#64748B',
        critical: '#DC2626', low: '#F59E0B', ok: '#16A34A',
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
