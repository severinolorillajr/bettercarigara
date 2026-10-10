import { Link } from 'react-router';
import {
  AlertTriangle,
  BookOpen,
  Code2,
  Eye,
  Flag,
  GitFork,
  HandHeart,
  Landmark,
  Search,
  Share2,
  ShieldCheck,
  Target,
} from 'lucide-react';
import SEO from '../components/SEO';

const REPO = 'https://github.com/severinolorillajr/bettercarigara';
const ISSUES = `${REPO}/issues/new`;
const PROFILE = '/government/departments/municipality-profile';
const MANDATE = '/government/departments/mandate-vision-and-mission';

// Verbatim from content/government/departments/mandate-vision-and-mission.md —
// change them there first, then here.
const LGU_STATEMENTS = [
  {
    title: 'Vision',
    text: 'CARIGARA is center of competitive trade and industry in the Northern part of Leyte with empowered and God-loving citizenry enjoying a self-sufficient local economy in an ecologically-balanced environment with quality and essential support infrastructure under a transparent, accountable, responsive, committed, and competent leadership.',
  },
  {
    title: 'Mission',
    text: 'The Local Governance of Carigara in partnership with the people shall provide development opportunities, ensure public safety and proper management of resources, promote programs for economic and political stability and create a venue for socio-cultural upliftment towards the attainment of quality of life for Kalgaran-ons.',
  },
];

// Figures from content/government/departments/municipality-profile.md —
// change them there first, then here.
const STATS = [
  {
    label: 'Population',
    value: '56,060',
    source: 'PSA 2024 Census, via Wikipedia (second source pending)',
  },
  {
    label: 'Land area',
    value: '117.86 km²',
    source: 'PSA, via Wikipedia and PhilAtlas',
  },
  { label: 'Barangays', value: '49', source: 'Wikipedia and PhilAtlas' },
];

const PROJECT = [
  {
    icon: Target,
    title: 'Our mission',
    text: 'Make local government information easy to find and easy to act on — what a service needs, where to go, who to call.',
  },
  {
    icon: Search,
    title: 'How it works',
    text: "We republish public records: the LGU's Citizen's Charter, PSA census data, COA audit reports and the LGU's own postings. Every page names its sources and the date they were retrieved.",
  },
  {
    icon: Code2,
    title: 'Open source',
    text: 'All of the code and content is public on GitHub. Anyone can read it, check it or improve it.',
    link: { href: REPO, label: 'View on GitHub' },
  },
  {
    icon: ShieldCheck,
    title: 'Independent',
    text: 'This is not an official website of the Municipality of Carigara and is not affiliated with the LGU.',
  },
  {
    icon: HandHeart,
    title: 'Volunteer-run',
    text: 'Built by volunteers under the BetterGov.ph initiative, with no government funding. Cost to the people of Carigara: ₱0.',
  },
];

const INVOLVED = [
  {
    icon: Flag,
    title: 'Report incorrect information',
    text: 'A wrong number or outdated fee? Tell us and we will check it against the source.',
    link: { href: ISSUES, label: 'Report an error' },
  },
  {
    icon: GitFork,
    title: 'Contribute code',
    text: 'Fix a bug, improve a page or add a feature.',
    link: { href: REPO, label: 'Fork on GitHub' },
  },
  {
    icon: Eye,
    title: 'Verify data',
    text: 'Have a public record that confirms or corrects a figure here? Send it in.',
    link: { href: ISSUES, label: 'Submit a source' },
  },
  {
    icon: Share2,
    title: 'Share with residents',
    text: 'The site only helps if people know it exists. Share it with family, neighbours and your barangay.',
  },
];

type Card = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  link?: { href: string; label: string };
};

function CardGrid({
  cards,
  cols = 'lg:grid-cols-3',
}: {
  cards: Card[];
  cols?: string;
}) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${cols}`}>
      {cards.map(({ icon: Icon, title, text, link }) => (
        <div
          key={title}
          className="flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 self-start rounded-lg bg-primary-50 p-2.5 text-primary-600">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{text}</p>
          {link && (
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              {link.label} →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

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
      <h2 className="mt-1 mb-8 text-2xl font-bold md:text-3xl">{title}</h2>
    </>
  );
}

export default function About() {
  return (
    <main className="flex-grow">
      <SEO
        title="About"
        description="About Better Carigara, an independent civic transparency portal for the Municipality of Carigara, Leyte."
      />

      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <Landmark className="mb-4 h-10 w-10 text-primary-200" />
          <h1 className="text-3xl font-extrabold md:text-5xl">
            About Better Carigara
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            An independent civic transparency portal for the Municipality of
            Carigara, Leyte.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <SectionHeading eyebrow="About Carigara" title="The municipality" />
        <p className="mb-8 max-w-3xl text-gray-700">
          Carigara is a 1st class municipality in the 2nd District of Leyte,
          Region VIII — Eastern Visayas.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {STATS.map(stat => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="mt-1 text-3xl font-extrabold text-primary-700">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-gray-500">{stat.source}</p>
            </div>
          ))}
        </div>
        <Link
          to={PROFILE}
          className="mt-6 inline-block font-semibold text-primary-600 hover:text-primary-700"
        >
          Full profile, census history and the 49 barangays →
        </Link>

        <h3 className="mt-12 mb-4 text-xl font-bold">
          The municipal government, in its own words
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {LGU_STATEMENTS.map(({ title, text }) => (
            <figure
              key={title}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <figcaption className="mb-2 font-semibold text-gray-900">
                {title}
              </figcaption>
              <blockquote className="text-sm text-gray-600">
                “{text}”
              </blockquote>
            </figure>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Quoted from the LGU Carigara Citizen's Charter 2026, pp. II–III.
        </p>
        <Link
          to={MANDATE}
          className="mt-4 inline-block font-semibold text-primary-600 hover:text-primary-700"
        >
          Mandate, vision, mission and service pledge →
        </Link>
      </section>

      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <SectionHeading
            eyebrow="History & heritage"
            title="Carigara through the years"
          />
          <div className="flex gap-4 rounded-xl border border-dashed border-gray-300 bg-white p-6">
            <BookOpen className="h-6 w-6 shrink-0 text-gray-400" />
            <div>
              <p className="font-semibold text-gray-900">Not yet written.</p>
              <p className="mt-1 text-sm text-gray-600">
                We only publish history we can cite. If you have a sourced
                account of Carigara's founding, its festivals or its past — a
                book, a municipal publication, a historical marker — please send
                it in.
              </p>
              <a
                href={ISSUES}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                Share a source →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <SectionHeading
          eyebrow="About the project"
          title="What is Better Carigara?"
        />
        <CardGrid cards={PROJECT} />
      </section>

      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <SectionHeading eyebrow="Help out" title="Get involved" />
          <CardGrid cards={INVOLVED} cols="lg:grid-cols-4" />
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <SectionHeading eyebrow="Disclaimer" title="Important notice" />
        <div className="flex gap-4 rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <AlertTriangle className="h-6 w-6 shrink-0 text-amber-500" />
          <div className="space-y-2 text-sm">
            <p>
              Better Carigara is an independent portal. It is not an official
              website of the Municipality of Carigara and is not affiliated with
              or operated by the LGU or any government agency.
            </p>
            <p>
              Information here comes from public records and community research.
              We cite every source, but we cannot guarantee that everything is
              complete or current.
            </p>
            <p>
              For official transactions and information, contact the
              Municipality of Carigara directly — see the directory at the
              bottom of this page.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
