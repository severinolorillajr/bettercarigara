import * as yaml from 'js-yaml';
import directoryYaml from './directory.yaml?raw';

export interface Office {
  name: string;
  phones: string[];
  email?: string;
  emergency?: string; // short label for the call strip
  source?: string;
}

export const directory = yaml.load(directoryYaml) as {
  source: { label: string; retrieved: string };
  offices: Office[];
};

// (053) 888-2903 -> tel:+63538882903, 0918-907-5919 -> tel:+639189075919
export const telHref = (phone: string) =>
  `tel:+63${phone.replace(/\D/g, '').replace(/^0/, '')}`;
