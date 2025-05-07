# Creator Dashboard

A full-stack application for content creators to manage their social media presence, track engagement, and earn credits through platform interactions.

[Creator Dashboard](https://vertxai-creator-dashboard.vercel.app)

## Features

### User Authentication

- Secure JWT-based authentication
- User registration and login
- Role-based access control (user/admin)
- Protected routes

### Dashboard & Analytics

- Overview of user activity and credits
- Credit history visualization with charts
- Recent activity tracking
- Saved content management

### Feed Aggregator

- Content from multiple platforms (Twitter, Reddit, LinkedIn)
- Filter by source
- Save, share, and report content
- Earn credits through interactions

### Credit System

- Earn credits through daily logins
- Profile completion rewards
- Content interaction rewards
- Credit transaction history

### Profile Management

- User profile customization
- Social media links
- Profile completion tracking

### Admin Features

- User management
- Credit adjustment
- Content moderation
- System statistics

### Notifications

- Real-time notifications
- Mark as read/unread
- Clear notifications
- Individual notification management

## Tech Stack

### Frontend

- React.js
- React Router for navigation
- Tailwind CSS for styling
- Recharts for data visualization
- Axios for API requests
- React Icons
- React Hot Toast for notifications

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Cors, Helmet, Morgan for security and logging

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

#### Clone the repository

```bash
git clone https://github.com/vishnuu5/vertxai--CreatorDashboard.git
cd creator-dashboard
```

#### Backend Setup

# Navigate to server directory

```bash
cd server
npm install
```

# Create .env file (see Environment Variables section)

touch .env

# Start the development server

```bash
npm run dev
```

#### Frontend Setup

# Install dependencies

cd client

```bash
npm install
```

# Create .env file

touch .env

# Add the following to the .env file

REACT_APP_API_URL=http://localhost:5000/api

# Start the development server

npm start

```bash
npm start
```

### Environment Variables

#### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.mongodb.net/creator-dashboard
JWT_SECRET=your_jwt_secret_key_here
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token

### Users

- `GET /api/users/me` - Get current user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Posts

- `GET /api/posts/feed` - Get feed posts
- `POST /api/posts/save` - Save a post
- `GET /api/posts/saved` - Get saved posts
- `POST /api/posts/share` - Share a post
- `POST /api/posts/report` - Report a post

### Credits

- `POST /api/credits/add` - Add credits
- `POST /api/credits/daily-login` - Get daily login credit
- `GET /api/credits/history` - Get credit history

### Activity

- `GET /api/activity/recent` - Get recent activity

### Admin

- `GET /api/admin/stats` - Get admin stats
- `GET /api/admin/users` - Get all users
- `POST /api/admin/credits` - Update user credits
- `GET /api/admin/reports` - Get reported content
- `PUT /api/admin/reports/:id/resolve` - Resolve a report

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Recharts](https://recharts.org/)
