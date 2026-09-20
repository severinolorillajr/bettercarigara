# Where the data comes from

Everything published on this site is public record. This page says where each
kind of record lives, and the rule every page follows before it goes up.

All links below were checked on 2026-09-20.

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

## Start here: the Full Disclosure Policy Portal

DILG Memorandum Circular 2010-083 requires every LGU to post its core financial
documents each quarter. They are collected at:

**<https://fdpp.dilg.gov.ph/fdpp/report>**

**Caveat, checked 2026-09-20:** the filter page renders without logging in, but
its province and city/municipality dropdowns load over AJAX from endpoints that
redirect to the login page (HTTP 302) for an anonymous visitor. So the cascade
that narrows to a single LGU does not currently work logged out, even though the
portal FAQ says the public may view disclosed documents. If you hit this, it is
the portal, not you. Options: register an account, ask DILG Region VIII directly,
or file an FOI request (see below).

Document types available through that filter:

| Most useful first                                                       |                                                          |
| ----------------------------------------------------------------------- | -------------------------------------------------------- |
| Annual Budget Report                                                    | What the municipality planned to spend                   |
| Statement of Receipts and Expenditures                                  | What it actually took in and spent                       |
| Annual Procurement Plan                                                 | What it intended to buy                                  |
| Bid Results on Civil Works, Goods and Services, and Consulting Services | Who won, and for how much                                |
| 20% of the National Tax Allotment Utilization                           | The development fund — this is where local projects live |
| Local Disaster Risk Reduction and Management Fund Utilization           | Relevant for a Leyte municipality                        |
| Report of Special Education Fund Utilization                            | School spending                                          |
| Manpower Complement                                                     | Positions and staffing                                   |
| Quarterly Statement of Cash Flow                                        |                                                          |
| Trust Fund Utilization                                                  |                                                          |
| Statement of Indebtedness, Payments and Balances                        |                                                          |
| Unliquidated Cash Advances                                              |                                                          |
| Supplemental Procurement Plan                                           |                                                          |
| Annual Gender and Development Accomplishment Report                     |                                                          |

Posting compliance varies between municipalities. If Carigara has not posted
something, record that it is unavailable rather than substituting a neighbouring
town's figure.

## Everything else

| What you need                                      | Where                                                                                                                 | Notes                                                                               |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Audited financial statements                       | COA Annual Audit Reports for LGUs — <https://www.coa.gov.ph/reports/annual-audit-reports/aar-local-government-units/> | By year, then region and province. Browser only; the site refuses scripted requests |
| Revenues and expenditures, comparable year to year | BLGF fiscal data — <https://blgf.gov.ph/lgu-fiscal-data/> and <https://blgf.gov.ph/lgu-timeseries-data/>              | SRE data published for FY2009 onward                                                |
| Regional issuances and LGU bulletins               | DILG Region VIII — <https://region8.dilg.gov.ph/>                                                                     | Closest thing to a regional noticeboard                                             |
| Elected officials                                  | COMELEC results for the most recent local elections                                                                   | Cross-check against DILG before publishing a name                                   |
| Officials, offices, barangays                      | DILG local government profile                                                                                         | Second source for names and contacts                                                |
| Population, barangay counts                        | PSA census — <https://psa.gov.ph/>                                                                                    | Browser only; refuses scripted requests                                             |
| Ordinances and resolutions                         | Sangguniang Bayan                                                                                                     | Often only on the municipality's Facebook page                                      |
| Office hours, announcements                        | The municipality's official channels                                                                                  | Screenshot and date anything that exists only on social media                       |

## How to cite

Every page that states a fact ends with a short provenance note:

```markdown
---

**Sources**

- [FY 2025 Annual Budget Report](https://fdpp.dilg.gov.ph/fdpp/report) — DILG
  Full Disclosure Policy Portal, retrieved 2026-09-20
- Office hours confirmed by phone with the Municipal Treasurer's Office,
  2026-09-20
```

Include the retrieval date. Public postings get replaced without notice, and a
date is what tells the next contributor whether to re-check.

For anything confirmed by phone or in person, say so and date it. That is a
legitimate source — it just cannot be re-checked by a reader, so it needs to be
labelled as what it is.

## If a portal is down or empty

Both the FDP Portal and COA have had gaps. When a record cannot be retrieved:

1. Note the attempt and the date on the page's to-do, not on the page itself.
2. Try the municipality directly — an FOI request under Executive Order No. 2
   (s. 2016) is a legitimate route, filed at <https://www.foi.gov.ph/>.
3. Leave the page as a stub until a record arrives. An empty page is a correct
   page.

## When something is wrong

Corrections are the most valuable contribution this project takes. Open an issue
or a pull request; see the repository README. If a published figure is disputed
and cannot be re-sourced quickly, remove it while it is being checked rather than
leaving it up with a caveat.
