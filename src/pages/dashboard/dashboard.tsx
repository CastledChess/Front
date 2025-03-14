import { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useTranslation } from 'react-i18next';
import { getHistory } from '@/api/history.ts';
import { useHistoryState } from '@/store/history.ts';
import { Analysis } from '@/types/analysis.ts';
import { TutorialStep, useAuthStore } from '@/store/auth.ts';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { TutorialStepProps } from '@/types/tutorial.ts';

const WELCOME_SKIP_TIMEOUT = 5000;

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
  const { hasSeenTutorial, setHasSeenTutorial, tutorialStep, setTutorialStep } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const tutorialSteps = t('tutorialSteps', { returnObjects: true }) as Record<string, TutorialStepProps>;

  console.log(tutorialSteps);

  useEffect(() => {
    async function fetchData() {
      const history = await getHistory();
      setAnalyses(history as Analysis[]);
      setLoading(false);
    }

    setTimeout(() => {
      setTutorialStep(TutorialStep.NAVIGATE_TO_NEW_ANALYSIS);
    }, WELCOME_SKIP_TIMEOUT);

    fetchData();
  }, []);

  return (
    <div className="w-full h-full md:p-16 p-4 flex justify-center">
      <div className="container flex flex-col gap-4 overflow-y-auto">
        <p className="text-2xl md:text-4xl">{t('title')}</p>
        {!hasSeenTutorial && <div className="bg-background opacity-70 z-10 absolute top-0 left-0 w-screen h-screen" />}
        <DataTable isLoading={loading} columns={columns} data={analyses || []} />

        {!hasSeenTutorial && (
          <Dialog open modal={false}>
            <DialogContent className="top-4 left-4 translate-y-0 translate-x-0 overflow-hidden">
              <DialogHeader>
                <DialogTitle>{tutorialSteps[tutorialStep].title}</DialogTitle>
                <DialogDescription>{tutorialSteps[tutorialStep].description}</DialogDescription>
              </DialogHeader>

              <DialogFooter className="!justify-start">
                <DialogClose asChild>
                  <Button onClick={() => setHasSeenTutorial(true)} variant="outline">
                    Skip tutorial
                  </Button>
                </DialogClose>
              </DialogFooter>

              {tutorialStep === TutorialStep.WELCOME && (
                <motion.div
                  className="h-1 bg-primary absolute bottom-0"
                  initial={{ width: 0 }}
                  animate={{ width: '100%', transition: { duration: WELCOME_SKIP_TIMEOUT / 1000, ease: 'linear' } }}
                />
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
