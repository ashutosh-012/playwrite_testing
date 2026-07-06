import 'dotenv/config'
import Groq from 'groq-sdk'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const DATA = path.join(dir, 'test-data.json')
const TTL = 60 * 60 * 1000

function isFresh() {
  if (!fs.existsSync(DATA)) return false
  return Date.now() - fs.statSync(DATA).mtimeMs < TTL
}

export function loadTestData() {
  return JSON.parse(fs.readFileSync(DATA, 'utf8'))
}

export async function generateTestData() {
  if (isFresh()) {
    console.log('\n   [AI Generator] Using cached test data\n')
    return loadTestData()
  }

  console.log('\n   [AI Generator] Calling Groq to generate test cases...')

  const client = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const res = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: 'Return ONLY valid raw JSON. No markdown. No code blocks. No explanation.'
      },
      {
        role: 'user',
        content: `Generate login test data. Valid credentials: email "admin@corp.com" password "Admin@123".

Return this exact structure:
{
  "valid": [
    { "email": "admin@corp.com", "pass": "Admin@123", "desc": "standard valid credentials" }
  ],
  "badEmail": [
    { "email": "notanemail", "pass": "Admin@123", "desc": "no @ symbol" },
    { "email": "user@", "pass": "Admin@123", "desc": "missing domain" },
    { "email": "@domain.com", "pass": "Admin@123", "desc": "no local part" }
  ],
  "badPass": [
    { "email": "admin@corp.com", "pass": "wrongpass", "desc": "wrong password" },
    { "email": "admin@corp.com", "pass": "123", "desc": "too short" }
  ],
  "security": [
    { "email": "' OR '1'='1", "pass": "anything", "desc": "SQL injection" },
    { "email": "<script>alert(1)</script>@x.com", "pass": "x", "desc": "XSS attack" },
    { "email": "admin@corp.com; DROP TABLE users;", "pass": "x", "desc": "SQL drop" }
  ],
  "edge": [
    { "email": "   ", "pass": "Admin@123", "desc": "whitespace only" },
    { "email": "a@b.c", "pass": "Admin@123", "desc": "minimal valid format but wrong" }
  ]
}

Return raw JSON only.`
      }
    ],
    max_tokens: 700,
    temperature: 0.2
  })

  let raw = res.choices[0].message.content.trim()
  raw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

  const data = JSON.parse(raw)
  fs.writeFileSync(DATA, JSON.stringify(data, null, 2))

  console.log('   [AI Generator] Groq generated test data:')
  console.log(`     Valid cases:    ${data.valid.length}`)
  console.log(`     Bad email:      ${data.badEmail.length}`)
  console.log(`     Wrong password: ${data.badPass.length}`)
  console.log(`     Security:       ${data.security.length}`)
  console.log(`     Edge cases:     ${data.edge.length}`)
  console.log('   [AI Generator] Saved to tests/ai/test-data.json\n')

  return data
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateTestData().then(() => process.exit(0)).catch(console.error)
}
