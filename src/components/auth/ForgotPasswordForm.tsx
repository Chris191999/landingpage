import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { forgotPasswordSchema, ForgotPasswordData } from '@/lib/schemas/auth';

interface ForgotPasswordFormProps {
  onForgotPassword: (data: ForgotPasswordData) => Promise<void>;
  onBackToLogin: () => void;
  loading: boolean;
}

export const ForgotPasswordForm = ({ onForgotPassword, onBackToLogin, loading }: ForgotPasswordFormProps) => {
  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className="space-y-6">
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onForgotPassword)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</Button>
          <Button variant="link" size="sm" className="w-full" onClick={onBackToLogin}>Back to Login</Button>
        </form>
      </Form>
    </div>
  );
};
