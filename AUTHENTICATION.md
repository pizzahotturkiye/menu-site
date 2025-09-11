# Authentication System Documentation

## Overview

This application implements a secure authentication system for admin access using JWT tokens and bcrypt password hashing.

## Features

- ✅ **Secure password hashing** using bcryptjs with salt rounds of 12
- ✅ **JWT token-based authentication** with configurable expiration
- ✅ **HTTP-only cookies** for secure token storage
- ✅ **Role-based access control** (Admin role required)
- ✅ **Protected API endpoints** (all modification endpoints require auth)
- ✅ **Client-side route protection** using AuthGuard component
- ✅ **Server-side middleware protection** for admin routes
- ✅ **Automatic token validation** and refresh

## Protected Routes

### Admin Pages
- `/admin` - Main admin dashboard (requires authentication)
- `/admin/*` - All admin sub-routes (protected by middleware)

### API Endpoints
**Protected (require admin authentication):**
- `POST /api/categories` - Create category
- `PUT /api/categories/[id]` - Update category  
- `DELETE /api/categories/[id]` - Delete category
- `POST /api/menu-items` - Create menu item
- `PUT /api/menu-items/[id]` - Update menu item
- `DELETE /api/menu-items/[id]` - Delete menu item
- `POST /api/ingredients` - Create ingredient
- `POST /api/upload` - Upload files

**Public (no authentication required):**
- `GET /api/categories` - List categories
- `GET /api/categories/[id]` - Get category details
- `GET /api/menu-items` - List menu items
- `GET /api/menu-items/[id]` - Get menu item details
- `GET /api/ingredients` - List ingredients

## Default Admin Credentials

```
Email: admin@pizzapalace.com
Password: admin123
```

**⚠️ IMPORTANT: Change these credentials in production!**

## Authentication Flow

1. **Login**: User submits email/password to `/api/auth/login`
2. **Verification**: Server validates credentials against database
3. **Token Generation**: JWT token created with user info and role
4. **Cookie Setting**: Token stored in HTTP-only cookie
5. **Route Protection**: Middleware validates token on protected routes
6. **Logout**: Token cookie cleared on `/api/auth/logout`

## Security Features

### Password Security
- Passwords hashed using bcryptjs with 12 salt rounds
- Original passwords never stored in database
- Secure password comparison during login

### Token Security
- JWT tokens signed with secret key
- 24-hour expiration by default
- HTTP-only cookies prevent XSS attacks
- Secure cookies in production (HTTPS only)
- SameSite=lax for CSRF protection

### Route Protection
- Server-side middleware validates all admin routes
- Client-side AuthGuard component for UI protection
- API endpoints protected with authentication middleware
- Role-based access control (admin role required)

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication (REQUIRED)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-minimum-32-characters-long"

# Optional
NODE_ENV="development"
```

## Creating Additional Admin Users

To create additional admin users, you can:

1. **Use the script**: Run `node scripts/create-admin.js` (modify the script first)
2. **Use Prisma Studio**: `npx prisma studio` and add users manually
3. **Create programmatically**: Use the `hashPassword` function from `src/lib/auth.ts`

## API Authentication

When making API requests from the client, authentication is automatic through cookies. For external API access:

1. First authenticate via `/api/auth/login`
2. Include the returned cookie in subsequent requests
3. Use `/api/auth/me` to verify authentication status

## Error Handling

The system handles various error scenarios:

- **Invalid credentials**: Returns 401 with error message
- **Expired tokens**: Automatically redirects to login
- **Missing permissions**: Returns 403 for non-admin users
- **Network errors**: Graceful error handling with user feedback

## File Structure

```
src/
├── lib/
│   ├── auth.ts              # Core authentication functions
│   ├── config.ts            # Configuration and environment setup
│   └── middleware-auth.ts   # API route protection middleware
├── app/
│   ├── admin/
│   │   ├── login/page.tsx   # Login page component
│   │   └── page.tsx         # Protected admin dashboard
│   └── api/
│       └── auth/            # Authentication API routes
│           ├── login/route.ts
│           ├── logout/route.ts
│           └── me/route.ts
├── components/
│   └── AuthGuard.tsx        # Client-side route protection
└── middleware.ts            # Next.js middleware for route protection
```

## Security Best Practices Implemented

1. **Password Hashing**: Uses bcrypt with sufficient salt rounds
2. **Secure Cookies**: HTTP-only, secure in production, SameSite protection
3. **Token Validation**: Proper JWT verification with error handling
4. **Input Validation**: Email format validation and required field checks
5. **Error Messages**: Generic error messages to prevent user enumeration
6. **HTTPS**: Secure cookies only enabled in production
7. **Session Management**: Proper token expiration and cleanup

## Production Deployment Checklist

- [ ] Change default admin credentials
- [ ] Set strong JWT_SECRET environment variable (32+ characters)
- [ ] Ensure HTTPS is enabled
- [ ] Set NODE_ENV=production
- [ ] Review and update token expiration time if needed
- [ ] Set up proper database backup and security
- [ ] Consider implementing rate limiting for login attempts
- [ ] Monitor authentication logs

## Troubleshooting

**Login not working:**
- Check if admin user exists in database
- Verify JWT_SECRET is set
- Check browser network tab for API errors

**Redirecting to login repeatedly:**
- Check if cookies are being set/sent
- Verify middleware configuration
- Check for CORS issues in production

**API requests failing:**
- Ensure authentication cookie is present
- Check user role (must be 'admin')
- Verify token hasn't expired

