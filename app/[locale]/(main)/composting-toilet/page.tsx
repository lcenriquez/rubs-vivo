import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export default async function CompostingToiletPage() {
  const t = await getTranslations('compostingToilet');

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        {t('title')}
      </h1>

      <div className="prose prose-lg max-w-none">
        <div className="mb-12">
          <p className="text-lg leading-relaxed mb-8">
            {t('introduction')}
          </p>
          
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src="/img/nutrient-cycle.svg"
              alt={t('images.nutrientCycle')}
              fill
              className="object-fit"
            />
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {t('conventionalSystems.title')}
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {t('conventionalSystems.nutrientCycle.title')}
              </h3>
              <p>{t('conventionalSystems.nutrientCycle.description')}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                {t('conventionalSystems.soilDegradation.title')}
              </h3>
              <p>{t('conventionalSystems.soilDegradation.description')}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                {t('conventionalSystems.healthRisks.title')}
              </h3>
              <p>{t('conventionalSystems.healthRisks.description')}</p>
            </div>
          </div>

          <div className="relative w-full h-64 md:h-96 my-8 rounded-lg overflow-hidden">
            <Image
              src="/img/water-pollution.jpg"
              alt={t('images.waterPollution')}
              fill
              className="object-cover"
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {t('solution.title')}
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {t('solution.benefits.title')}
              </h3>
              <p className="mb-4">{t('solution.benefits.description')}</p>
              <p className="italic">{t('solution.benefits.stats')}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                {t('solution.soilHealth.title')}
              </h3>
              <p>{t('solution.soilHealth.description')}</p>
            </div>
          </div>

          <div className="relative w-full h-64 md:h-96 my-8 rounded-lg overflow-hidden">
            <Image
              src="/img/composting-process.jpg"
              alt={t('images.compostingProcess')}
              fill
              className="object-cover"
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {t('future.title')}
          </h2>
          <p>{t('future.description')}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">
            {t('citations.title')}
          </h2>
          <ul className="list-decimal pl-5 space-y-2">
            {[1, 2, 3, 4, 5].map((index) => (
              <li key={index}>
                <a
                  href={t(`citations.${index}.url`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {t(`citations.${index}.text`)}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
