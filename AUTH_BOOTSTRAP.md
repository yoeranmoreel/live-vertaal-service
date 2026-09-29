# Auth bootstrap — Pilot V3

## Roles

- `teacher`: group/session workspace
- `schoolAdmin`: school members and groups + teacher capabilities
- `platformAdmin`: platform-level administration; hidden route `/platform-beheer-portal`

The hidden URL is convenience, not security. Firestore independently verifies the platform admin document.

## First platform admin

The first admin is intentionally not self-service. Create the Firebase Authentication user, copy its UID, then create:

```text
platformAdmins/{AUTH_UID}
  displayName: <name>
  email: <email>
  createdAt: <timestamp>
```

For pilot school access, also create:

```text
schools/school-demo/members/{AUTH_UID}
  displayName: <name>
  role: schoolAdmin
  groupIds: []
```

After this one-time bootstrap, platform admin tooling can be expanded to manage later schools/accounts without exposing a public signup flow.
