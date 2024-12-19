import { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import { GameDetails, columns } from './columns';
import { useTranslation } from 'react-i18next';
import { getHistory } from '@/api/history.ts';

export const History = () => {
  const { t } = useTranslation('history');
  const [data, setData] = useState<GameDetails[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const history = await getHistory();
      setData(history);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div>
      <p className="mt-10 mx-10 text-3xl text-castled-accent">{t('title')}</p>
      <div className="container mx-auto py-10 px-10 content-center">
        <DataTable columns={columns} data={data || []} />
      </div>
    </div>
  );
};
