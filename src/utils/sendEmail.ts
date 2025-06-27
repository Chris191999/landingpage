
import { supabase } from '@/integrations/supabase/client';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  console.log('[SEND-EMAIL-CLIENT] Initiating email send');
  console.log('[SEND-EMAIL-CLIENT] To:', to);
  console.log('[SEND-EMAIL-CLIENT] Subject:', subject);
  
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html },
    });
    
    if (error) {
      console.error('[SEND-EMAIL-CLIENT] Supabase function error:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
    
    console.log('[SEND-EMAIL-CLIENT] ✅ Email sent successfully:', data);
    return data;
    
  } catch (error) {
    console.error('[SEND-EMAIL-CLIENT] ❌ Email sending failed:', error);
    throw error;
  }
}

// Batch email sending for efficiency
export async function sendBatchEmails(emails: EmailParams[]) {
  console.log(`[SEND-EMAIL-CLIENT] Initiating batch email send for ${emails.length} emails`);
  
  const results = await Promise.allSettled(
    emails.map(email => sendEmail(email))
  );
  
  const successful = results.filter(result => result.status === 'fulfilled').length;
  const failed = results.filter(result => result.status === 'rejected').length;
  
  console.log(`[SEND-EMAIL-CLIENT] Batch complete: ${successful} successful, ${failed} failed`);
  
  return {
    successful,
    failed,
    results
  };
}
