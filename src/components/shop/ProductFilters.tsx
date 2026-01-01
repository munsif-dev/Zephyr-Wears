'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'All Products' },
  { value: 'mens', label: "Men's T-Shirts" },
  { value: 'womens', label: "Women's T-Shirts" },
  { value: 'unisex', label: 'Unisex T-Shirts' },
  { value: 'custom', label: 'Custom Designs' },
];

const PRICE_RANGES = [
  { value: 'all', label: 'Any Price', min: 0, max: Infinity },
  { value: '0-20', label: 'Under $20', min: 0, max: 20 },
  { value: '20-40', label: '$20 - $40', min: 20, max: 40 },
  { value: '40-60', label: '$40 - $60', min: 40, max: 60 },
  { value: '60+', label: 'Over $60', min: 60, max: Infinity },
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

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    sort: true,
  });

  const currentCategory = searchParams.get('category') || 'all';
  const currentPrice = searchParams.get('price') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentSearch = searchParams.get('search') || '';

  const toggleSection = (section: 'category' | 'price' | 'sort') => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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
    <Card className="p-5 border-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="default" className="h-5 min-w-[20px] flex items-center justify-center px-1.5">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <Separator className="mb-4" />

      {/* Category Filter */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between py-2 text-sm font-semibold hover:text-primary transition-colors"
        >
          <span>Category</span>
          {expandedSections.category ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.category && (
          <div className="space-y-1.5 mt-3">
            {CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => updateFilters('category', category.value)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentCategory === category.value
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'hover:bg-muted/80'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <Separator className="mb-4" />

      {/* Price Range Filter */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between py-2 text-sm font-semibold hover:text-primary transition-colors"
        >
          <span>Price Range</span>
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-1.5 mt-3">
            {PRICE_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => updateFilters('price', range.value)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentPrice === range.value
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'hover:bg-muted/80'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <Separator className="mb-4" />

      {/* Sort Options */}
      <div>
        <button
          onClick={() => toggleSection('sort')}
          className="w-full flex items-center justify-between py-2 text-sm font-semibold hover:text-primary transition-colors"
        >
          <span>Sort By</span>
          {expandedSections.sort ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.sort && (
          <div className="space-y-1.5 mt-3">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilters('sort', option.value)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentSort === option.value
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'hover:bg-muted/80'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
