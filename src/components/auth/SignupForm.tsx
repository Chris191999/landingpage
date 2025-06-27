import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from './PasswordInput';
import { signupSchema, SignupData } from '@/lib/schemas/auth';
import { useNavigate } from 'react-router-dom';

interface SignupFormProps {
  onSignup: (data: SignupData) => Promise<boolean>;
  loading: boolean;
}

// PayPal button ID mappings
const PAYPAL_BUTTONS = {
  Cooked: {
    none: "GNRQKB6Z6S4A6", // $10.00
    10: "NLWDBZXAMYJX2",   // $9.00
    25: "A55BKH8W2H65C",   // $7.50
    50: "64W9Z5PTGVALS",   // $5.00
  },
  Goated: {
    none: "GNRQKB6Z6S4A6", // $15.00
    10: "NLWDBZXAMYJX2",   // $13.50
    25: "A55BKH8W2H65C",   // $11.25
    50: "64W9Z5PTGVALS",   // $7.50
  }
};

// Coupon code to discount mapping
const COUPON_DISCOUNTS = {
  INFLUENCER10: "10",
  INFLUENCER25: "25",
  INFLUENCER50: "50",
  // Add more influencer codes as needed
};

const getDiscountLevel = (coupon) => COUPON_DISCOUNTS[coupon] || "none";

const extractPlanType = (pricingPlan: string) => {
  if (pricingPlan.toLowerCase().includes('goated')) return 'Goated';
  if (pricingPlan.toLowerCase().includes('cooked')) return 'Cooked';
  return 'Let him cook (free)';
};

export const SignupForm = ({ onSignup, loading }: SignupFormProps) => {
  const navigate = useNavigate();
  const form = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      pricingPlan: undefined,
      auraCode: "",
      outsideIndia: false,
    },
  });

  // Plan options based on outsideIndia
  const planOptions = form.watch('outsideIndia')
    ? [
        { value: 'Let him cook (free)', label: 'Let him cook (free)' },
        { value: 'Cooked', label: 'Cooked – $10/month' },
        { value: 'Goated', label: 'Goated – $15/month' },
      ]
    : [
        { value: 'Let him cook (free)', label: 'Let him cook (free)' },
        { value: 'Cooked', label: 'Cooked – ₹499/month' },
        { value: 'Goated', label: 'Goated – ₹799/month' },
      ];

  const handleSubmit = async (data: SignupData) => {
    const success = await onSignup(data);
    if (!success) return;
    // Always redirect to /payment with user and plan info
    const planType = extractPlanType(data.pricingPlan);
    const params = new URLSearchParams({
      plan: planType,
      fullName: data.fullName,
      email: data.email,
      outsideIndia: data.outsideIndia ? '1' : '0',
      auraCode: data.auraCode || '',
    });
    navigate(`/payment?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Premium Outside India Checkbox at the top */}
      <div className="flex items-center justify-center mt-6 mb-4">
        <FormField
          control={form.control}
          name="outsideIndia"
          render={({ field }) => (
            <div className="flex items-center gap-1 bg-[#181c25] px-2 py-1 rounded-xl border-2 border-[#e6c200] shadow-md">
              <input
                type="checkbox"
                id="outsideIndia"
                checked={field.value}
                onChange={e => field.onChange(e.target.checked)}
                className="accent-yellow-400 w-3 h-3 cursor-pointer border-2 border-[#e6c200] rounded-md"
                style={{ minWidth: '14px', minHeight: '14px' }}
              />
              <label htmlFor="outsideIndia" className="text-sm font-semibold text-[#e6c200] cursor-pointer select-none">
                Outside India
              </label>
            </div>
          )}
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    id="password"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="auraCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Aura Code (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter aura code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Plan Dropdown (dynamic) */}
          <FormField
            control={form.control}
            name="pricingPlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Choose Your Plan</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {planOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="font-bold text-red-500" />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full bg-[#f5dd01] text-black hover:bg-[#d4bc00] font-semibold" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Continue to Payment'}
          </Button>
          <p className="text-xs text-center text-gray-400 mt-2">
            You'll be redirected to payment after account creation
          </p>
        </form>
      </Form>
    </div>
  );
};
