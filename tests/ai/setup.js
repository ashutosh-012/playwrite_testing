import { generateTestData } from './generate.js'

export default async function globalSetup() {
  console.log('\n========================================')
  console.log('   AI-POWERED PLAYWRIGHT TEST SUITE')
  console.log('   Groq LLM + Self-Healing Selectors')
  console.log('========================================')
  await generateTestData()
}
