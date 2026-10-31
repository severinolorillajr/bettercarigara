import { useEffect, useState } from 'react';
import { AlertTriangle, ExternalLink, Wallet } from 'lucide-react';
import SEO from '../components/SEO';
import {
  ColumnChart,
  Legend,
  StatTile,
  type Column,
} from '../components/budget/Charts';
import { compact } from '../lib/utils';

// Enacted = categorical slot 1; the 2027 versions take a lighter step of the
// same blue (step 250), so they read as related but not the same thing.
const ENACTED = '#2a78d6';
const PROPOSED = '#86b6ef';

// Every figure on this page comes live from the BetterGov.ph Budget API, the
// data behind budget.bettergov.ph. Rules kept from bettergovph/transparency-portal:
// a dash means "no such line", never zero; the NEP and the House bill are two
// versions of one budget, compared and never added; the API's own notice and
// disclaimers are printed as they come.
const API = 'https://budget.bettergov.ph/api/v1/hgab/2027';
const DISTRICT = 'leg:leyte:2nd';
const PLACE = 'Carigara';

const PROGRAMS = {
  dpwh: 'DPWH',
  fmr: 'Farm-to-market roads',
  hfep: 'Health facilities',
  nia: 'Irrigation',
} as const;

// ponytail: the API finds lines by title text, not by town. A title that only
// uses "Carigara" inside a road's name (Palo-Carigara-Ormoc Rd, or
// "Palo - Carigara - Ormoc" in the GAA) is a road running through, mostly
// outside, the town. Switch to the API's place filter once it exists
// (transparency-portal docs/api.md#gaps).
const THROUGH_ROAD = /-\s*Carigara\s*(-|Rd|Road|National Road)/;

const GAA = 'https://budget.bettergov.ph/api/v1/gaa';
const GAA_YEARS = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];

type GaaRow = {
  fam_key: string;
  name: string;
  department: string;
  years: Record<string, { amount: number }>;
};

// The GAA has no place filter, and /gaa/search stops at 100 results, so every
// department's programs are searched by name (as transparency-portal does).
async function loadGaa(): Promise<GaaRow[]> {
  const departments = await get(`${GAA}/departments`);
  const lists = await Promise.all(
    (departments.data as { id: string }[]).map(d =>
      // ponytail: one page of 500 per department; DPWH matches ~200.
      get(`${GAA}/departments/${d.id}/programs?q=${PLACE}&limit=500`)
    )
  );
  return lists.flatMap(l => l.data as GaaRow[]);
}

// A year counts only where its amount is above zero: the API carries a
// project's lines into later years at ₱0.
const funded = (r: GaaRow) => GAA_YEARS.filter(y => r.years[y]?.amount > 0);

// Categorical slots 1-6 of the dataviz reference palette, in its fixed order
// (validated for adjacent CVD separation). Color follows the category.
const CATEGORIES = [
  { key: 'roads', name: 'Roads & bridges', color: '#2a78d6' },
  { key: 'flood', name: 'Flood control & drainage', color: '#eb6834' },
  { key: 'buildings', name: 'Buildings & facilities', color: '#1baf7a' },
  { key: 'water', name: 'Water & power', color: '#eda100' },
  { key: 'health', name: 'Health', color: '#e87ba4' },
  { key: 'other', name: 'Studies & other', color: '#008300' },
] as const;
type Category = (typeof CATEGORIES)[number];

// ponytail: sorted by title keywords, first match wins. Good enough for ~30
// lines; a line that lands wrong gets a keyword here.
const RULES: [Category['key'], RegExp][] = [
  ['other', /feasibility|stud(y|ies)/i],
  ['health', /hospital|health/i],
  ['flood', /flood|embankment|drainage|seawall|revetment/i],
  ['water', /water|solar|electri|light/i],
  ['buildings', /building|covered court|school|arch|facility|hall|gym/i],
  ['roads', /road|bridge|\bbr\.|street|concret|fmr|chainage/i],
];

const categorize = (title: string): Category => {
  const key = RULES.find(([, re]) => re.test(title))?.[0] ?? 'other';
  return CATEGORIES.find(c => c.key === key)!;
};

