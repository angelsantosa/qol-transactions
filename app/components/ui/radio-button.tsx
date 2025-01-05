import * as React from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const radioButtonVariants = cva(
  'border rounded-lg shadow-sm flex items-center hover:bg-accent hover:text-accent-foreground',
  {
    variants: {
      variant: {
        default: '',
        active: 'bg-accent border-primary',
      },
      size: {
        default: '',
      },
      orientation: {
        horizontal: 'p-2 flex-row w-full',
        vertical: 'p-1 flex-col h-24',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      orientation: 'vertical',
    },
  },
);

export interface RadioButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode | string;
  orientation?: 'horizontal' | 'vertical';
}

const RadioButton = React.forwardRef<HTMLButtonElement, RadioButtonProps>(
  ({ active, orientation = 'vertical', ...props }, ref) => {
    const Comp = 'button';

    return (
      <Comp
        className={cn(
          radioButtonVariants({
            variant: active ? 'active' : 'default',
            size: 'default',
            orientation,
          }),
        )}
        ref={ref}
        {...props}
        type="button"
      >
        <div className="flex-1 flex items-center justify-center pb-1">
          {props.icon}
        </div>
        <div className="text-sm text-center w-full px-1 overflow-hidden h-10 flex items-center justify-center">
          <span className="line-clamp-2">{props.value}</span>
        </div>
      </Comp>
    );
  },
);

RadioButton.displayName = 'RadioButton';
export { RadioButton };
