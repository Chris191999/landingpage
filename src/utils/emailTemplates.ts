
// Email template utilities for admin notifications
export const getEmailTemplate = (type: 'status_change' | 'plan_change' | 'role_change', data: any) => {
  const baseStyle = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
      <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #f5dd01;">
        <h1 style="color: #f5dd01; font-size: 28px; margin: 0;">TRADEMIND</h1>
        <p style="color: #666; margin: 5px 0 0 0;">Professional Trading Journal</p>
      </div>
      <div style="padding: 30px 0;">
  `;
  
  const baseEndStyle = `
      </div>
      <div style="text-align: center; padding: 20px 0; border-top: 1px solid #eee; color: #666; font-size: 14px;">
        <p>Best regards,<br>The TradeMind Team</p>
        <p style="font-size: 12px; color: #999;">Visit us at <a href="https://trademind.co.in" style="color: #f5dd01;">trademind.co.in</a></p>
      </div>
    </div>
  `;

  switch (type) {
    case 'status_change':
      return getStatusChangeTemplate(data, baseStyle, baseEndStyle);
    case 'plan_change':
      return getPlanChangeTemplate(data, baseStyle, baseEndStyle);
    case 'role_change':
      return getRoleChangeTemplate(data, baseStyle, baseEndStyle);
    default:
      return getDefaultTemplate(data, baseStyle, baseEndStyle);
  }
};

const getStatusChangeTemplate = (data: any, baseStyle: string, baseEndStyle: string) => {
  if (data.status === 'active') {
    return {
      subject: '🎉 Your TradeMind Account Has Been Activated!',
      html: baseStyle + `
        <h2 style="color: #333; margin-bottom: 20px;">Welcome to TradeMind!</h2>
        <p style="color: #333; line-height: 1.6; margin-bottom: 15px;">Hello ${data.fullName},</p>
        <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">Great news! Your TradeMind account has been activated and you can now access all features of your trading journal.</p>
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0369a1; margin-top: 0;">What's Next?</h3>
          <ul style="color: #333; line-height: 1.8; padding-left: 20px;">
            <li>Log in to your account at <a href="https://trademind.co.in" style="color: #f5dd01;">trademind.co.in</a></li>
            <li>Start adding your trades to build your journal</li>
            <li>Explore our analytics and performance insights</li>
            <li>Track your trading psychology and improve your mindset</li>
          </ul>
        </div>
        <p style="color: #333; line-height: 1.6;">Happy trading!</p>
      ` + baseEndStyle
    };
  } else if (data.status === 'inactive') {
    return {
      subject: '⚠️ Your TradeMind Account Status Update',
      html: baseStyle + `
        <h2 style="color: #dc2626; margin-bottom: 20px;">Account Status Update</h2>
        <p style="color: #333; line-height: 1.6; margin-bottom: 15px;">Hello ${data.fullName},</p>
        <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">We're writing to inform you that your TradeMind account has been temporarily deactivated by our admin team.</p>
        <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="color: #92400e; margin-top: 0;">Need Help?</h3>
          <p style="color: #333; line-height: 1.6;">If you have any questions or believe this was done in error, please contact our support team immediately.</p>
          <p style="color: #333; line-height: 1.6; margin: 0;">Email: <a href="mailto:support@trademind.co.in" style="color: #f5dd01;">support@trademind.co.in</a></p>
        </div>
      ` + baseEndStyle
    };
  } else {
    return {
      subject: '📋 Your TradeMind Account is Under Review',
      html: baseStyle + `
        <h2 style="color: #f59e0b; margin-bottom: 20px;">Account Under Review</h2>
        <p style="color: #333; line-height: 1.6; margin-bottom: 15px;">Hello ${data.fullName},</p>
        <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">Your TradeMind account is currently pending approval from our admin team. We'll review your account and notify you once it's been approved.</p>
        <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400e; margin-top: 0;">What to Expect</h3>
          <p style="color: #333; line-height: 1.6;">Our team typically reviews new accounts within 24-48 hours. You'll receive an email notification once your account is activated.</p>
        </div>
      ` + baseEndStyle
    };
  }
};

const getPlanChangeTemplate = (data: any, baseStyle: string, baseEndStyle: string) => {
  const planBenefits = {
    'Let him cook (free)': ['Basic trade logging', 'Simple analytics', 'Community support'],
    'Cooked': ['Advanced analytics', 'PDF exports', 'Risk management tools', 'Calendar view', 'Priority support'],
    'Goated': ['All Cooked features', 'Advanced risk psychology', 'Time analysis', 'Premium support', 'Custom insights']
  };
  
  return {
    subject: `🚀 Your TradeMind Plan Has Been Updated to ${data.plan}!`,
    html: baseStyle + `
      <h2 style="color: #059669; margin-bottom: 20px;">Plan Successfully Updated!</h2>
      <p style="color: #333; line-height: 1.6; margin-bottom: 15px;">Hello ${data.fullName},</p>
      <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">Great news! Your TradeMind subscription has been updated to the <strong>${data.plan}</strong> plan.</p>
      
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #22c55e;">
        <h3 style="color: #059669; margin-top: 0;">Your ${data.plan} Plan Includes:</h3>
        <ul style="color: #333; line-height: 1.8; padding-left: 20px;">
          ${planBenefits[data.plan as keyof typeof planBenefits]?.map(benefit => `<li>${benefit}</li>`).join('') || '<li>All premium features</li>'}
        </ul>
      </div>

      ${data.plan !== 'Let him cook (free)' ? `
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #333; margin: 0;"><strong>Plan Details:</strong></p>
          <p style="color: #666; margin: 5px 0;">Activated: ${data.activatedAt ? new Date(data.activatedAt).toLocaleDateString() : 'Now'}</p>
          ${data.expiresAt ? `<p style="color: #666; margin: 5px 0;">Expires: ${new Date(data.expiresAt).toLocaleDateString()}</p>` : ''}
        </div>
      ` : ''}

      <p style="color: #333; line-height: 1.6;">Log in to your account now to explore your new features!</p>
    ` + baseEndStyle
  };
};

const getRoleChangeTemplate = (data: any, baseStyle: string, baseEndStyle: string) => {
  return {
    subject: data.role === 'admin' ? '👑 You\'ve Been Promoted to Admin!' : '👤 Your Role Has Been Updated',
    html: baseStyle + `
      <h2 style="color: ${data.role === 'admin' ? '#7c3aed' : '#059669'}; margin-bottom: 20px;">
        ${data.role === 'admin' ? 'Congratulations on Your Promotion!' : 'Role Updated'}
      </h2>
      <p style="color: #333; line-height: 1.6; margin-bottom: 15px;">Hello ${data.fullName},</p>
      <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
        Your role in TradeMind has been updated to <strong>${data.role === 'admin' ? 'Administrator' : 'User'}</strong>.
      </p>
      
      ${data.role === 'admin' ? `
        <div style="background-color: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #a855f7;">
          <h3 style="color: #7c3aed; margin-top: 0;">Admin Privileges Include:</h3>
          <ul style="color: #333; line-height: 1.8; padding-left: 20px;">
            <li>User management access</li>
            <li>System administration tools</li>
            <li>Analytics and reporting</li>
            <li>Content moderation capabilities</li>
          </ul>
        </div>
      ` : ''}

      <p style="color: #333; line-height: 1.6;">
        ${data.role === 'admin' ? 'Use your new privileges responsibly!' : 'Thank you for being part of the TradeMind community!'}
      </p>
    ` + baseEndStyle
  };
};

const getDefaultTemplate = (data: any, baseStyle: string, baseEndStyle: string) => {
  return {
    subject: 'TradeMind Account Update',
    html: baseStyle + `
      <h2 style="color: #333; margin-bottom: 20px;">Account Update</h2>
      <p style="color: #333; line-height: 1.6;">Hello ${data.fullName},</p>
      <p style="color: #333; line-height: 1.6;">Your TradeMind account has been updated by our admin team.</p>
    ` + baseEndStyle
  };
};
