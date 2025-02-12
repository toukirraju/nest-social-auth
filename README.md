# Social Authentication using Google OAuth

This project demonstrates how to implement social authentication in a NestJS API using Google OAuth.

## Overview

Social authentication allows users to log in to your application using their existing social media accounts. This project focuses on integrating Google OAuth for user authentication.

## Features

- User authentication via Google OAuth
- Secure token-based authentication
- Easy integration with NestJS framework

## Getting Started

### Prerequisites

- Node.js
- NestJS CLI
- Google Developer account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/social-auth-api.git
```

2. Install dependencies:

```bash
cd social-auth-api
npm install
```

### Configuration

1. Create a new project in the [Google Developer Console](https://console.developers.google.com/).
2. Configure OAuth consent screen and create OAuth 2.0 credentials.
3. Set up environment variables with your Google OAuth credentials:

```bash
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Running the Application

Start the NestJS application:

```bash
npm run start
```

## Usage

- Navigate to `http://localhost:3000/auth/google` to initiate the Google OAuth flow.
- After successful authentication, you will receive a token to access protected routes.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss improvements.

## License

This project is licensed under the MIT License.
