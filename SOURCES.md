# Where the data comes from

Everything published on this site is public record. This page says where each
kind of record lives, and the rule every page follows before it goes up.

## The rule

**Every figure, name, date and contact detail carries a public source.** If you
cannot point to one, the detail does not go on the page — leave the gap visible
instead.

This is not bureaucratic caution. This site looks official enough to be believed,
and a resident who drives to a municipal office on the strength of a wrong
opening time is worse off than one who found nothing here at all. A missing
answer sends someone looking; a confident wrong answer stops them looking.

Two failure modes to watch for specifically:

- **Borrowed data.** This site was built from a starter kit that shipped
  populated with another city's real officials, colleges and phone numbers.
  Adapting text from another LGU's portal carries their facts across with it.
  Write from the source record, not from another town's page.
- **Plausible text.** Generated or paraphrased content reads fluently whether or
  not it is true, and reviewers tend to wave through anything well formatted.
  Fluency is not evidence.

## Where to look

| What you need                 | Where it lives                                              | Notes                                                         |
| ----------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------- |
| Budget, procurement, projects | DILG **Full Disclosure Policy Portal** (`fdpp.dilg.gov.ph`) | Start here. LGUs are required to post these quarterly         |
| Audited financial statements  | **COA** Annual Audit Reports, listed per LGU                | Authoritative; downloadable PDFs                              |
| Revenues and expenditures     | **BLGF** Statement of Receipts and Expenditures             | Comparable year to year                                       |
| Elected officials             | **COMELEC** results for the most recent local elections     | Cross-check against DILG                                      |
| Officials, offices, barangays | **DILG** local government profile                           | Second source for names and contacts                          |
| Population, barangay counts   | **PSA** census                                              |                                                               |
| Ordinances and resolutions    | Sangguniang Bayan                                           | Often only on the municipality's Facebook page                |
| Announcements, office hours   | The municipality's official channels                        | Screenshot-and-date anything that only exists on social media |

Compliance varies between municipalities. If Carigara has not posted something,
record that it is unavailable rather than substituting a neighbouring town's
figure.

## How to cite

Every page that states a fact ends with a short provenance note:

```markdown
---

**Sources**

- [FY 2025 Annual Budget](https://example.gov.ph/...) — DILG Full Disclosure
  Policy Portal, retrieved 2026-09-20
- Office hours confirmed by phone with the Municipal Treasurer's Office,
  2026-09-20
```

Include the retrieval date. Public postings get replaced without notice, and a
date is what tells the next contributor whether to re-check.

For anything confirmed by phone or in person, say so and date it. That is a
legitimate source — it just cannot be re-checked by a reader, so it needs to be
labelled as what it is.

## When something is wrong

Corrections are the most valuable contribution this project takes. Open an issue
or a pull request; see the repository README. If a published figure is disputed
and cannot be re-sourced quickly, remove it while it is being checked rather than
leaving it up with a caveat.
