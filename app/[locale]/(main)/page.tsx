import React from "react";
import { getTranslations } from 'next-intl/server';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Droplets, 
  Sprout, 
  Recycle, 
  Mountain,
  ArrowRight 
} from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const t = await getTranslations();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/pexels-berend-1452701.jpg"
            alt="Eco-friendly dry toilet"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/70 to-green-900/70 z-1"></div>

        {/* Content */}
        <div className="container px-4 mx-auto relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto text-green-50">
            {t('home.hero.description')}
          </p>
          
          {/* Search Component */}
          <div className="flex justify-center mb-8">
            <Link href="/map">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Explorar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <ArrowRight className="h-6 w-6 text-white transform rotate-90" />
        </div>
      </section>

      {/* Description Content */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          {/* What are dry toilets */}
          <div>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
              {t('home.hero.platformDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-50 dark:bg-green-900 py-16">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-900 dark:text-green-50 mb-6">
            {t('home.sections.cta.title')}
          </h2>
          <p className="text-lg text-green-800 dark:text-green-100 mb-8 max-w-2xl mx-auto">
            {t('home.sections.cta.description')}
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              {t('common.signUpNow')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          {/* What are dry toilets */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('home.sections.whatIs.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('home.sections.whatIs.content')}
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              {t('home.sections.benefits.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.raw('home.sections.benefits.list').map((benefit: string, index: number) => {
                const icons = [
                  <Droplets key="1" className="h-8 w-8 text-blue-500" />,
                  <Sprout key="2" className="h-8 w-8 text-green-500" />,
                  <Recycle key="3" className="h-8 w-8 text-yellow-500" />,
                  <Mountain key="4" className="h-8 w-8 text-purple-500" />
                ];

                return (
                  <div key={index} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {icons[index]}
                    <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                      {benefit}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How it works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('home.sections.howWorks.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('home.sections.howWorks.content')}
            </p>
          </div>

          {/* Additional Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('home.sections.maintenance.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t('home.sections.maintenance.content')}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('home.sections.differences.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t('home.sections.differences.content')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export const metadata = {
  title: 'Home'
}
