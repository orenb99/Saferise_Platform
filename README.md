# Saferise Platform

A secure web application with React frontend and Node.js backend, featuring user authentication with Israeli ID validation.

## Features

- 🔐 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- 🇮🇱 **Israeli ID Validation**: Built-in validation for Israeli government IDs
- 🛡️ **Security Features**: Rate limiting, CORS, input sanitization, XSS protection
- 📱 **Responsive Design**: Modern, mobile-friendly UI
- 🎭 **Role-based Access**: Support for Employee, Supervisor, and Director roles
- ⚡ **Real-time Feedback**: Toast notifications for user actions

## Tech Stack

### Frontend
- React 18
- React Router DOM
- React Hook Form
- Axios
- React Hot Toast
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Express Validator for input validation
- Helmet for security headers
- Express Rate Limit for DDoS protection

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **MongoDB** (version 4.4 or higher)
- **npm** or **yarn**

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Saferise-Platform
   ```

2. **Install dependencies for all parts**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/saferise
   JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production
   NODE_ENV=development
   ```

   **Important**: Change the `JWT_SECRET` to a strong, random string in production!

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

## Running the Application

### Development Mode

1. **Start both frontend and backend simultaneously**
   ```bash
   npm run dev
   ```
   
   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:3000`

### Individual Components

1. **Backend only**
   ```bash
   npm run server
   ```

2. **Frontend only**
   ```bash
   npm run client
   ```

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new user account |
| POST | `/api/auth/signin` | Sign in user |
| GET | `/api/auth/me` | Get current user info (protected) |

### Request/Response Examples

#### Sign Up
```json
POST /api/auth/signup
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "israeliId": "123456789",
  "role": "Employee",
  "password": "SecurePass123!"
}
```

#### Sign In
```json
POST /api/auth/signin
{
  "fullName": "John Doe",
  "israeliId": "123456789",
  "password": "SecurePass123!"
}
```

## Security Features

- **Password Requirements**: Minimum 8 characters with uppercase, lowercase, number, and special character
- **Israeli ID Validation**: Validates against Israeli ID checksum algorithm
- **Rate Limiting**: 
  - General: 100 requests per 15 minutes
  - Auth routes: 5 requests per 15 minutes
- **Input Sanitization**: XSS protection and NoSQL injection prevention
- **Secure Headers**: Helmet.js for security headers
- **JWT Tokens**: 24-hour expiration with automatic refresh
- **CORS Protection**: Configured for development and production environments

## User Roles

- **Employee**: Basic user role
- **Supervisor**: Mid-level management role
- **Director**: High-level management role

## Frontend Pages

1. **Sign Up Page**: User registration with form validation
2. **Sign In Page**: User authentication
3. **Main Page**: Welcome dashboard with user information

## Project Structure

```
Saferise-Platform/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── validation.js        # Input validation
│   ├── models/
│   │   └── User.js              # User schema with Israeli ID validation
│   ├── routes/
│   │   └── auth.js              # Authentication routes
│   ├── package.json
│   └── server.js                # Express server
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js   # Global auth state
│   │   ├── pages/
│   │   │   ├── SignUp.js
│   │   │   ├── SignIn.js
│   │   │   └── MainPage.js
│   │   ├── services/
│   │   │   └── api.js           # API calls and interceptors
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── package.json                 # Root package for scripts
└── README.md
```

## Validation Rules

### Israeli ID
- Must be exactly 9 digits
- Must pass Israeli ID checksum validation algorithm

### Password
- Minimum 8 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter
- Must contain at least one number
- Must contain at least one special character (@$!%*?&)

### Full Name
- 2-100 characters
- Letters and spaces only (supports Hebrew characters)

### Email
- Valid email format
- Automatically converted to lowercase

## Error Handling

The application includes comprehensive error handling:

- **Frontend**: Toast notifications for user feedback
- **Backend**: Detailed error responses with proper HTTP status codes
- **Validation**: Client-side and server-side validation
- **Authentication**: Token expiration and refresh handling

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-super-secure-production-secret
```

### Build Frontend
```bash
cd frontend
npm run build
```

### Security Considerations for Production
1. Use a strong JWT secret
2. Set up proper CORS origins
3. Use HTTPS
4. Set up proper MongoDB authentication
5. Use environment variables for all secrets
6. Consider using a reverse proxy (nginx)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`

2. **JWT Token Issues**
   - Check if JWT_SECRET is set
   - Verify token is being sent in Authorization header

3. **CORS Issues**
   - Ensure frontend URL is in CORS origins
   - Check proxy setting in frontend package.json

4. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill process using the port: `lsof -ti:5000 | xargs kill -9`

## Development

### Adding New Features
1. Backend: Add routes in `backend/routes/`
2. Frontend: Add components in `frontend/src/components/`
3. Update API service in `frontend/src/services/api.js`

### Testing
- Backend: Add tests using Jest/Mocha
- Frontend: Use React Testing Library

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please create an issue in the repository.
