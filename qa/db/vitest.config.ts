import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    reporters: [
      'default',
      ['junit', { outputFile: 'reports/junit.xml' }],
      ['json', { outputFile: 'reports/results.json' }],
    ],
  },
})


