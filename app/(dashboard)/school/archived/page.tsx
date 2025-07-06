"use client";
import React from 'react';
import ArchivedClassroom from '@/components/dashboard/archivedClassroom';
import { useLanguage } from '@/lib/LanguageProvider';

const Archived = () => {
  const { t } = useLanguage();

  return (
    <section className='w-full rounded-2xl bg-white p-7'>
      <div className='flex flex-wrap item center justify-between gap-2'>
        <h2 className='text-xl font-semibold'>{t("archivedClassroom")}</h2>
      </div>
      <div className='pt-5 items-center'>
        <ArchivedClassroom />
      </div>
    </section>
  );
};

export default Archived;