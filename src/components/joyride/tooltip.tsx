import { TooltipRenderProps } from 'react-joyride';
import { Button } from '@/components/ui/button.tsx';

export const CustomJoyrideTooltip = (props: TooltipRenderProps) => {
  const { backProps, continuous, index, primaryProps, skipProps, step, tooltipProps } = props;

  return (
    <div
      className="h-max min-w-60 max-w-[40rem] p-6 flex bg-accent flex-col gap-4 rounded-lg overflow-hidden"
      {...tooltipProps}
    >
      {step.title && <h4 className="text-xl">{step.title}</h4>}
      <div className="flex flex-col gap-2">{step.content}</div>
      <div className="flex justify-end gap-2 w-full">
        <Button variant="outline" {...skipProps}>
          {skipProps.title} Tutorial
        </Button>
        <div>
          {index > 0 && <Button {...backProps}>{backProps.title}</Button>}
          {continuous && <Button {...primaryProps}>{primaryProps.title}</Button>}
        </div>
      </div>
    </div>
  );
};
