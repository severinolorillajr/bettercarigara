import { Phone, Siren } from 'lucide-react';
import Section from '../ui/Section';
import { directory, telHref } from '../../data/directory';

function PhoneLinks({ phones, light }: { phones: string[]; light?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {phones.map(phone => (
        <a
          key={phone}
          href={telHref(phone)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-sm font-semibold tabular-nums transition ${
            light
              ? 'bg-white text-red-700 hover:bg-red-50'
              : 'bg-primary-50 text-primary-700 group-hover:bg-primary-600 group-hover:text-white'
          }`}
        >
          <Phone className="h-3.5 w-3.5" aria-hidden />
          {phone}
        </a>
      ))}
    </div>
  );
}

export default function DirectorySection() {
  const emergency = directory.offices.filter(o => o.emergency);
  const offices = directory.offices.filter(o => !o.emergency);

  return (
    <Section id="directory" className="bg-gray-50">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
        LGU Directory
      </p>
      <h2 className="mt-1 text-2xl font-bold md:text-3xl lg:text-4xl">
        Who to call
      </h2>
      <p className="mt-2 mb-8 text-gray-600">
        Direct lines to every municipal office. Tap a number to call.
      </p>

      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl bg-gradient-to-br from-red-600 to-red-700 p-6 text-white shadow-lg">
          <Siren className="h-10 w-10 shrink-0" aria-hidden />
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-red-100">
              National emergency hotline
            </p>
            <a
              href="tel:911"
              className="text-4xl font-extrabold hover:underline"
            >
              911
            </a>
          </div>
        </div>
        {emergency.map(office => (
          <div
            key={office.name}
            className="rounded-xl bg-gradient-to-br from-red-600 to-red-700 p-6 text-white shadow-lg"
          >
            <p className="mb-3 font-semibold">{office.name}</p>
            <PhoneLinks phones={office.phones} light />
            {office.email && (
              <a
                href={`mailto:${office.email}`}
                className="mt-3 block break-all text-sm text-red-100 hover:text-white hover:underline"
              >
                {office.email}
              </a>
            )}
          </div>
        ))}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {offices.map(office => (
          <li
            key={office.name}
            className="group flex flex-col justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
          >
            <p className="font-medium text-gray-900">{office.name}</p>
            <PhoneLinks phones={office.phones} />
          </li>
        ))}
      </ul>

      <p className="mt-6 text-xs text-gray-500">
        {`Source: ${directory.source.label}, retrieved ${directory.source.retrieved}.`}{' '}
        {directory.offices
          .filter(o => o.source)
          .map(o => `${o.name}: ${o.source}. `)}
        Numbers may change. If one is wrong, please tell us.
      </p>
    </Section>
  );
}
