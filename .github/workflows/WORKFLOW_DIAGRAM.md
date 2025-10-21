# GitHub Actions Workflow Diagram

## PR Checks Workflow

```
┌─────────────────────────────────────┐
│  Pull Request Created/Updated       │
└─────────────────┬───────────────────┘
                  │
                  ▼
      ┌───────────────────────┐
      │  Trigger: pr-checks   │
      └───────────┬───────────┘
                  │
    ┌─────────────┴─────────────┐
    │   Run Jobs In Parallel    │
    └─────────────┬─────────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
      ▼                       ▼
┌──────────┐          ┌─────────────┐
│   Lint   │          │ Unit Tests  │
│  ~10s    │          │    ~15s     │
└────┬─────┘          └──────┬──────┘
     │                       │
     │   ┌───────────────────┴─────────────┐
     │   │                                 │
     │   ▼                                 ▼
     │ ┌──────────────────┐      ┌────────────────┐
     │ │Integration Tests │      │ Backend Tests  │
     │ │      ~30s        │      │     ~20s       │
     │ └────────┬─────────┘      └───────┬────────┘
     │          │                        │
     │          │ ┌──────────────────────┘
     │          │ │
     │          ▼ ▼
     │     ┌─────────────────┐
     │     │  All Tests Pass │
     │     └────────┬─────────┘
     │              │
     │    ┌─────────┴──────────┐
     │    │                    │
     │    ▼                    ▼
     │ ┌──────────────┐  ┌─────────────────┐
     │ │   Coverage   │  │Backend Coverage │
     │ │Upload Report │  │ Upload Report   │
     │ └──────────────┘  └─────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│  All Jobs Complete              │
│  ✅ PR ready for review/merge   │
└─────────────────────────────────┘
```

## Job Dependencies

```
lint ────────────────────────────┐
                                 │
unit-tests ──────────────────┐   │
                             │   │
integration-tests ───────────┤   │
                             │   │
backend-tests ───────────────┤   │
                             │   │
                             ▼   ▼
                        coverage (needs all tests to pass)
                             │
                             ▼
                      backend-coverage (needs backend-tests)
```

## Timeline Example

```
Time    Lint    Unit    Integration    Backend    Coverage    Backend-Cov
──────────────────────────────────────────────────────────────────────────
0:00    START   START      START        START
0:10    ✅     
0:15            ✅
0:20                                     ✅
0:30                       ✅
0:30                                               START       START
0:45                                               ✅
0:50                                                           ✅

Total: ~50 seconds
```

## What Happens on Failure

```
Pull Request
    │
    ▼
┌────────┐
│  Lint  │──── ❌ FAIL
└────────┘      │
                ▼
          PR shows: ❌ lint failed
          Other jobs still run
          PR cannot merge (if branch protection enabled)
```

## Coverage Report

```
Pull Request
    │
    ▼
Tests pass
    │
    ▼
Coverage runs
    │
    ▼
Generates report
    │
    ├──► Upload to Codecov
    │
    └──► Post PR comment:
         ┌──────────────────────────┐
         │ Coverage: 87.5%          │
         │ +2.3% from main          │
         │                          │
         │ Files changed:           │
         │ ✅ validation.js 100%    │
         │ ⚠️  emailService.js 75%  │
         └──────────────────────────┘
```

## Status Checks on PR

```
┌─────────────────────────────────────┐
│  Your PR #42                        │
├─────────────────────────────────────┤
│  Checks                             │
│                                     │
│  ✅ lint                            │
│  ✅ unit-tests                      │
│  ✅ integration-tests               │
│  ✅ backend-tests                   │
│  ✅ coverage                        │
│  ✅ backend-coverage                │
│                                     │
│  All checks passed!                 │
│                                     │
│  [Merge pull request ▼]             │
└─────────────────────────────────────┘
```

## With Branch Protection

```
main branch
    │
    ├── feature/new-feature (PR #42)
    │
    └── Required checks:
        ├── ✅ lint
        ├── ✅ unit-tests
        ├── ✅ integration-tests
        └── ✅ backend-tests

If ANY check fails:
    [Merge pull request] ← DISABLED
```

## Parallel Execution

```
GitHub Actions Runner
┌────────────────────────────────────────┐
│ Container 1  │ Container 2  │ Container 3  │ Container 4
│ (Lint)       │ (Unit)       │ (Integration)│ (Backend)
│              │              │              │
│ Setup Node   │ Setup Node   │ Setup Node   │ Setup Node
│ npm ci       │ npm ci       │ npm ci       │ cd backend
│ eslint       │ npm test     │ npm test     │ npm ci
│              │              │              │ npm test
└──────┬───────┴──────┬───────┴──────┬───────┴──────┬────
       │              │              │              │
       └──────────────┴──────────────┴──────────────┘
                      All complete
                           │
                           ▼
                  Run coverage jobs
```

## Cost (GitHub Actions Minutes)

```
Free tier: 2,000 minutes/month

Per PR run:
- Lint:         ~0.5 min
- Unit:         ~1 min
- Integration:  ~1.5 min
- Backend:      ~1 min
- Coverage:     ~2 min
- Backend Cov:  ~2 min
───────────────────────
Total:          ~8 minutes per PR

You can run ~250 PRs/month on free tier ✅
```

