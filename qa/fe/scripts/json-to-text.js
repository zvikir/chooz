const fs = require('fs')
const path = require('path')

function specPassed(spec) {
  // Consider spec failed if any test result is not passed
  if (Array.isArray(spec.tests) && spec.tests.length > 0) {
    for (const t of spec.tests) {
      if (Array.isArray(t.results) && t.results.length > 0) {
        for (const r of t.results) {
          if ((r.status || '').toLowerCase() !== 'passed') return false
        }
      } else if ((t.status || '').toLowerCase() !== 'passed') {
        return false
      }
    }
    return true
  }
  // Fallback to ok flag if tests array is missing
  return spec.ok === true
}

function walkSuites(suites, lines) {
  for (const suite of suites || []) {
    if (suite.title) lines.push(`\nSuite: ${suite.title}`)
    for (const spec of suite.specs || []) {
      const name = spec.title
      const ok = specPassed(spec)
      lines.push(`- ${name}: ${ok ? 'PASS' : 'FAIL'}`)
    }
    if (suite.suites && suite.suites.length) walkSuites(suite.suites, lines)
  }
}

function main() {
  const jsonPath = path.resolve(__dirname, '../reports/results.json')
  const outPath = path.resolve(__dirname, '../reports/report.txt')
  if (!fs.existsSync(jsonPath)) {
    console.error('No results.json found at', jsonPath)
    process.exit(0)
  }
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  const lines = []
  lines.push('FE Test Summary')
  for (const proj of data.suites || []) {
    // Project-level title
    if (proj.title) lines.push(`\nProject: ${proj.title}`)
    walkSuites(proj.suites || [], lines)
  }
  fs.writeFileSync(outPath, lines.join('\n'))
}

main()


