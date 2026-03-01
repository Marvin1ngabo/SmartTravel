import nodemailer from 'nodemailer';

// Create transporter using Gmail SMTP
// For Gmail, you need to use an "App Password" not your regular password
// Go to: https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password
  },
  tls: {
    rejectUnauthorized: false
  },
  // Force IPv4
  family: 4
});

// System email address
const SYSTEM_EMAIL = process.env.EMAIL_USER || 'ngabolu@gmail.com';

export class EmailService {
  static async sendVerificationEmail(email: string, code: string, firstName?: string) {
    const name = firstName || 'User';
    
    try {
      // Log to console for debugging
      console.log('\n=================================');
      console.log('📧 SENDING VERIFICATION EMAIL');
      console.log('=================================');
      console.log(`To: ${email}`);
      console.log(`Code: ${code}`);
      console.log('=================================\n');

      // Send email using Nodemailer
      const info = await transporter.sendMail({
        from: `VoyageShield <${SYSTEM_EMAIL}>`,
        to: email,
        subject: 'Verify your VoyageShield account',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Verify Your Email</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                      <!-- Header -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%); padding: 40px 30px; text-align: center;">
                          <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">VoyageShield</h1>
                          <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Travel Insurance Made Simple</p>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px 30px;">
                          <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px;">Hello ${name},</h2>
                          <p style="margin: 0 0 20px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                            Thank you for registering with VoyageShield! We're excited to help you secure your travel insurance.
                          </p>
                          <p style="margin: 0 0 10px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                            Your verification code is:
                          </p>
                          
                          <!-- Verification Code -->
                          <div style="background-color: #f8f8f8; border: 2px dashed #8B0000; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                            <div style="font-size: 48px; font-weight: bold; letter-spacing: 12px; color: #8B0000; font-family: 'Courier New', monospace;">
                              ${code}
                            </div>
                          </div>
                          
                          <p style="margin: 20px 0 0 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                            <strong>Important:</strong> This code will expire in 24 hours. If you didn't create an account with VoyageShield, please ignore this email.
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                          <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                            Best regards,<br>
                            <strong>VoyageShield Team</strong>
                          </p>
                          <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px;">
                            This is an automated email. Please do not reply to this message.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      });

      console.log('✅ Email sent successfully:', info.messageId);
      return true;
    } catch (error: any) {
      console.error('❌ Email sending failed:', error);
      throw error;
    }
  }
  
  static async sendWelcomeEmail(email: string, firstName?: string) {
    const name = firstName || 'User';
    
    try {
      console.log('\n=================================');
      console.log('📧 SENDING WELCOME EMAIL');
      console.log('=================================');
      console.log(`To: ${email}`);
      console.log('=================================\n');

      const info = await transporter.sendMail({
        from: `VoyageShield <${SYSTEM_EMAIL}>`,
        to: email,
        subject: 'Welcome to VoyageShield! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to VoyageShield</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                      <!-- Header -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%); padding: 40px 30px; text-align: center;">
                          <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">🎉 Welcome to VoyageShield!</h1>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px 30px;">
                          <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px;">Hello ${name},</h2>
                          <p style="margin: 0 0 20px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                            Congratulations! Your email has been successfully verified. You're now ready to complete your onboarding and get your travel insurance.
                          </p>
                          
                          <!-- Features -->
                          <div style="background-color: #f8f8f8; border-radius: 8px; padding: 25px; margin: 30px 0;">
                            <h3 style="margin: 0 0 15px 0; color: #8B0000; font-size: 18px;">What's Next?</h3>
                            <ul style="margin: 0; padding-left: 20px; color: #4a4a4a; font-size: 15px; line-height: 1.8;">
                              <li>Complete your travel details</li>
                              <li>Choose from 18+ trusted insurance providers</li>
                              <li>Select flexible payment options</li>
                              <li>Get your travel insurance certificate</li>
                            </ul>
                          </div>
                          
                          <p style="margin: 20px 0 0 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                            We're here to make your travel insurance experience smooth and hassle-free. If you have any questions, feel free to reach out!
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                          <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                            Safe travels,<br>
                            <strong>VoyageShield Team</strong>
                          </p>
                          <p style="margin: 10px 0 0 0; color: #999999; font-size: 12px;">
                            This is an automated email. Please do not reply to this message.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      });

      console.log('✅ Welcome email sent successfully:', info.messageId);
      return true;
    } catch (error: any) {
      console.error('❌ Welcome email sending failed:', error);
      throw error;
    }
  }
}
