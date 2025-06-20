# API Usage Examples

This document provides examples of how to use the authentication endpoints.

## Prerequisites

1. Make sure the server is running on `http://localhost:3000`
2. Set up your environment variables (see `.env` file)

## Authentication Examples

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}
```

### 2. Login User

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

### 3. Using the JWT Token

Save the token from the login response and use it for authenticated requests:

```bash
# Replace YOUR_JWT_TOKEN with the actual token from login response
curl -X GET http://localhost:3000/protected-route \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Error Examples

### Registration Errors

**User Already Exists:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Response (409):**

```json
{
  "success": false,
  "error": {
    "message": "User already exists"
  }
}
```

**Validation Error:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jo",
    "email": "invalid-email",
    "password": "123"
  }'
```

**Response (400):**

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      "Username must be at least 3 characters long",
      "Invalid email format",
      "Password must be at least 6 characters long"
    ]
  }
}
```

### Login Errors

**Invalid Credentials:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "wrongpassword"
  }'
```

**Response (401):**

```json
{
  "success": false,
  "error": {
    "message": "Invalid credentials"
  }
}
```

## JavaScript/Node.js Examples

### Using fetch API

```javascript
// Register user
const registerUser = async userData => {
  const response = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  return await response.json();
};

// Login user
const loginUser = async credentials => {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  return await response.json();
};

// Make authenticated request
const makeAuthenticatedRequest = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
};

// Usage example
const main = async () => {
  try {
    // Register
    const registerResult = await registerUser({
      username: 'john_doe',
      email: 'john@example.com',
      password: 'securepassword123',
    });

    console.log('Registration result:', registerResult);

    // Login
    const loginResult = await loginUser({
      email: 'john@example.com',
      password: 'securepassword123',
    });

    console.log('Login result:', loginResult);

    // Use token for authenticated requests
    if (loginResult.success) {
      const protectedData = await makeAuthenticatedRequest(
        'http://localhost:3000/protected-route',
        loginResult.data.token
      );

      console.log('Protected data:', protectedData);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
```

## Testing with Postman

1. **Register User:**

   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/register`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):

   ```json
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Login User:**

   - Method: `POST`
   - URL: `http://localhost:3000/api/auth/login`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):

   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. **Authenticated Request:**
   - Method: `GET`
   - URL: `http://localhost:3000/api/protected-route`
   - Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
