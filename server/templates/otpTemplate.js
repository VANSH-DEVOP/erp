const otpTemplate = (otp) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ERP OTP Verification</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      background-color: #0b0f19;
      color: #ffffff;
    }

    .container {
      max-width: 600px;
      margin: 25px auto;
      background: rgba(15, 20, 35, 0.92);
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #1d2437;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.6);
    }

    .header {
      background-color: #1d2437;
      padding: 22px;
      text-align: center;
      font-size: 26px;
      font-weight: bold;
      color: #e8f9fd;
      border-bottom: 2px solid #0f172a;
    }

    .content {
      padding: 25px;
      text-align: center;
    }

    .content p {
      font-size: 16px;
      line-height: 1.6;
      color: #cbd5e1;
    }

    .otp-box {
      background-color: #ff1e00;
      color: #ffffff;
      display: inline-block;
      font-size: 32px;
      font-weight: bold;
      padding: 14px 34px;
      border-radius: 8px;
      letter-spacing: 4px;
      margin: 25px 0;
      box-shadow: 0 0 12px rgba(255, 30, 0, 0.7);
    }

    .icon-badge {
      width: 55px;
      height: 55px;
      background-color: #59ce8f;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 15px;
      font-size: 30px;
      font-weight: bold;
      color: #0b0f19;
    }

    .footer {
      background: rgba(15, 20, 35, 0.92);
      padding: 12px;
      text-align: center;
      font-size: 13px;
      color: #cbd5e1;
      border-top: 1px solid #1d2437;
    }

    .footer a {
      color: #e8f9fd;
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      Online ERP System
    </div>

    <div class="content">
      <div class="icon-badge">✔</div>

      <p>Hello User,</p>
      <p>We received a request to verify your email for your Online ERP account.
         Please use the OTP below to continue with secure access:</p>

      <div class="otp-box">${otp}</div>

      <p>If you did not request this action, kindly ignore this message or contact the ERP support team immediately.</p>
    </div>

    <div class="footer">
      <p>&copy; 2025 Online ERP System. All Rights Reserved.</p>
      <p><a href="#">Privacy Policy</a> | <a href="#">Contact Support</a></p>
    </div>
  </div>
</body>
</html>`;
};

module.exports = otpTemplate;
