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
    <div className="w-full h-full p-16 flex content-center">
      <div className="container flex flex-col gap-4 overflow-y-auto">
        <p className="text-4xl">{t('title')}</p>
        <DataTable columns={columns} data={data || []} />
      </div>
    </div>
  );
};
