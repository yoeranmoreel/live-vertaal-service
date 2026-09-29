# Firebase bootstrap — Pilot V3

The V3 client is configured for Firestore and listens in realtime. The database is intentionally **closed by default** until teacher authentication is enabled.

## Firestore model

```text
schools/{schoolId}
  name
  createdAt

schools/{schoolId}/members/{uid}
  displayName
  role: teacher | schoolAdmin
  groupIds: []

schools/{schoolId}/groups/{groupId}
  name
  teacherIds: []
  teacherNames: []

schools/{schoolId}/sessions/{sessionId}
  groupId
  title
  scheduledDate
  scheduledStartTime
  status: planned | live | ended
  publicCode
  summaryEnabled
  participantCount
  createdAt
  startedAt
  endedAt
```

## Security direction

- No unauthenticated school/group/session access.
- Teachers and school admins are school members.
- Group/member management is reserved for school admins.
- Public parent access is **not** implemented by opening Firestore. It gets a separate minimal public-token flow.
- Session child collections are closed until their exact realtime rules are implemented.

## Next bootstrap step

Enable the chosen teacher sign-in provider, create the first pilot user, then create its member document using that Firebase Auth UID. After that the V3 preview can read/write the shared pilot school without relaxing the rules.
