-- =====================================================
-- Contact Email Trigger via Resend + pg_net
-- Run in Supabase SQL Editor
-- =====================================================

-- 1. Remove old trigger and function
DROP TRIGGER IF EXISTS on_contact_message_insert ON contact_messages;
DROP FUNCTION IF EXISTS notify_contact_message();

-- 2. Enable pg_net
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 3. Function: fires Resend API when a new contact message arrives
CREATE OR REPLACE FUNCTION notify_contact_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  BEGIN
    PERFORM net.http_post(
      url     := 'https://api.resend.com/emails'::text,
      headers := jsonb_build_object(
        'Authorization', 'Bearer YOUR_RESEND_API_KEY', -- Replace with your Resend API Key
        'Content-Type',  'application/json'
      ),
      body    := jsonb_build_object(
        'from',     'Portfolio Contact <onboarding@resend.dev>',
        'to',       jsonb_build_array('dhinesh280105@gmail.com'),
        'reply_to', NEW.email,
        'subject',  '📬 New message from ' || NEW.name || CASE WHEN NEW.subject IS NOT NULL AND NEW.subject <> '' THEN ' — ' || NEW.subject ELSE '' END,
        'html',     '<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">'
                 || '<div style="background:#0E1D61;padding:24px 32px;border-radius:12px 12px 0 0;">'
                 || '<h2 style="color:#B89A5A;margin:0;">New Portfolio Message</h2></div>'
                 || '<div style="padding:32px;border:1px solid #e2d9c9;border-top:none;border-radius:0 0 12px 12px;background:#fefdfa;">'
                 || '<p><strong>Name:</strong> ' || NEW.name || '</p>'
                 || '<p><strong>Email:</strong> <a href="mailto:' || NEW.email || '">' || NEW.email || '</a></p>'
                 || '<p><strong>Subject:</strong> ' || COALESCE(NEW.subject, '—') || '</p>'
                 || '<div style="background:#f7f4ef;padding:16px;border-radius:8px;border-left:3px solid #B89A5A;margin-top:16px;">'
                 || '<p style="margin:0;white-space:pre-wrap;">' || NEW.message || '</p></div>'
                 || '<p style="font-size:12px;color:#999;margin-top:24px;">Hit Reply to respond · Dhinesh AI Portfolio</p>'
                 || '</div></div>'
      )
    );
  EXCEPTION WHEN OTHERS THEN
    -- If network call encounters any issue, do not abort saving the contact message in the DB
    RAISE WARNING 'Failed to send Resend email via pg_net: %', SQLERRM;
  END;
  RETURN NEW;
END;
$$;

-- 4. Trigger: runs AFTER every INSERT into contact_messages
CREATE TRIGGER on_contact_message_insert
  AFTER INSERT ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_message();
