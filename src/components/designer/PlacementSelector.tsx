'use client';

import { useSimpleDesignStore, type Placement } from '@/stores/simpleDesignStore';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export function PlacementSelector() {
  const { placement, setPlacement } = useSimpleDesignStore();

  const placements = [
    {
      value: 'chest' as Placement,
      label: 'Front Chest',
      description: 'Classic placement on the chest area',
      icon: ArrowUpCircle,
    },
    {
      value: 'back' as Placement,
      label: 'Full Back',
      description: 'Bold statement on the back',
      icon: ArrowDownCircle,
    },
  ];

  return (
    <div className="space-y-3">
      <RadioGroup
        value={placement}
        onValueChange={(value) => setPlacement(value as Placement)}
        className="grid gap-3"
      >
        {placements.map((item) => (
          <label
            key={item.value}
            htmlFor={item.value}
            className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              placement === item.value
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-muted hover:border-muted-foreground/50 hover:bg-muted/30'
            }`}
          >
            <RadioGroupItem value={item.value} id={item.value} className="shrink-0" />
            
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              placement === item.value ? 'bg-primary/10' : 'bg-muted'
            }`}>
              <item.icon className={`h-5 w-5 ${
                placement === item.value ? 'text-primary' : 'text-muted-foreground'
              }`} />
            </div>

            <div className="flex-1">
              <div className="font-medium text-sm">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>

            {placement === item.value && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              </div>
            )}
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
