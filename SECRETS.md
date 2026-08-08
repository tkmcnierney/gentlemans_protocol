# Local Secret Storage

> **Status: Active operating reference.** Current credential follow-ups are tracked in [PROJECT_STATUS.md](PROJECT_STATUS.md).

Gentleman's Protocol credentials are stored outside the repository in:

`/home/lukasc/.config/gentlemans-protocol/secrets/`

The directory must use mode `700`, and each credential file must use mode `600`.

## Files

- `cloudflare-launch-token` — long-standing, scoped Cloudflare maintenance token
- `posthog-personal-token` — scoped PostHog analytics-operator token

The temporary Turnstile setup token was revoked and its local file deleted on August 8, 2026.

Never commit, print, paste into chat, or include the contents of these files in logs. Rotate a credential immediately if its contents may have been exposed.

## Safe verification

The following displays only filenames, permissions, and byte counts:

```bash
find /home/lukasc/.config/gentlemans-protocol/secrets \
  -maxdepth 1 -type f -printf '%f mode=%m bytes=%s\n'
```
