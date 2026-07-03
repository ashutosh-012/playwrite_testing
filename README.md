# Playwright Testing POC

Browser automation testing using Playwright — replacing Selenium.

## Stack
- React + Vite (UI)
- Playwright (browser testing)

## Setup

```bash
# Install app dependencies
cd app
npm install
npm run dev

# In a new terminal — install test dependencies
cd ..
npm install

# Run all tests
npx playwright test

# Watch tests run in real browser
npx playwright test --headed

# See HTML report
npx playwright show-report
```

## Test Coverage
- Login page: 22 test cases
- Register page: 10 test cases  
- Employee form: 15 test cases
- Total: 47 test cases

## Valid Credentials (for login tests)
- Email: admin@corp.com
- Password: Admin@123