function TypeBadge({ title }: { title: string }) {
  const c = categorize(title);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-2 w-2 rounded-sm"
        style={{ backgroundColor: c.color }}
        aria-hidden
      />
      {c.name}
    </span>
  );
}

type Row = {
  id: string;
  dataset: keyof typeof PROGRAMS;
  title: string;
  pap: string | null;
  region_key: string | null;
  status_label: string;
  nep_php: number | null;
  house_php: number | null;
  pdf_url: { nep?: string; hgab3?: string; hgab2?: string };
  url: string;
};

type Year = {
  fy: number;
  stage: string;
  stage_label: string;
  scope: string;
  php: number | null;
};

type Office = { name: string; tier_text: string; years: Year[] };

type District = {
  label: string;
  url: string;
  representative: { name: string };
  offices: Office[];
};

type Disclaimer = { id: string; title: string; body: string; url: string };

type Data = {
  rows: Row[];
  district: District;
  notice: string;
  disclaimers: Disclaimer[];
};

async function get(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function load(): Promise<Data> {
  const [district, ...lists] = await Promise.all([
    get(`${API}/districts/${DISTRICT}`),
    // ponytail: one page of 200 per program; Carigara matches ~25 lines.
    ...Object.keys(PROGRAMS).map(p =>
      get(`${API}/datasets/${p}/projects?q=${PLACE}&limit=200`)
    ),
  ]);
  const rows = lists
    .flatMap(l => l.data.rows as Row[])
    // Keep Region VIII; irrigation lines carry no region, so keep those too.
    .filter(r => !r.region_key || r.region_key === 'VIII');
  return {
    rows,
    district: district.data,
    notice: lists[0].meta.notice,
    disclaimers: lists[0].disclaimers,
  };
}

const peso = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});
const amount = (php: number | null) => (php == null ? '—' : peso.format(php));

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
        {eyebrow}
      </p>
      <h2 className="mt-1 mb-4 text-2xl font-bold md:text-3xl">{title}</h2>
    </>
  );
}

function SourceLink({ href, label }: { href?: string; label: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="whitespace-nowrap text-primary-600 hover:text-primary-700"
    >
      {label} p.
    </a>
  );
}

