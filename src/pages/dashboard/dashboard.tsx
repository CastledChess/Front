import { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import { GameDetails, columns } from './columns';
import { useTranslation } from 'react-i18next';
import { getHistory } from '@/api/history.ts';

export const Dashboard = () => {
  const { t } = useTranslation('history');
  const [data, setData] = useState<GameDetails[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const history = await getHistory();
      setData(history as GameDetails[]);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="container mx-auto p-10 flex flex-col gap-4 content-center">
      <p className="mt-10 text-4xl">{t('title')}</p>
      <DataTable columns={columns} data={data || []} />
    </div>
  );
};
