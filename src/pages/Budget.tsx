import { useEffect, useState } from 'react';
import { AlertTriangle, ExternalLink, Wallet } from 'lucide-react';
import SEO from '../components/SEO';

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
                  {PROGRAMS[r.dataset]}
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
                  {r.department}
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
  const gaaTotals = GAA_YEARS.map(y => ({
    year: y,
    php: gaaInTown.reduce((sum, r) => sum + (r.years[y]?.amount ?? 0), 0),
  }));

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
          <section className="container mx-auto px-4 py-12">
            <SectionHeading eyebrow="FY 2027" title="Projects in Carigara" />
            <p className="mb-6 max-w-3xl text-gray-700">
              Every line in the DPWH, farm-to-market road, health facility and
              irrigation lists whose title names Carigara. A project listed in
              only one version is a lead to check, not a confirmed insertion or
              deletion.
            </p>
            <ProjectTable rows={inTown} />
          </section>

          {throughRoads.length > 0 && (
            <section className="bg-gray-50">
              <div className="container mx-auto px-4 py-12">
                <SectionHeading
                  eyebrow="FY 2027"
                  title="Roads that pass through Carigara"
                />
                <p className="mb-6 max-w-3xl text-gray-700">
                  These lines name Carigara only as part of a road's name, such
                  as the Palo–Carigara–Ormoc Road. Most of these sections and
                  bridges lie in other towns, so they are listed apart and not
                  counted as Carigara's.
                </p>
                <ProjectTable rows={throughRoads} />
              </div>
            </section>
          )}

          <section className="container mx-auto px-4 py-12">
            <SectionHeading
              eyebrow="DPWH, 2020–2027"
              title={data.district.label}
            />
            <p className="mb-6 max-w-3xl text-gray-700">
              Carigara is in Leyte's 2nd District, represented by{' '}
              {data.district.representative.name}. Its DPWH office builds for
              every town in the district, not Carigara alone, so these are
              district-wide figures. Each year is shown on its own and never
              added together.
            </p>
            {data.district.offices.map(office => (
              <div
                key={office.name}
                className="mb-6 overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="px-4 pt-4">
                  <h3 className="font-semibold text-gray-900">{office.name}</h3>
                  <p className="text-xs text-gray-500">{office.tier_text}</p>
                </div>
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
                        <td className="px-4 py-2 text-gray-600">{y.scope}</td>
                        <td className="px-4 py-2 text-right tabular-nums">
                          {amount(y.php)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
          </section>

          <section className="bg-gray-50">
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
                  <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                    {gaaTotals.map(t => (
                      <div
                        key={t.year}
                        className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                      >
                        <p className="text-sm font-medium text-gray-500">
                          {t.year}
                        </p>
                        <p className="mt-1 font-bold tabular-nums text-primary-700">
                          {t.php > 0 ? amount(t.php) : '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                  <GaaTable rows={gaaInTown} />
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

          <section>
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
