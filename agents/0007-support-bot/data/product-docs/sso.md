# Single sign-on (SSO)

SSO lets Enterprise customers authenticate through their identity provider.

## Availability

SAML SSO is available on the **Enterprise** plan only. Pro and Free workspaces must use email/password or Google sign-in.

## Configure SAML SSO

Enterprise admins configure SSO as follows:

1. Open **Settings → Security**.
2. Click **SAML SSO**.
3. Enter your IdP metadata URL or upload the metadata XML.
4. Copy the **ACS URL** and **Entity ID** into your IdP.
5. Click **Enable SSO** and test with a single admin account before enforcing.

## Enforce SSO

After a successful test, toggle **Require SSO for all members** on the same page. Local passwords are disabled for non-break-glass users.

Contact **support@taskflow.app** to enable Enterprise SSO on your contract.
