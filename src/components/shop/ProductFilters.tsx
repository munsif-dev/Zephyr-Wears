'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X } from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'All Products' },
  { value: 'mens', label: "Men's" },
  { value: 'womens', label: "Women's" },
  { value: 'unisex', label: 'Unisex' },
  { value: 'custom', label: 'Custom' },
];

const PRICE_RANGES = [
  { value: 'all', label: 'Any Price', min: 0, max: Infinity },
  { value: '0-1000', label: 'Under Rs. 1,000', min: 0, max: 1000 },
  { value: '1000-2000', label: 'Rs. 1,000 - 2,000', min: 1000, max: 2000 },
  { value: '2000-3000', label: 'Rs. 2,000 - 3,000', min: 2000, max: 3000 },
  { value: '3000+', label: 'Over Rs. 3,000', min: 3000, max: Infinity },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || 'all';
  const currentPrice = searchParams.get('price') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentSearch = searchParams.get('search') || '';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'all' || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = currentCategory !== 'all' || currentPrice !== 'all' || currentSearch !== '';
  const activeFilterCount = 
    (currentCategory !== 'all' ? 1 : 0) + 
    (currentPrice !== 'all' ? 1 : 0) + 
    (currentSearch ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Active Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="h-5 min-w-[20px]">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 text-xs"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear all
          </Button>
        </div>
      )}

      {/* Category Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Category</Label>
        <RadioGroup value={currentCategory} onValueChange={(value) => updateFilters('category', value)}>
          {CATEGORIES.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <RadioGroupItem value={category.value} id={`cat-${category.value}`} />
              <Label
                htmlFor={`cat-${category.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Price Range</Label>
        <RadioGroup value={currentPrice} onValueChange={(value) => updateFilters('price', value)}>
          {PRICE_RANGES.map((range) => (
            <div key={range.value} className="flex items-center space-x-2">
              <RadioGroupItem value={range.value} id={`price-${range.value}`} />
              <Label
                htmlFor={`price-${range.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {range.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* Sort Options */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Sort By</Label>
        <RadioGroup value={currentSort} onValueChange={(value) => updateFilters('sort', value)}>
          {SORT_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`sort-${option.value}`} />
              <Label
                htmlFor={`sort-${option.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
