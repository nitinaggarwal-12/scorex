#!/usr/bin/env node

/**
 * Email Configuration Test Script
 * 
 * This script tests your email configuration without starting the full server.
 * 
 * Usage:
 *   node test-email-config.js
 * 
 * Make sure to set environment variables in .env file first.
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('\n📧 Email Configuration Test\n');
console.log('═══════════════════════════════════════════════════════════\n');

// Check if email variables are set
const requiredVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n💡 Please set these in your .env file or environment variables.');
  console.error('   See RAILWAY_EMAIL_SETUP.md for configuration guide.\n');
  process.exit(1);
}

// Display current configuration
console.log('✅ Email configuration found:\n');
console.log(`   Host:     ${process.env.EMAIL_HOST}`);
console.log(`   Port:     ${process.env.EMAIL_PORT}`);
console.log(`   User:     ${process.env.EMAIL_USER}`);
console.log(`   Password: ${'*'.repeat(Math.min(process.env.EMAIL_PASSWORD.length, 16))}`);
console.log(`   From:     ${process.env.EMAIL_FROM || process.env.EMAIL_USER}`);
console.log(`   Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);

// Create transporter
console.log('🔧 Creating email transporter...\n');
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: parseInt(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Test connection
console.log('🔌 Testing SMTP connection...\n');
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ SMTP Connection Failed!\n');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting tips:');
    console.error('   1. For Gmail: Use App Password, not regular password');
    console.error('      Generate at: https://myaccount.google.com/apppasswords');
    console.error('   2. For SendGrid: Use "apikey" as username and API key as password');
    console.error('   3. Check host and port are correct');
    console.error('   4. Verify credentials are correct (no typos)');
    console.error('   5. Check firewall/network settings\n');
    process.exit(1);
  } else {
    console.log('✅ SMTP Connection Successful!\n');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    // Ask if user wants to send a test email
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('📨 Send a test email? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        rl.question('📧 Enter recipient email address: ', (recipient) => {
          console.log('\n📤 Sending test email...\n');
          
          const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: recipient,
            subject: '✅ ScoreX Assessment - Email Configuration Test',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">✅ Email Configuration Successful!</h2>
                <p>Your ScoreX Maturity Assessment email configuration is working correctly.</p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Configuration Details:</h3>
                  <ul style="list-style: none; padding: 0;">
                    <li>📧 <strong>SMTP Host:</strong> ${process.env.EMAIL_HOST}</li>
                    <li>🔌 <strong>Port:</strong> ${process.env.EMAIL_PORT}</li>
                    <li>👤 <strong>User:</strong> ${process.env.EMAIL_USER}</li>
                    <li>📤 <strong>From:</strong> ${process.env.EMAIL_FROM || process.env.EMAIL_USER}</li>
                  </ul>
                </div>
                
                <p>You can now:</p>
                <ul>
                  <li>✅ Send assessment assignment notifications</li>
                  <li>✅ Send reminder emails to participants</li>
                  <li>✅ Notify authors of completed assessments</li>
                </ul>
                
                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                  This is a test email from the ScoreX Maturity Assessment Platform.<br>
                  Timestamp: ${new Date().toISOString()}
                </p>
              </div>
            `
          };
          
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('❌ Failed to send test email!\n');
              console.error('Error:', error.message);
              console.error('\n💡 The SMTP connection works, but sending failed.');
              console.error('   This might be due to:');
              console.error('   1. Sender email not verified with provider');
              console.error('   2. Rate limits exceeded');
              console.error('   3. Recipient email blocked/invalid\n');
            } else {
              console.log('✅ Test email sent successfully!\n');
              console.log(`   Message ID: ${info.messageId}`);
              console.log(`   Recipient:  ${recipient}`);
              console.log('\n📬 Check the recipient\'s inbox (and spam folder).\n');
              console.log('═══════════════════════════════════════════════════════════\n');
              console.log('🎉 Email configuration is fully working!\n');
            }
            rl.close();
            process.exit(error ? 1 : 0);
          });
        });
      } else {
        console.log('\n✅ Configuration test complete!\n');
        console.log('Your email settings are correct and ready to use.\n');
        rl.close();
        process.exit(0);
      }
    });
  }
});


