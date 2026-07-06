import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const loginFile = path.join(dir, '../../app/src/pages/Login.jsx')

let code = fs.readFileSync(loginFile, 'utf8')
code = code.replace(/data-testid="email-input"/g, 'data-testid="email-field"')
fs.writeFileSync(loginFile, code)

console.log('\n========================================')
console.log('   DEMO: Selector Broken on Purpose')
console.log('========================================')
console.log('   Changed: data-testid="email-input"')
console.log('        To: data-testid="email-field"')
console.log('')
console.log('   This simulates a developer renaming')
console.log('   a component in the React code.')
console.log('')
console.log('   Now run: npm test')
console.log('   Watch AI Healer auto-fix the selector')
console.log('========================================\n')
