'use client';

import { useSimpleDesignStore, type Placement } from '@/stores/simpleDesignStore';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function PlacementSelector() {
  const { placement, setPlacement } = useSimpleDesignStore();

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold">Design Placement</Label>

      <RadioGroup
        value={placement}
        onValueChange={(value) => setPlacement(value as Placement)}
      >
        <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
          <RadioGroupItem value="chest" id="chest" />
          <Label htmlFor="chest" className="flex-1 cursor-pointer">
            <div>
              <div className="font-medium">Chest (Front)</div>
              <div className="text-xs text-muted-foreground">
                Design appears on the front chest area
              </div>
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
          <RadioGroupItem value="back" id="back" />
          <Label htmlFor="back" className="flex-1 cursor-pointer">
            <div>
              <div className="font-medium">Back</div>
              <div className="text-xs text-muted-foreground">
                Design appears on the back of the shirt
              </div>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
