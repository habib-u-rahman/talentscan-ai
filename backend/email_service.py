import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime


def _cfg():
    return {
        "host":     os.getenv("SMTP_HOST", "smtp.gmail.com"),
        "port":     int(os.getenv("SMTP_PORT", "587")),
        "user":     os.getenv("SMTP_USER", ""),
        "password": os.getenv("SMTP_PASSWORD", ""),
        "from":     os.getenv("FROM_EMAIL", os.getenv("SMTP_USER", "")),
        "app_url":  os.getenv("APP_URL", "http://localhost:3000"),
    }


def _send(to_email: str, subject: str, html: str):
    cfg = _cfg()
    if not cfg["user"] or not cfg["password"]:
        print(f"[EMAIL] SMTP not configured — skipping email to {to_email}")
        return
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = f"TalantScan AI <{cfg['from']}>"
        msg["To"]      = to_email
        msg.attach(MIMEText(html, "html"))
        with smtplib.SMTP(cfg["host"], cfg["port"], timeout=10) as srv:
            srv.ehlo()
            srv.starttls()
            srv.login(cfg["user"], cfg["password"])
            srv.sendmail(cfg["from"], to_email, msg.as_string())
        print(f"[EMAIL] Sent '{subject}' to {to_email}")
    except Exception as e:
        print(f"[EMAIL] Failed → {to_email}: {e}")


# ── Shared shell ─────────────────────────────────────────────────────────────

def _shell(title: str, body: str) -> str:
    year = datetime.now().year
    return f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
<tr><td align="center">
<table width="540" cellpadding="0" cellspacing="0"
  style="max-width:540px;width:100%;background:#fff;border-radius:16px;overflow:hidden;
         box-shadow:0 2px 20px rgba(0,0,0,0.09);">

  <!-- Header -->
  <tr>
    <td style="background:#4f46e5;padding:28px 36px;">
      <p style="margin:0;font-size:20px;font-weight:700;color:#fff;letter-spacing:-0.3px;">
        Talant<span style="color:#a5b4fc;">Scan</span> AI
      </p>
      <p style="margin:3px 0 0;font-size:10px;color:rgba(255,255,255,0.55);
         letter-spacing:2px;text-transform:uppercase;">NLP Resume AI</p>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding:36px;">
      {body}
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#f8fafc;border-top:1px solid #e2e8f0;
       padding:18px 36px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">
        © {year} TalantScan AI &nbsp;·&nbsp; NLP Resume Screening Platform
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>"""


def _btn(href: str, text: str) -> str:
    return (
        f'<a href="{href}" style="display:inline-block;background:#4f46e5;color:#fff;'
        f'text-decoration:none;font-size:15px;font-weight:700;padding:13px 36px;'
        f'border-radius:10px;letter-spacing:0.1px;">{text}</a>'
    )


# ── 1. Email Verification ────────────────────────────────────────────────────

def send_verification_email(to_email: str, name: str, token: str):
    link       = f"{_cfg()['app_url']}/verify-email?token={token}"
    first_name = (name or "there").split()[0]

    body = f"""
<p style="margin:0 0 6px;font-size:22px;">✉️</p>
<h2 style="margin:0 0 10px;font-size:20px;font-weight:800;color:#0f172a;">Verify your email</h2>
<p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
  Hi <b>{first_name}</b>, just one step left — click the button below to
  activate your TalantScan AI account.
</p>

<p style="margin:0 0 28px;">{_btn(link, "✅  Verify Email Address")}</p>

<p style="margin:0 0 8px;font-size:12px;color:#94a3b8;">Or copy this link into your browser:</p>
<p style="margin:0 0 24px;font-size:12px;word-break:break-all;">
  <a href="{link}" style="color:#4f46e5;">{link}</a>
</p>

<p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
  If you didn't create this account, you can safely ignore this email.
  This link does not expire.
</p>"""

    _send(to_email, "Verify your TalantScan AI account", _shell("Verify Email", body))


# ── 2. Welcome email ─────────────────────────────────────────────────────────

def send_welcome_email(to_email: str, name: str):
    first_name = (name or "there").split()[0]
    link       = f"{_cfg()['app_url']}/home"

    body = f"""
<p style="margin:0 0 6px;font-size:28px;">🎉</p>
<h2 style="margin:0 0 10px;font-size:20px;font-weight:800;color:#0f172a;">
  Welcome, {first_name}!
</h2>
<p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
  Your TalantScan AI account is now active. Here's what you can do:
</p>

<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
  <tr>
    <td style="background:#f5f3ff;border-left:3px solid #4f46e5;border-radius:8px;
       padding:12px 16px;margin-bottom:8px;">
      <b style="color:#0f172a;font-size:14px;">📊 AI Resume Screener</b><br>
      <span style="color:#64748b;font-size:13px;">Rank multiple resumes by job-fit in seconds.</span>
    </td>
  </tr>
  <tr><td style="height:8px;"></td></tr>
  <tr>
    <td style="background:#f0fdf4;border-left:3px solid #16a34a;border-radius:8px;
       padding:12px 16px;">
      <b style="color:#0f172a;font-size:14px;">🧠 NLP Skill Extraction</b><br>
      <span style="color:#64748b;font-size:13px;">Auto-detect matched &amp; missing skills.</span>
    </td>
  </tr>
  <tr><td style="height:8px;"></td></tr>
  <tr>
    <td style="background:#fff7ed;border-left:3px solid #ea580c;border-radius:8px;
       padding:12px 16px;">
      <b style="color:#0f172a;font-size:14px;">📈 Pipeline Visualization</b><br>
      <span style="color:#64748b;font-size:13px;">See TF-IDF scores and cosine similarity.</span>
    </td>
  </tr>
</table>

<p style="margin:0 0 28px;">{_btn(link, "🚀  Go to Dashboard")}</p>

<p style="margin:0;font-size:13px;color:#94a3b8;">
  Ready to save hours on resume screening? Let's get started!
</p>"""

    _send(to_email, f"Welcome to TalantScan AI, {first_name}! 🎉", _shell("Welcome", body))


# ── 3. Password Reset ────────────────────────────────────────────────────────

def send_password_reset_email(to_email: str, name: str, token: str):
    link       = f"{_cfg()['app_url']}/reset-password?token={token}"
    first_name = (name or "there").split()[0]

    body = f"""
<p style="margin:0 0 6px;font-size:22px;">🔑</p>
<h2 style="margin:0 0 10px;font-size:20px;font-weight:800;color:#0f172a;">Reset your password</h2>
<p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
  Hi <b>{first_name}</b>, we received a request to reset your TalantScan AI password.
  Click the button below to set a new one.
</p>

<p style="margin:0 0 20px;">{_btn(link, "🔒  Reset My Password")}</p>

<p style="margin:0 0 20px;font-size:13px;color:#92400e;background:#fffbeb;
   border:1px solid #fcd34d;border-radius:8px;padding:12px 16px;">
  ⚠️ This link expires in <b>1 hour</b>.
  If you didn't request this, ignore this email.
</p>

<p style="margin:0 0 8px;font-size:12px;color:#94a3b8;">Or copy this link:</p>
<p style="margin:0;font-size:12px;word-break:break-all;">
  <a href="{link}" style="color:#4f46e5;">{link}</a>
</p>"""

    _send(to_email, "Reset your TalantScan AI password", _shell("Reset Password", body))
