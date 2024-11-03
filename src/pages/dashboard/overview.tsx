import { TabsContent } from '@/components/ui/tabs.tsx';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card.tsx';
import { Activity, Crosshair, Goal, ChevronsUp } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx';

const data = [
  {
    name: 'Jan',
    total: Math.floor(Math.random() * 30) + 40,
  },
  {
    name: 'Feb',
    total: Math.floor(Math.random() * 30) + 40,
  },
  {
    name: 'Mar',
    total: Math.floor(Math.random() * 30) + 40,
  },
  {
    name: 'Apr',
    total: Math.floor(Math.random() * 30) + 40,
  },
  {
    name: 'May',
    total: Math.floor(Math.random() * 30) + 40,
  },
  {
    name: 'Jun',
    total: Math.floor(Math.random() * 30) + 40,
  },
  {
    name: 'Jul',
    total: Math.floor(Math.random() * 30) + 40,
  },
  {
    name: 'Aug',
    total: Math.floor(Math.random() * 30) + 40,
  },
  {
    name: 'Sep',
    total: Math.floor(Math.random() * 30) + 40,
  },
  {
    name: 'Oct',
    total: Math.floor(Math.random() * 30) + 40,
  },
  {
    name: 'Nov',
    total: Math.floor(Math.random() * 30) + 40,
  },
  {
    name: 'Dec',
    total: Math.floor(Math.random() * 30) + 40,
  },
];

export const Overview = () => {
  return (
    <TabsContent value="overview" className="flex flex-col gap-4 h-[calc(100%-3rem)]">
      <div className="w-full flex gap-6 h-max">
        <Card className="p-6 flex flex-col gap-3 w-1/4">
          <CardHeader className="p-0 flex flex-row justify-between">
            Total Analyses <Activity height={20} />
          </CardHeader>

          <CardContent className="p-0 flex flex-col">
            <span className="font-bold text-2xl">456</span>
            <span className="font-thin text-sm">+54 last month</span>
          </CardContent>
        </Card>

        <Card className="p-6 flex flex-col gap-3 w-1/4">
          <CardHeader className="p-0 flex flex-row justify-between">
            Average Accuracy <Crosshair height={20} />
          </CardHeader>

          <CardContent className="p-0 flex flex-col">
            <span className="font-bold text-2xl">68.2%</span>
            <span className="font-thin text-sm">+1.2% last month</span>
          </CardContent>
        </Card>

        <Card className="p-6 flex flex-col gap-3 w-1/4">
          <CardHeader className="p-0 flex flex-row justify-between">
            Achievements <Goal height={20} />
          </CardHeader>

          <CardContent className="p-0 flex flex-col">
            <span className="font-bold text-2xl">40%</span>
            <span className="font-thin text-sm">80/200</span>
          </CardContent>
        </Card>

        <Card className="p-6 flex flex-col gap-3 w-1/4">
          <CardHeader className="p-0 flex flex-row justify-between">
            Estimated Elo <ChevronsUp height={20} />
          </CardHeader>

          <CardContent className="p-0 flex flex-col">
            <span className="font-bold text-2xl">1456</span>
            <span className="font-thin text-sm">top 56%</span>
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex gap-6 flex-1">
        <Card className="p-6 flex flex-col gap-3 h-full w-3/5">
          <CardHeader className="p-0 flex flex-row text-2xl font-extrabold justify-between">
            Accuracy Over Time
          </CardHeader>

          <CardContent className="p-0 flex h-full flex-col">
            <ResponsiveContainer width="100%" height={'100%'}>
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Bar dataKey="total" fill="currentColor" radius={[10, 10, 0, 0]} className="fill-primary" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="p-6 flex flex-col gap-3 h-full w-2/5">
          <CardHeader className="p-0 flex text-2xl font-extrabold justify-between">
            Recent Games
            <CardDescription className="font-thin text-sm">You made 54 Analyses this month</CardDescription>
          </CardHeader>

          <CardContent className="p-0 flex h-full flex-col gap-4">
            <div className="border rounded-lg p-2 flex gap-2 items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>O</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium leading-none">Olivia Martin</p>/
              <Avatar className="h-9 w-9">
                <AvatarFallback>L</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium leading-none">Ludo32</p>
              <span className="ml-auto bg-emerald-400 h-4 w-4 rounded-full"></span>
            </div>

            <div className="border rounded-lg p-2 flex gap-2 items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>F</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium leading-none">Fred Errick</p>/
              <Avatar className="h-9 w-9">
                <AvatarFallback>L</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium leading-none">Ludo32</p>
              <span className="ml-auto bg-emerald-400 h-4 w-4 rounded-full"></span>
            </div>

            <div className="border rounded-lg p-2 flex gap-2 items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium leading-none">Samy.A</p>/
              <Avatar className="h-9 w-9">
                <AvatarFallback>L</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium leading-none">Ludo32</p>
              <span className="ml-auto bg-rose-500 h-4 w-4 rounded-full"></span>
            </div>

            <div className="border rounded-lg p-2 flex gap-2 items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>O</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium leading-none">Ed12</p>/
              <Avatar className="h-9 w-9">
                <AvatarFallback>L</AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium leading-none">Ludo32</p>
              <span className="ml-auto bg-emerald-400 h-4 w-4 rounded-full"></span>
            </div>
            {/*<div className="flex items-center overflow-hidden h-14 rounded-lg">*/}
            {/*  <div className="h-full relative">*/}
            {/*    <div className="bg-white flex gap-2 items-center h-full p-2">*/}
            {/*      <Avatar className="h-9 w-9">*/}
            {/*        <AvatarFallback>O</AvatarFallback>*/}
            {/*      </Avatar>*/}
            {/*      <p className="text-sm font-medium leading-none text-background">Olivia Martin</p>*/}
            {/*    </div>*/}
            {/*    <div className="border-x-[1rem] border-y-[1.8rem] border-l-white border-t-white border-r-transparent border-b-transparent absolute right-0 top-0 translate-x-full" />*/}
            {/*  </div>*/}

            {/*  <div className="bg-white/5 h-full pl-10 pr-2 items-center flex gap-2 flex-1">*/}
            {/*    <Avatar className="h-9 w-9">*/}
            {/*      <AvatarFallback>L</AvatarFallback>*/}
            {/*    </Avatar>*/}
            {/*    <p className="text-sm font-medium leading-none">Ludo32</p>*/}
            {/*    <span className="ml-auto bg-emerald-400 h-4 w-4 rounded-full"></span>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};
