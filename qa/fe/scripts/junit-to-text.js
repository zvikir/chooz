const fs = require('fs')
const path = require('path')
const xml2js = require('xml2js')

async function main() {
  const junitPath = path.resolve(__dirname, '../reports/junit.xml')
  const outPath = path.resolve(__dirname, '../reports/report.txt')
  if (!fs.existsSync(junitPath)) {
    console.error('No junit.xml found at', junitPath)
    process.exit(0)
  }
  const xml = fs.readFileSync(junitPath, 'utf8')
  const parsed = await xml2js.parseStringPromise(xml)
  const suites = Array.isArray(parsed.testsuites?.testsuite) ? parsed.testsuites.testsuite : []
  const lines = []
  lines.push('FE Test Summary')
  for (const suite of suites) {
    const name = suite.$?.name || 'suite'
    const cases = Array.isArray(suite.testcase) ? suite.testcase : []
    lines.push(`\nSuite: ${name}`)
    for (const tc of cases) {
      const tcName = tc.$?.name || 'test'
      const failed = Array.isArray(tc.failure) && tc.failure.length > 0
      lines.push(`- ${tcName}: ${failed ? 'FAIL' : 'PASS'}`)
    }
  }
  fs.writeFileSync(outPath, lines.join('\n'))
}

main().catch((e) => { console.error(e); process.exit(1) })


