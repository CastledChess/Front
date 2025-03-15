import { PopoverContentProps } from '@reactour/tour';
import { Button } from '@/components/ui/button.tsx';
import { useTranslation } from 'react-i18next';

export const Content = ({ steps, currentStep, setCurrentStep }: PopoverContentProps) => {
  const { t } = useTranslation('tutorial');

  const content = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="bg-secondary-bg rounded-lg p-4 flex flex-col gap-4">
      {content.content as React.ReactNode}

      <div className="flex gap-2 w-full justify-end">
        {!isLastStep && <Button onClick={() => setCurrentStep(currentStep + 1)}>{t('next')}</Button>}
        {isLastStep && <Button onClick={() => setCurrentStep(currentStep + 1)}>{t('ok')}</Button>}
      </div>
    </div>
  );
};
