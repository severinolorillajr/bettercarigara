# Better Carigara

A community-built transparency portal for **Carigara, Leyte** — local government
services, departments, budgets, projects and contacts, in one place and in plain
language.

> **This is not an official website of the Municipality of Carigara.** It is an
> independent civic project that republishes public records. For official
> transactions, always go through the LGU directly.

Part of the [BetterGov.ph Better LGU](https://lgu.bettergov.ph) initiative.
Directory entry: `Carigara, Leyte` in [jmacj/better-lgu-directory](https://github.com/jmacj/better-lgu-directory).

## Status

🟡 **Work in progress** — scaffolded from the starter kit, content not yet
populated. Nothing here should be treated as accurate until this section says
otherwise.

Before launch:

- [ ] Verify and fill in officials (mayor, vice mayor, SB members, department heads)
- [ ] Add office contact details, locations and hours
- [ ] Publish budget and expenditure data (COA / DBM Open Data)
- [ ] Publish ongoing and completed projects
- [ ] Add recent ordinances and resolutions
- [ ] Register `bettercarigara.org` and deploy
- [ ] Move directory entry to 🟢 Active

## Running it locally

Requires Node 18+.

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts: `npm run build`, `npm run lint`, `npm run format`.

## Editing content

Content is YAML and Markdown — no React needed to contribute.

| Where                             | What                                 |
| --------------------------------- | ------------------------------------ |
| `content/services/`               | Citizen-facing services, by category |
| `content/government/departments/` | Department and office pages          |
| `src/data/government.yaml`        | Government section structure         |
| `src/data/services.yaml`          | Service categories and structure     |
| `src/i18n/locales/`               | UI strings (English, Filipino)       |

See [CONTENT-MANAGEMENT.md](CONTENT-MANAGEMENT.md) for a step-by-step guide that
assumes no technical background, and [CONTENT-GUIDE.md](CONTENT-GUIDE.md) for
writing standards.

**Accuracy rule:** every figure, name and contact detail needs a public source —
an LGU posting, a COA report, an ordinance, or an official page. If you cannot
source it, leave it out. A wrong office number is worse than a missing one.

## Contributing

Issues and pull requests are welcome, especially from people who live in
Carigara. Corrections to published data are the single most useful contribution.

## Credits

Built on [betterlocalgov](https://github.com/iyanski/betterlocalgov) by
[@iyanski](https://github.com/iyanski) — React, TypeScript, Tailwind CSS v4 and
[@bettergov/kapwa](https://github.com/bettergov/kapwa). Released under CC0, as is
this repository.

To pull improvements from the upstream starter kit:

```bash
git fetch upstream
git merge upstream/main
```
