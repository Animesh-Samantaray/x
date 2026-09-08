const twoFAOtpTemplate = (otp) => {
  return `
    <div style="margin:0; padding:0; background:#080b12; font-family:'Segoe UI',Arial,sans-serif; color:#e5e7eb; min-height:100%;">

      <div style="padding:40px 20px;">

        <!-- Main Card -->
        <div style="
          max-width:520px;
          margin:0 auto;
          background:#111827;
          border:1px solid #263244;
          border-radius:18px;
          overflow:hidden;
          box-shadow:0 20px 50px rgba(0,0,0,0.45);
        ">

          <!-- Header -->
          <div style="
            padding:32px 25px;
            text-align:center;
            background:linear-gradient(135deg,#111827,#172554,#111827);
            border-bottom:1px solid #263244;
          ">

            <!-- Security Icon -->
            <div style="
              width:64px;
              height:64px;
              margin:0 auto 18px;
              background:#1e293b;
              border:1px solid #334155;
              border-radius:50%;
              line-height:64px;
              font-size:30px;
              box-shadow:0 0 25px rgba(59,130,246,0.25);
            ">
              🔐
            </div>

            <h2 style="
              margin:0;
              color:#ffffff;
              font-size:24px;
              font-weight:700;
              letter-spacing:-0.3px;
            ">
              Collaborative Knowledge MarketPlace
            </h2>

            <p style="
              margin:8px 0 0;
              color:#94a3b8;
              font-size:13px;
            ">
              Secure Account Verification
            </p>

          </div>


          <!-- Body -->
          <div style="padding:38px 30px; text-align:center;">

            <div style="
              display:inline-block;
              background:#052e16;
              border:1px solid #166534;
              color:#4ade80;
              padding:7px 14px;
              border-radius:20px;
              font-size:12px;
              font-weight:600;
              margin-bottom:20px;
            ">
              🛡️ TWO-FACTOR AUTHENTICATION
            </div>

            <h3 style="
              margin:0 0 12px;
              color:#f8fafc;
              font-size:23px;
              font-weight:650;
            ">
              Verify It's Really You
            </h3>

            <p style="
              margin:0 auto 28px;
              max-width:400px;
              color:#94a3b8;
              font-size:15px;
              line-height:1.7;
            ">
              A two-factor authentication request was made for your
              Collaborative Knowledge MarketPlace account.
              Enter the verification code below to continue securely.
            </p>


            <!-- OTP Section -->
            <div style="
              margin:0 auto 22px;
              padding:24px 20px;
              background:linear-gradient(135deg,#0f172a,#172554);
              border:1px solid #1d4ed8;
              border-radius:14px;
              box-shadow:0 0 30px rgba(37,99,235,0.15);
            ">

              <p style="
                margin:0 0 12px;
                color:#64748b;
                font-size:11px;
                font-weight:600;
                letter-spacing:2px;
                text-transform:uppercase;
              ">
                Your Verification Code
              </p>

              <div style="
                color:#60a5fa;
                font-family:'Courier New',monospace;
                font-size:36px;
                font-weight:700;
                letter-spacing:10px;
                padding-left:10px;
              ">
                ${otp}
              </div>

            </div>


            <!-- Timer -->
            <div style="
              display:inline-block;
              background:#422006;
              border:1px solid #92400e;
              color:#fbbf24;
              padding:10px 16px;
              border-radius:8px;
              font-size:13px;
              font-weight:500;
            ">
              ⏳ Code expires in <strong>10 minutes</strong>
            </div>


            <p style="
              margin:28px 0 0;
              color:#64748b;
              font-size:13px;
              line-height:1.6;
            ">
              For your security, never share this code with anyone.
              Our team will never ask you for your OTP.
            </p>


            <!-- Security Notice -->
            <div style="
              margin-top:28px;
              padding:16px;
              text-align:left;
              background:#0f172a;
              border:1px solid #1e293b;
              border-radius:10px;
            ">

              <p style="
                margin:0 0 7px;
                color:#cbd5e1;
                font-size:13px;
                font-weight:600;
              ">
                🚨 Didn't request this?
              </p>

              <p style="
                margin:0;
                color:#64748b;
                font-size:12px;
                line-height:1.6;
              ">
                Someone may be trying to access your account.
                Do not enter or share this OTP. You can safely ignore
                this email and your account will remain protected.
              </p>

            </div>

          </div>


          <!-- Footer -->
          <div style="
            padding:22px;
            text-align:center;
            background:#0b1120;
            border-top:1px solid #1e293b;
          ">

            <p style="
              margin:0 0 6px;
              color:#64748b;
              font-size:12px;
            ">
              © ${new Date().getFullYear()} Collaborative Knowledge MarketPlace
            </p>

            <p style="
              margin:0;
              color:#475569;
              font-size:11px;
            ">
              This is an automated security email. Please do not reply.
            </p>

          </div>

        </div>

      </div>

    </div>
  `;
};

export default twoFAOtpTemplate;