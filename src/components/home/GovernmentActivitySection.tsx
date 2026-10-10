import Section from '../ui/Section';
import * as LucideIcons from 'lucide-react';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { useTranslation } from '../../hooks/useTranslation';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Link } from 'react-router';

import { governmentCategories } from '../../data/yamlLoader';

interface Subcategory {
  name: string;
  slug: string;
}

interface Category {
  category: string;
  slug: string;
  subcategories: Subcategory[];
  description: string;
  icon: string;
}

interface GovernmentActivitySectionProps {
  title?: string;
  description?: string;
}

export default function GovernmentActivitySection({
  title,
  description,
}: GovernmentActivitySectionProps = {}) {
  const { t } = useTranslation();

  const getIcon = (category: string) => {
    const IconComponent = LucideIcons[
      category as keyof typeof LucideIcons
    ] as React.ComponentType<{ className?: string }>;
    return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
  };

  const displayedCategories = governmentCategories.categories as Category[];

  return (
    <Section id="government" className="bg-gray-50">
      <Heading level={2} className="mb-2">
        {title || t('title')}
      </Heading>
      <Text className="text-gray-600 mb-6">
        {description || t('governmentActivity.description')}
      </Text>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedCategories.map(category => (
          <Card
            key={category.slug}
            hoverable
            className="group h-full overflow-hidden rounded-xl border border-gray-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl"
          >
            <Link
              to={`/government/${category.slug}`}
              className="mt-auto text-primary-600 hover:text-primary-700 font-medium transition-colors inline-flex items-center"
            >
              <CardContent className="flex flex-col h-full p-6">
                <div className="flex gap-2">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white p-3 rounded-lg mb-4 self-start shadow-md shadow-primary-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    {getIcon(category.icon)}
                  </div>

                  <h3 className="text-lg font-semibold mb-4 text-gray-900 self-center transition-colors group-hover:text-primary-600">
                    {category.category}
                  </h3>
                </div>
                <Text className="text-gray-600">{category.description}</Text>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </Section>
  );
}
