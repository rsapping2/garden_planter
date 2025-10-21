# GitHub Actions Workflow

## Single Workflow: `pr-checks.yml`

**Name**: PR Checks  
**Triggers**: Pull requests to main/master/develop

### Jobs (5 total)

1. **🔍 Lint** - ESLint code style checks
2. **🧪 Frontend Tests** - All React tests (unit + integration)
3. **📊 Frontend Coverage** - Frontend code coverage report
4. **🔧 Backend Tests** - All API tests (unit + integration)
5. **📈 Backend Coverage** - Backend code coverage report

---

## What You'll See on Your PR

```
Checks (5)
────────────────────────────────
✅ PR Checks / Lint Code
✅ PR Checks / Frontend Tests
✅ PR Checks / Frontend Code Coverage
✅ PR Checks / Backend Tests
✅ PR Checks / Backend Coverage
```

**All prefixed with "PR Checks"** - easy to identify!

---

## Cleaned Up

### ❌ Removed (Old Duplicates):
- `ci.yml` - "CI/CD Pipeline" (duplicate)
- `test.yml` - "Run Tests" (duplicate)
- `eslint.yml` - "ESLint Check" (duplicate)

### ✅ Kept:
- `pr-checks.yml` - **Your single source of truth**

---

## Quick Reference

| Command | What It Does |
|---------|-------------|
| `npm test` | Run all frontend tests locally |
| `npm test -- --coverage` | Get frontend coverage |
| `cd backend && npm test` | Run all backend tests |
| `npx eslint src/` | Run linter |

---

## Branch Protection

Recommended required checks:
- ✅ `PR Checks / Lint Code`
- ✅ `PR Checks / Frontend Tests`
- ✅ `PR Checks / Backend Tests`

---

## Notes

- All jobs run in parallel for speed
- Coverage jobs run after their respective tests pass
- No duplicate workflows anymore!
- Clean, simple, single workflow file

---

**Next time you push, you'll only see 5 checks (not 10+)** ✨

