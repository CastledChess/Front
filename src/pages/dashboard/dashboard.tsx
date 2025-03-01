import { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useTranslation } from 'react-i18next';
import { getHistory } from '@/api/history.ts';
import { useHistoryState } from '@/store/history.ts';
import { Analysis } from '@/types/analysis.ts';

/**
 * Dashboard component that fetches and displays game history data.
 *
 * This component uses the `useTranslation` hook to handle translations
 * and the `useState` and `useEffect` hooks to manage state and side effects.
 * It fetches game history data asynchronously and displays a loading message
 * while the data is being fetched. Once the data is fetched, it displays
 * the data in a table format.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered component.
 */
export const Dashboard = () => {
  const { t } = useTranslation('history');
  const { analyses, setAnalyses } = useHistoryState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const history = await getHistory();
      setAnalyses(history as Analysis[]);
      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <div className="w-full h-full p-16 flex justify-center">
      <div className="container flex flex-col gap-4 overflow-y-auto">
        <p className="text-4xl">{t('title')}</p>
        <DataTable isLoading={loading} columns={columns} data={analyses || []} />
      </div>
    </div>
  );
};
