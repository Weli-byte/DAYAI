## Description

<!-- A clear and concise description of what this PR does and WHY it is needed.
     Link the related issue: "Closes #123" or "Fixes #456" -->

Closes #

## Type of Change

<!-- Check all that apply -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as
      expected)
- [ ] Refactor (no functional changes, no API changes)
- [ ] Performance improvement
- [ ] Documentation update
- [ ] CI/CD / tooling change
- [ ] Smart contract change (requires security review)

## How Has This Been Tested?

<!-- Describe the tests you ran to verify your changes.
     Include instructions so reviewers can reproduce. -->

- [ ] Unit tests pass (`pnpm test`)
- [ ] Integration tests pass
- [ ] Manual testing — describe steps below:

```
1.
2.
3.
```

## Checklist

- [ ] My code follows the style guidelines of this project (`pnpm lint && pnpm format:check`)
- [ ] I have performed a self-review of my code
- [ ] I have commented any non-obvious code (the WHY, not the WHAT)
- [ ] I have made corresponding changes to documentation
- [ ] My changes generate no new TypeScript errors (`pnpm typecheck`)
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally (`pnpm test`)
- [ ] Any dependent changes have been merged and published in downstream packages

## Smart Contract Changes (if applicable)

- [ ] Contract changes have been reviewed by at least one security-focused reviewer
- [ ] Natspec documentation is complete
- [ ] Events are emitted for all state changes
- [ ] Reentrancy guards applied where needed
- [ ] No use of `tx.origin` for authorization
- [ ] Gas optimization considered

## Screenshots / Recordings (if UI changes)

<!-- Add before/after screenshots or a Loom recording -->

## Additional Notes

<!-- Anything else reviewers should know? Deployment steps? Config changes? -->
