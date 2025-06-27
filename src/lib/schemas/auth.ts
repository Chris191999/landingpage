import * as z from 'zod';

export const loginSchema = z.object({
  email: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().email({ message: "Invalid email address." })
  ),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().email({ message: "Invalid email address." })
  ),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  pricingPlan: z.enum(["Let him cook (free)", "Cooked", "Goated"], { required_error: "Please select a pricing plan." }),
  auraCode: z.string().optional(),
  outsideIndia: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().email({ message: "Invalid email address." })
  ),
});

export const adminAddUserSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().email({ message: "Invalid email address." })
  ),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(['user', 'admin']),
  status: z.enum(['active', 'inactive', 'pending_approval'])
});

export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type AdminAddUserData = z.infer<typeof adminAddUserSchema>;
