
import { sendEmail } from '@/utils/sendEmail';
import { getEmailTemplate } from '@/utils/emailTemplates';
import { ProfileWithEmail } from './useAdminUsersData';
import { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useEmailNotifications = () => {
  const sendUserUpdateEmail = async (
    userProfile: ProfileWithEmail,
    updates: { status?: Profile['status'], role?: Profile['role'] }
  ) => {
    if (!userProfile?.email) {
      throw new Error("Cannot send email: User email not found");
    }

    const promises = [];

    if (updates.status) {
      const emailData = getEmailTemplate('status_change', {
        status: updates.status,
        fullName: userProfile.full_name || userProfile.email.split('@')[0]
      });
      
      promises.push(sendEmail({
        to: userProfile.email,
        subject: emailData.subject,
        html: emailData.html
      }));
    }
    
    if (updates.role) {
      const emailData = getEmailTemplate('role_change', {
        role: updates.role,
        fullName: userProfile.full_name || userProfile.email.split('@')[0]
      });
      
      promises.push(sendEmail({
        to: userProfile.email,
        subject: emailData.subject,
        html: emailData.html
      }));
    }

    await Promise.all(promises);
  };

  const sendPlanUpdateEmail = async (
    userProfile: ProfileWithEmail,
    planData: {
      plan: string;
      activated_at: string;
      expires_at: string;
    }
  ) => {
    if (!userProfile?.email) {
      throw new Error("Cannot send email: User email not found");
    }

    const emailData = getEmailTemplate('plan_change', {
      plan: planData.plan,
      fullName: userProfile.full_name || userProfile.email.split('@')[0],
      activatedAt: planData.activated_at,
      expiresAt: planData.expires_at
    });
    
    await sendEmail({
      to: userProfile.email,
      subject: emailData.subject,
      html: emailData.html
    });
  };

  return {
    sendUserUpdateEmail,
    sendPlanUpdateEmail,
  };
};
