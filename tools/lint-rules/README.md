# Custom Lint Rules

**GritQL** plugins loaded by Biome (configured in `biome.json` → `plugins`).

GritQL is Biome v2's pattern-matching/rewrite engine. Each `.grit` file defines ONE rule.

## Anatomy of a rule

```grit
language js

`<pattern to match>` where {
  $variable <: <constraint>,
  register_diagnostic(span = $variable, message = "Message for the developer")
}
```

- `language js` also applies to TS/TSX automatically.
- Backticks delimit code patterns with metavariables (`$name`).
- `register_diagnostic` emits the error/warning. Use `severity = "error"` to block lint.

## Existing rules

| File | What it enforces |
|------|-----------------|
| `no-direct-axios.grit` | `axios` imports are only allowed in `src/shared/lib/http.ts` and `src/shared/api/mutator.ts`. Forces features to use the shared `httpClient`. |

## Adding a rule

1. Create `tools/lint-rules/<name>.grit`.
2. Add the path to the `plugins` array in `biome.json`.
3. Document the rule here (one line in the table above).
4. Run `npm run lint` to validate.

## Resources

- GritQL docs: https://docs.grit.io/language/overview
- Biome plugins: https://biomejs.dev/linter/plugins/
