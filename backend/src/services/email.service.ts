// Simple email service - for now just logs to console
// In production, integrate with SendGrid, Resend, or AWS SES

export class EmailService {
  static async sendVerificationEmail(email: string, code: string, firstName?: string) {
    const name = firstName || 'User';
    
    // For now, just log to console
    // In production, replace with actual email service
    console.log('\n=================================');
    console.log('📧 VERIFICATION EMAIL');
    console.log('=================================');
    console.log(`To: ${email}`);
    console.log(`Subject: Verify your VoyageShield account`);
    console.log('\n--- Email Content ---');
    console.log(`Hello ${name},`);
    console.log('\nThank you for registering with VoyageShield!');
    console.log('\nYour verification code is:');
    console.log(`\n    ${code}`);
    console.log('\nThis code will expire in 24 hours.');
    console.log('\nIf you did not create an account, please ignore this email.');
    console.log('\nBest regards,');
    console.log('VoyageShield Team');
    console.log('=================================\n');
    
    // TODO: In production, use real email service:
    /*
    // Example with Resend:
    await resend.emails.send({
      from: 'VoyageShield <noreply@voyageshield.com>',
      to: email,
      subject: 'Verify your VoyageShield account',
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for registering with VoyageShield!</p>
        <p>Your verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 8px; color: #8B0000;">${code}</h1>
        <p>This code will expire in 24 hours.</p>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Best regards,<br>VoyageShield Team</p>
      `
    });
    */
    
    return true;
  }
  
  static async sendWelcomeEmail(email: string, firstName?: string) {
    const name = firstName || 'User';
    
    console.log('\n=================================');
    console.log('📧 WELCOME EMAIL');
    console.log('=================================');
    console.log(`To: ${email}`);
    console.log(`Subject: Welcome to VoyageShield!`);
    console.log('\n--- Email Content ---');
    console.log(`Hello ${name},`);
    console.log('\nWelcome to VoyageShield! Your email has been verified.');
    console.log('\nYou can now complete your onboarding and get your travel insurance.');
    console.log('\nBest regards,');
    console.log('VoyageShield Team');
    console.log('=================================\n');
    
    return true;
  }
}
