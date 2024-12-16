module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.drag-region': {
          '-webkit-app-region': 'drag',
          'app-region': 'drag'
        },
        '.no-drag-region': {
          '-webkit-app-region': 'no-drag',
          'app-region': 'no-drag'
        }
      });
    }
  ],
}
