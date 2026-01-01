-- Fix PaymentStatus enum to match schema
-- Rename PAID to SUCCESS and add CANCELLED value

-- Rename PaymentStatus PAID to SUCCESS
ALTER TYPE "PaymentStatus" RENAME VALUE 'PAID' TO 'SUCCESS';

-- Add CANCELLED value to PaymentStatus enum
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';