function ProjectTable({ rows }: { rows: Row[] }) {
  const sorted = [...rows].sort(
    (a, b) => (b.house_php ?? b.nep_php ?? 0) - (a.house_php ?? a.nep_php ?? 0)
  );
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">Project</th>
            <th className="px-4 py-3 text-right">NEP</th>
            <th className="px-4 py-3 text-right">House bill</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map(r => (
            <tr key={`${r.dataset}:${r.id}`} className="align-top">
              <td className="px-4 py-3">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-gray-900 hover:text-primary-700"
                >
                  {r.title}
                </a>
                <div className="mt-0.5 text-xs text-gray-500">
                  <TypeBadge title={r.title} /> · {PROGRAMS[r.dataset]}
                  {r.pap && ` · ${r.pap}`}
                </div>
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {amount(r.nep_php)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {amount(r.house_php)}
              </td>
              <td className="px-4 py-3 text-gray-700">{r.status_label}</td>
              <td className="space-x-2 px-4 py-3 text-xs">
                <SourceLink href={r.pdf_url.nep} label="NEP" />
                <SourceLink
                  href={r.pdf_url.hgab3 ?? r.pdf_url.hgab2}
                  label="HB"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GaaTable({ rows }: { rows: GaaRow[] }) {
  const latest = (r: GaaRow) => funded(r).at(-1) ?? '';
  const sorted = [...rows].sort((a, b) => latest(b).localeCompare(latest(a)));
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">Program or project</th>
            <th className="px-4 py-3">Enacted</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map(r => (
            <tr key={r.fam_key} className="align-top">
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{r.name}</div>
                <div className="mt-0.5 text-xs text-gray-500">
                  <TypeBadge title={r.name} /> · {r.department}
                </div>
              </td>
              <td className="px-4 py-3 tabular-nums whitespace-nowrap">
                {funded(r).map(y => (
                  <div key={y}>
                    <span className="text-gray-500">{y}</span>{' '}
                    {amount(r.years[y].amount)}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Budget() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gaa, setGaa] = useState<GaaRow[] | null>(null);
  const [gaaError, setGaaError] = useState<string | null>(null);
  const [cat, setCat] = useState<Category['key'] | null>(null);

  useEffect(() => {
    load()
      .then(setData)
      .catch(e => setError(String(e)));
    loadGaa()
      .then(setGaa)
      .catch(e => setGaaError(String(e)));
  }, []);

  const inTown = data?.rows.filter(r => !THROUGH_ROAD.test(r.title)) ?? [];
  const throughRoads = data?.rows.filter(r => THROUGH_ROAD.test(r.title)) ?? [];
  // Lines with no funded year (₱0 throughout) are dropped.
  const gaaRows = gaa?.filter(r => funded(r).length > 0) ?? [];
  const gaaInTown = gaaRows.filter(r => !THROUGH_ROAD.test(r.name));
  const gaaRoads = gaaRows.filter(r => THROUGH_ROAD.test(r.name));
  // Totals per year are of one enacted budget each; years are never added.
  const yearTotal = (rows: GaaRow[], y: string) =>
    rows.reduce((sum, r) => sum + (r.years[y]?.amount ?? 0), 0);
  const peak = gaa
    ? GAA_YEARS.map(y => ({ y, php: yearTotal(gaaInTown, y) })).sort(
        (a, b) => b.php - a.php
      )[0]
    : undefined;
  const gaaShown = cat
    ? gaaInTown.filter(r => categorize(r.name).key === cat)
    : gaaInTown;
  const gaaColumns: Column[] = GAA_YEARS.map(y => ({
    label: y,
    parts: CATEGORIES.map(c => ({
      name: c.name,
      color: c.color,
      value: yearTotal(
        gaaShown.filter(r => categorize(r.name).key === c.key),
        y
      ),
    })),
  }));
  const gaaCounts = CATEGORIES.map(c => ({
    ...c,
    count: gaaInTown.filter(r => categorize(r.name).key === c.key).length,
  })).filter(c => c.count > 0);

  // Within one version, lines add up; the two versions are compared.
  const sum = (php: (r: Row) => number | null) =>
    inTown.reduce((s, r) => s + (php(r) ?? 0), 0);
  const byStatus = [...new Set(inTown.map(r => r.status_label))].map(label => {
    const rows = inTown.filter(r => r.status_label === label);
    return {
      label,
      count: rows.length,
      nep: rows.reduce((s, r) => s + (r.nep_php ?? 0), 0),
      house: rows.reduce((s, r) => s + (r.house_php ?? 0), 0),
    };
  });
  const office = data?.district.offices[0];

  return (
    <main className="flex-grow">
      <SEO
        title="Budget"
        description="National budget lines that name Carigara, Leyte: the FY 2027 NEP compared with House Bill 10858, and the enacted budgets of 2020 to 2026."
      />

      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <Wallet className="mb-4 h-10 w-10 text-primary-200" />
          <h1 className="text-3xl font-extrabold md:text-5xl">
            Carigara in the national budget
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            National budget projects that name Carigara: the 2027 proposal (NEP)
            compared with the House's version (House Bill 10858), and what the
            enacted budgets of 2020 to 2026 gave.
          </p>
        </div>
      </section>

      {error && (
        <section className="container mx-auto px-4 py-12">
          <p className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
            The budget data could not be loaded ({error}). Try again later, or
            see{' '}
            <a
              href="https://budget.bettergov.ph/hgab/2027/overview"
              className="font-semibold underline"
            >
              budget.bettergov.ph
            </a>
            .
          </p>
        </section>
      )}

      {!data && !error && (
        <p className="container mx-auto px-4 py-12 text-gray-500">
          Loading budget data…
        </p>
      )}

      {data && (
        <>
          <section className="container mx-auto px-4 pt-12">
            <SectionHeading eyebrow="At a glance" title="The numbers" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label="2027 House bill, in Carigara"
                value={compact.format(sum(r => r.house_php))}
                note={`${inTown.filter(r => r.house_php).length} projects`}
              />
              <StatTile
                label="2027 proposal (NEP), in Carigara"
                value={compact.format(sum(r => r.nep_php))}
                note={`${inTown.filter(r => r.nep_php).length} projects`}
              />
              <StatTile
                label="Biggest enacted year, 2020–2026"
                value={peak ? compact.format(peak.php) : '…'}
                note={peak ? `in ${peak.y}` : 'Loading…'}
              />
              {office && (
                <StatTile
                  label="DPWH district office, 2026"
                  value={compact.format(
                    office.years.find(y => y.fy === 2026)?.php ?? 0
                  )}
                  note="for the whole 2nd District"
                />
              )}
            </div>
          </section>

          <section className="container mx-auto px-4 py-12">
            <SectionHeading
              eyebrow="FY 2027"
              title="What changed between the two versions"
            />
            <p className="mb-6 max-w-3xl text-gray-700">
              The President proposes the budget (NEP); the House then passes its
              own version (House Bill 10858). These are the projects whose title
              names Carigara, grouped by what the House did with them. A project
              in only one version is a lead to check, not a confirmed insertion
              or deletion.
            </p>
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              {byStatus.map(s => (
                <div
                  key={s.label}
                  className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <p className="font-semibold text-gray-900">{s.label}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {s.count} {s.count === 1 ? 'project' : 'projects'}
                  </p>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <dt className="text-xs text-gray-500">NEP</dt>
                      <dd className="font-semibold">
                        {s.nep ? compact.format(s.nep) : '—'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">House bill</dt>
                      <dd className="font-semibold">
                        {s.house ? compact.format(s.house) : '—'}
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
            <ProjectTable rows={inTown} />
            {throughRoads.length > 0 && (
              <details className="mt-6">
                <summary className="cursor-pointer font-semibold text-primary-600 hover:text-primary-700">
                  Also {throughRoads.length} lines on roads that pass through
                  Carigara (not counted above)
                </summary>
                <p className="my-4 max-w-3xl text-sm text-gray-700">
                  These lines name Carigara only as part of a road's name, such
                  as the Palo–Carigara–Ormoc Road. Most of these sections and
                  bridges lie in other towns.
                </p>
                <ProjectTable rows={throughRoads} />
              </details>
            )}
          </section>

          <section className="bg-gray-50">
            <div className="container mx-auto px-4 py-12">
              <SectionHeading
                eyebrow="DPWH, 2020–2027"
                title={data.district.label}
              />
              <p className="mb-6 max-w-3xl text-gray-700">
                Carigara is in Leyte's 2nd District, represented by{' '}
                {data.district.representative.name.replace(/\.$/, '')}. Its DPWH
                office builds for every town in the district, not Carigara
                alone, so these are district-wide figures. Each year is shown on
                its own and never added together.
              </p>
              {data.district.offices.map(office => (
                <div
                  key={office.name}
                  className="mb-6 overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm"
                >
                  <div className="px-4 pt-4">
                    <h3 className="font-semibold text-gray-900">
                      {office.name}
                    </h3>
                    <p className="text-xs text-gray-500">{office.tier_text}</p>
                  </div>
                  <div className="space-y-4 p-4">
                    <Legend
                      items={[
                        { name: 'Enacted budget (GAA)', color: ENACTED },
                        { name: '2027 versions, not yet law', color: PROPOSED },
                      ]}
                    />
                    <ColumnChart
                      columns={office.years.map(y => ({
                        label:
                          y.stage === 'gaa'
                            ? String(y.fy)
                            : `${y.fy} ${y.stage === 'nep' ? 'NEP' : 'House*'}`,
                        parts: [
                          {
                            name: y.stage_label,
                            value: y.php ?? 0,
                            color: y.stage === 'gaa' ? ENACTED : PROPOSED,
                          },
                        ],
                      }))}
                    />
                    <p className="text-xs text-gray-500">
                      * The House bill figure counts named projects only; the
                      NEP and enacted figures cover the whole office.
                    </p>
                  </div>
                  <details className="px-4 pb-4">
                    <summary className="cursor-pointer text-sm font-semibold text-primary-600 hover:text-primary-700">
                      Show as a table
                    </summary>
                    <table className="mt-2 w-full text-left text-sm">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                          <th className="px-4 py-3">Year</th>
                          <th className="px-4 py-3">Version</th>
                          <th className="px-4 py-3">Covers</th>
                          <th className="px-4 py-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {office.years.map(y => (
                          <tr key={`${y.fy}:${y.stage}`}>
                            <td className="px-4 py-2">{y.fy}</td>
                            <td className="px-4 py-2">{y.stage_label}</td>
                            <td className="px-4 py-2 text-gray-600">
                              {y.scope}
                            </td>
                            <td className="px-4 py-2 text-right tabular-nums">
                              {amount(y.php)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </details>
                </div>
              ))}
              <a
                href={data.district.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700"
              >
                The full district on budget.bettergov.ph
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </section>

          <section>
            <div className="container mx-auto px-4 py-12">
              <SectionHeading
                eyebrow="Enacted budgets, 2020–2026"
                title="What past budgets gave Carigara"
              />
              <p className="mb-6 max-w-3xl text-gray-700">
                Every program or project, in any department, whose name names
                Carigara in the General Appropriations Act of each year. These
                are appropriations, the authority to spend, not spending.
              </p>
              {gaaError && (
                <p className="text-red-700">
                  The 2020–2026 budgets could not be loaded ({gaaError}).
                </p>
              )}
              {!gaa && !gaaError && (
                <p className="text-gray-500">Searching every department…</p>
              )}
              {gaa && (
                <>
                  <div
                    className="mb-6 flex flex-wrap gap-2"
                    role="group"
                    aria-label="Filter by type"
                  >
                    {[
                      { key: null, name: 'All types', count: gaaInTown.length },
                      ...gaaCounts,
                    ].map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setCat(c.key)}
                        aria-pressed={cat === c.key}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition ${
                          cat === c.key
                            ? 'border-primary-600 bg-primary-600 text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
                        }`}
                      >
                        {'color' in c && (
                          <span
                            className="h-2.5 w-2.5 rounded-sm ring-1 ring-white"
                            style={{ backgroundColor: c.color }}
                            aria-hidden
                          />
                        )}
                        {c.name}
                        <span className="opacity-70">{c.count}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mb-6 space-y-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <h3 className="font-semibold text-gray-900">
                      Enacted for Carigara, by year and type
                    </h3>
                    <Legend
                      items={CATEGORIES.filter(
                        c => !cat || c.key === cat
                      ).filter(c => gaaCounts.some(g => g.key === c.key))}
                    />
                    <ColumnChart columns={gaaColumns} />
                    <p className="text-xs text-gray-500">
                      Each year is its own budget; the years are not added
                      together. Hover a block for its amount; every line is in
                      the table below.
                    </p>
                  </div>
                  <GaaTable rows={gaaShown} />
                  {gaaRoads.length > 0 && (
                    <details className="mt-6">
                      <summary className="cursor-pointer font-semibold text-primary-600 hover:text-primary-700">
                        Also {gaaRoads.length} lines on roads that pass through
                        Carigara (not counted above)
                      </summary>
                      <div className="mt-4">
                        <GaaTable rows={gaaRoads} />
                      </div>
                    </details>
                  )}
                </>
              )}
            </div>
          </section>

          <section className="bg-gray-50">
            <div className="container mx-auto px-4 py-12">
              <SectionHeading
                eyebrow="About the data"
                title="Read this first"
              />
              <div className="flex gap-4 rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
                <AlertTriangle className="h-6 w-6 shrink-0 text-amber-500" />
                <div className="space-y-3 text-sm">
                  <p>
                    Amounts are the figures published in the 2027 NEP and House
                    Bill 10858, not actual spending. A dash means the document
                    has no such line. The 2020–2026 amounts are enacted
                    appropriations; each year stands on its own, and the 2027
                    versions are never added to them.
                  </p>
                  <p>{data.notice}</p>
                  {data.disclaimers.map(d => (
                    <p key={d.id}>
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold underline"
                      >
                        {d.title}
                      </a>{' '}
                      {d.body}
                    </p>
                  ))}
                  <p>
                    Source: the{' '}
                    <a
                      href="https://budget.bettergov.ph/docs"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold underline"
                    >
                      BetterGov.ph Budget API
                    </a>
                    , loaded live when you open this page.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
