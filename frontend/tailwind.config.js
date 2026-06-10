export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        giit: {
          purpleDarkest: '#2E1065',
          purpleDeep: '#4C1D95',
          purple: '#6D28D9',
          purpleLight: '#8B5CF6',
          black: '#0A0A0A',
          orange: '#F97316',
          orangeDeep: '#EA580C',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139,92,246,0.2), 0 20px 80px rgba(109,40,217,0.35)',
        orange: '0 10px 60px rgba(249,115,22,0.25)',
      },
      backgroundImage: {
        'giit-mesh':
          'radial-gradient(circle at 10% 20%, rgba(139,92,246,0.22), transparent 20%), radial-gradient(circle at 80% 10%, rgba(249,115,22,0.18), transparent 22%), radial-gradient(circle at 70% 60%, rgba(76,29,149,0.25), transparent 30%), linear-gradient(135deg, #0A0A0A 0%, #2E1065 55%, #0A0A0A 100%)',
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(249,115,22,0.25)' },
          '50%': { boxShadow: '0 0 0 14px rgba(249,115,22,0)' },
        },
      },
    },
  },
  plugins: [],
};
