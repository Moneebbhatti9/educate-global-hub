# Educate Global Hub - Frontend

A modern, responsive web application for connecting educators with educational institutions worldwide. Built with React, TypeScript, and Tailwind CSS.

## Overview

Educate Global Hub is a comprehensive educational marketplace and recruitment platform that connects:
- **Teachers** seeking employment opportunities
- **Schools** looking to hire qualified educators
- **Resource creators** sharing educational materials

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Shadcn/ui | UI Components |
| TanStack Query | Server State Management |
| React Router v6 | Routing |
| React Hook Form | Form Handling |
| Zod | Validation |
| Axios | HTTP Client |
| Socket.io Client | Real-time Communication |

## Features

### For Teachers
- Profile creation with comprehensive CV builder
- Job search and application management
- Resource marketplace (upload and sell educational materials)
- Forum participation and networking
- Earnings dashboard and withdrawal management

### For Schools
- Job posting and management
- Candidate search and application review
- School profile management
- Analytics dashboard

### For All Users
- Real-time notifications
- Forum discussions
- Resource marketplace
- GDPR-compliant privacy controls

### Security & Compliance
- JWT-based authentication with refresh tokens
- Secure token storage
- GDPR compliance (cookie consent, data export, deletion requests)
- Input validation and sanitization

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Backend API running (see [educate-global-hub-node](../educate-global-hub-node))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/educate-global-hub.git
cd educate-global-hub
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── apis/              # API client and endpoint definitions
│   ├── client.ts      # Axios instance with interceptors
│   ├── auth.ts        # Authentication API
│   ├── gdpr.ts        # GDPR-related API
│   ├── jobs.ts        # Job-related API
│   └── ...
├── components/
│   ├── ui/            # Shadcn/ui components
│   ├── gdpr/          # GDPR components (cookie consent, privacy)
│   ├── Modals/        # Modal components
│   └── skeletons/     # Loading skeletons
├── contexts/          # React contexts (Auth, Socket)
├── helpers/           # Utility functions
│   ├── storage.ts     # Secure storage helpers
│   ├── jwt.ts         # JWT utilities
│   └── validation.ts  # Zod schemas
├── hooks/             # Custom React hooks
├── layout/            # Layout components
├── pages/
│   ├── admin/         # Admin dashboard pages
│   ├── teacher/       # Teacher dashboard pages
│   ├── school/        # School dashboard pages
│   ├── legal/         # Legal pages (Privacy, Terms, GDPR)
│   └── ...
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | Yes |

## GDPR Compliance

This application includes built-in GDPR compliance features:

- **Cookie Consent Banner**: Appears on first visit with Accept/Reject/Customize options
- **Cookie Preference Manager**: Granular control over cookie types
- **Data Export**: Users can download all their data in JSON format
- **Account Deletion**: Users can request account deletion
- **Consent Recording**: All consent actions are logged

Access privacy settings at: **Settings > Privacy**

## API Integration

The frontend communicates with the backend through a structured API layer:

```typescript
// Example: Using the GDPR API
import { useGDPR } from '@/apis/gdpr';

const { exportData, requestDeletion } = useGDPR();

// Export user data
const data = await exportData.mutateAsync();

// Request deletion
await requestDeletion.mutateAsync({ confirmEmail, reason });
```

## Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Environment Variables for Production

Set the following in your deployment platform:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Related

- [Backend Repository](../educate-global-hub-node) - Node.js/Express API
- [API Documentation](http://localhost:5000/api-docs) - Swagger documentation (when backend is running)

## Support

For support, email support@educatelink.com or join our community forum.
