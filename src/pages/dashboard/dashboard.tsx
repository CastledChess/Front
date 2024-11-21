import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Overview } from '@/pages/dashboard/overview.tsx';
import { Statistics } from '@/pages/dashboard/statistics.tsx';
import { useTranslation } from 'react-i18next';

export const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full p-4">
      <Tabs defaultValue="overview" className="h-full">
        <TabsList>
          <TabsTrigger value="overview">{t('analysis')}</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <Overview />
        <Statistics />
      </Tabs>
    </div>
  );
};
