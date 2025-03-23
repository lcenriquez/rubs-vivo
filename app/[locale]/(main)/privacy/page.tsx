import { getTranslations } from 'next-intl/server';

export default async function PrivacyNoticePage() {
  const t = await getTranslations('privacyNotice');

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        {t('title')}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {t('lastUpdated')}
      </p>

      <div className="prose prose-lg max-w-none">
        <p className="lead mb-8">
          {t('introduction')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('responsibleParty.title')}</h2>
          <p>{t('responsibleParty.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('dataCollected.title')}</h2>
          <p>{t('dataCollected.description')}</p>
          <ul className="mt-4 space-y-2">
            {t.raw('dataCollected.items').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('purposes.title')}</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">{t('purposes.primary.title')}</h3>
            <ul className="space-y-2">
              {t.raw('purposes.primary.items').map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">{t('purposes.secondary.title')}</h3>
            <ul className="space-y-2">
              {t.raw('purposes.secondary.items').map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('rights.title')}</h2>
          <p>{t('rights.description')}</p>
          <p className="mt-2 font-medium">{t('rights.contact')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('dataTransfer.title')}</h2>
          <p>{t('dataTransfer.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('cookies.title')}</h2>
          <p>{t('cookies.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('changes.title')}</h2>
          <p>{t('changes.description')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('consent.title')}</h2>
          <p>{t('consent.description')}</p>
        </section>
      </div>
    </div>
  );
} 