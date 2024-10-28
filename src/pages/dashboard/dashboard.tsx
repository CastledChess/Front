import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Overview } from '@/pages/dashboard/overview.tsx';
import { Statistics } from '@/pages/dashboard/statistics.tsx';

export const Dashboard = () => {
  return (
    <div className="w-full h-full p-4">
      <Tabs defaultValue="overview" className="h-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <Overview />
        <Statistics />
      </Tabs>
    </div>
  );
};
