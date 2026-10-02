Na raiz do repositório:

```bash
firebase deploy
```

O predeploy compila `functions` e `web` antes de publicar Firestore, Cloud Functions e Hosting.

web 
```bash 
cd web && yar dev
```

functions deploy
```
npm --prefix functions run build
```

## Estrutura

```text
.
├── firebase.json
├── .firebaserc
├── firestore.rules
├── firestore.indexes.json
├── functions
│   ├── package.json
│   ├── tsconfig.json
│   └── src
│       ├── index.ts
│       └── messages
│           └── promoteDueMessages.ts
└── web
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── eslint.config.js
    ├── tsconfig.json
    ├── tsconfig.app.json
    ├── tsconfig.node.json
    ├── public
    │   ├── favicon.svg
    │   └── icons.svg
    └── src
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── theme.ts
        ├── routes.ts
        ├── types.ts
        ├── vite-env.d.ts
        ├── components
        │   ├── AppLayout.tsx
        │   ├── AuthLayout.tsx
        │   ├── ConfirmDialog.tsx
        │   ├── EmptyState.tsx
        │   ├── FormDialog.tsx
        │   ├── FullScreenLoader.tsx
        │   ├── NotificationProvider.tsx
        │   ├── PasswordField.tsx
        │   ├── RouteGuards.tsx
        │   └── notifications.ts
        ├── features
        │   ├── auth
        │   │   ├── AuthContext.ts
        │   │   ├── AuthProvider.tsx
        │   │   └── useAuth.ts
        │   ├── connections
        │   │   ├── ConnectionCard.tsx
        │   │   ├── ConnectionFormDialog.tsx
        │   │   └── useConnections.ts
        │   ├── contacts
        │   │   ├── ContactFormDialog.tsx
        │   │   ├── ContactsPanel.tsx
        │   │   └── useContacts.ts
        │   └── messages
        │       ├── BroadcastPanel.tsx
        │       ├── ContactPicker.tsx
        │       ├── MessageCard.tsx
        │       ├── MessageComposer.tsx
        │       ├── MessageEditDialog.tsx
        │       ├── MessageFields.tsx
        │       ├── draft.ts
        │       └── useMessages.ts
        ├── hooks
        │   └── useSubscription.ts
        ├── lib
        │   ├── auth.ts
        │   ├── errors.ts
        │   ├── firebase.ts
        │   ├── format.ts
        │   ├── phone.ts
        │   └── firestore
        │       ├── connections.ts
        │       ├── contacts.ts
        │       ├── messages.ts
        │       └── shared.ts
        ├── pages
        │   ├── ConnectionDetailPage.tsx
        │   ├── ConnectionsPage.tsx
        │   ├── LoginPage.tsx
        │   └── SignUpPage.tsx
        └── utils
            └── index.ts
```
