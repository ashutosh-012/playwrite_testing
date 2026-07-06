import 'dotenv/config'
import Groq from 'groq-sdk'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

function cleanSelector(raw) {
  let s = raw.trim().replace(/^["'`]|["'`]$/g, '')
  if (/^[\w-]+=["\']/i.test(s)) s = `[${s}]`
  return s
}

const dir = path.dirname(fileURLToPath(import.meta.url))
const MAP = path.join(dir, 'selector-map.json')

function getMap() {
  if (!fs.existsSync(MAP)) return {}
  return JSON.parse(fs.readFileSync(MAP, 'utf8'))
}

function saveMap(map) {
  fs.writeFileSync(MAP, JSON.stringify(map, null, 2))
}

async function heal(broken, html) {
  const map = getMap()

  if (map[broken]) {
    console.log(`\n   [AI Healer] Cached fix: "${broken}" → "${map[broken]}"`)
    return map[broken]
  }

  console.log(`\n   [AI Healer] Broken selector: "${broken}"`)
  console.log('   [AI Healer] Sending page HTML to Groq...')

  const client = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const res = await client.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: 'You are a Playwright CSS selector expert. Return ONLY a valid CSS selector. Always use full bracket notation for attribute selectors, e.g. [data-testid="name"]. No explanation. No markdown. Just the selector.'
      },
      {
        role: 'user',
        content: `This Playwright selector no longer works: ${broken}

Page HTML:
${html.slice(0, 5000)}

Find the same element with its renamed attribute. Return ONLY the selector like [data-testid="new-name"]. Use square brackets. Nothing else.`
      }
    ],
    max_tokens: 60,
    temperature: 0.1
  })

  const fixed = cleanSelector(res.choices[0].message.content)

  map[broken] = fixed
  saveMap(map)

  console.log(`   [AI Healer] Groq found fix: "${fixed}"`)
  console.log('   [AI Healer] Saved to selector-map.json — will auto-use next time\n')

  return fixed
}

async function smartLocator(page, selector) {
  try {
    const loc = page.locator(selector)
    await loc.waitFor({ state: 'attached', timeout: 3000 })
    return loc
  } catch {
    const html = await page.content()
    const fixed = await heal(selector, html)
    return page.locator(fixed)
  }
}

async function smartFill(page, selector, value) {
  const loc = await smartLocator(page, selector)
  await loc.fill(value)
}

async function smartClick(page, selector) {
  const loc = await smartLocator(page, selector)
  await loc.click()
}

export { heal, smartLocator, smartFill, smartClick }
