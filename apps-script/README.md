# Google Apps Script Backend

> **Status: Active runbook; email authorization and deployment are pending.** Track completion in [PROJECT_STATUS.md](../PROJECT_STATUS.md).

`Code.gs` is the canonical source for the Google Apps Script web app that stores applications in the founder-owned Sheet and emails `apply@gentlemansprotocol.com`.

## Publish an update

1. Open the application Google Sheet.
2. Select **Extensions → Apps Script**.
3. Replace the live `Code.gs` contents with this repository's `Code.gs`.
4. Save the project.
5. Select `testNotificationEmail` in the function dropdown and run it once.
6. Approve the `MailApp` permission when Google prompts.
7. Confirm the test reaches `apply@gentlemansprotocol.com`.
8. Select **Deploy → Manage deployments**.
9. Open the existing web-app deployment and click **Edit**.
10. Select **New version**, then click **Deploy**.

Update the existing deployment rather than creating another deployment. This preserves the `/exec` URL configured in `wrangler.jsonc`.

## Response contract

After storing an application, the script returns:

```json
{
  "result": "success",
  "notification": "sent"
}
```

If email delivery fails after the row is stored, it returns `"notification": "failed"` while keeping `"result": "success"`. Applicants should not be encouraged to create duplicate Sheet rows because a notification failed.
