const otpTemplate = (otp) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>OTP Verification</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #f5f7fa;
      color: #333;
    }
    .container {
      max-width: 520px;
      margin: 35px auto;
      background: #ffffff;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      padding: 30px;
    }
    h2 {
      text-align: center;
      margin-bottom: 10px;
      color: #1f2937;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #4b5563;
      text-align: center;
    }
    .otp-box {
      margin: 22px auto;
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 5px;
      color: #1f2937;
      background: #e8eefc;
      width: fit-content;
      padding: 12px 28px;
      border-radius: 6px;
      border: 1px solid #b9c6fa;
    }
    .footer {
      font-size: 13px;
      text-align: center;
      color: #6b7280;
      margin-top: 25px;
      border-top: 1px solid #e5e7eb;
      padding-top: 12px;
    }
  </style>
</head>

<body>
  <div class="container">
    <h2>Email Verification</h2>

    <p>Please use the One-Time Password (OTP) below to verify your Online ERP account:</p>

    <div class="otp-box">${otp}</div>

    <p>If you didn’t request this, you can safely ignore this email.</p>

    <div class="footer">
      © 2025 Online ERP System
    </div>
  </div>
</body>
</html>`;
};

module.exports = otpTemplate;
