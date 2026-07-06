import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const loginFile = path.join(dir, '../../app/src/pages/Login.jsx')
const mapFile = path.join(dir, 'selector-map.json')

let code = fs.readFileSync(loginFile, 'utf8')
code = code.replace(/data-testid="email-field"/g, 'data-testid="email-input"')
fs.writeFileSync(loginFile, code)

fs.writeFileSync(mapFile, '{}')

console.log('\n========================================')
console.log('   DEMO: Reset Complete')
console.log('========================================')
console.log('   Restored: data-testid="email-input"')
console.log('   Cleared:  selector-map.json cache')
console.log('   Ready for next demo run')
console.log('========================================\n')
