# 🐦 Twitter-Clone API

A RESTful social media backend built with **Node.js, Express, and MongoDB**.  
This API allows user authentication, posting, liking, commenting, following users, and notification handling — similar to Twitter functionality.

---

## 🛠️ Tech Stack

- Node.js & Express.js  
- MongoDB & Mongoose  
- JWT Authentication & Cookies  
- Cloudinary for image uploads  
- Bcrypt for password hashing  
- REST API design

---

## 📁 Project Structure

```
twitter_api/
├── controllers/        # API business logic
├── routes/             # API endpoints
├── Middleware/         # Auth & route protection
├── models/             # Mongoose schemas
├── lib/                # Utilities (JWT generation)
├── server.js           # Entry point
└── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/AadilTamboli01/twitter_api.git
cd twitter_api
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file in the root folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4️⃣ Run Server

```bash
npm start
```

Server runs at `http://localhost:5000`

---

# 🔐 Authentication Routes

| Method | Endpoint       | Description                   | Protected |
|--------|----------------|-------------------------------|-----------|
| POST   | /auth/signup   | Register a new user           | ❌        |
| POST   | /auth/login    | Login user & set JWT cookie   | ❌        |
| POST   | /auth/logout   | Logout user                   | ✅        |
| GET    | /auth/me       | Get current logged-in user    | ✅        |

---

# 📝 Post Routes

| Method | Endpoint               | Description                               | Protected |
|--------|-----------------------|-------------------------------------------|-----------|
| POST   | /posts/create         | Create a post with text or image          | ✅        |
| GET    | /posts/all            | Get all posts                             | ✅        |
| GET    | /posts/following      | Get posts from people you follow          | ✅        |
| GET    | /posts/user/:username | Get posts by a specific user              | ✅        |
| GET    | /posts/likes/:id      | Get all posts liked by a user             | ✅        |
| POST   | /posts/like/:id       | Like or unlike a post                      | ✅        |
| POST   | /posts/comment/:id    | Add comment to a post                      | ✅        |
| DELETE | /posts/:id            | Delete a post                              | ✅        |

---

# 🔔 Notification Routes

| Method | Endpoint       | Description                       | Protected |
|--------|----------------|-----------------------------------|-----------|
| GET    | /notifications | Get all notifications             | ✅        |
| DELETE | /notifications | Delete all notifications          | ✅        |
| DELETE | /notifications/:id | Delete a single notification   | ✅        |

---

# 👤 User Routes

| Method | Endpoint              | Description                                | Protected |
|--------|----------------------|--------------------------------------------|-----------|
| GET    | /users/profile/:username | Get profile of a user                     | ✅        |
| GET    | /users/suggested       | Get suggested users to follow             | ✅        |
| POST   | /users/follow/:id      | Follow or unfollow a user                 | ✅        |
| POST   | /users/update          | Update profile info (username, bio, images, password) | ✅ |

---

# 💾 Features

- User authentication with JWT & cookies  
- Create, like, comment, and delete posts  
- Follow/unfollow users  
- Get feed posts from people you follow  
- Notification system for likes, comments, and follows  
- Cloudinary image upload for posts, profile, and cover images  
- Password hashing with bcrypt  

---

# 📡 API Usage Examples

### Signup

```http
POST /auth/signup
Content-Type: application/json

{
  "fullName": "Aadil Tamboli",
  "username": "aadil",
  "email": "aadil@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "id": "userId",
  "username": "aadil",
  "email": "aadil@example.com",
  "followers": [],
  "following": [],
  "profileImg": null,
  "coverImg": null
}
```

---

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "aadil",
  "password": "123456"
}
```

Response:

```json
{
  "id": "userId",
  "username": "aadil",
  "email": "aadil@example.com",
  "followers": [],
  "following": [],
  "profileImg": null,
  "coverImg": null
}
```

---

### Create Post

```http
POST /posts/create
Content-Type: application/json
Authorization: Bearer <token>

{
  "text": "Hello world!",
  "img": "base64_or_image_url"
}
```

Response:

```json
{
  "_id": "postId",
  "user": "userId",
  "text": "Hello world!",
  "img": "image_url",
  "likes": [],
  "comments": []
}
```

---

### Follow / Unfollow User

```http
POST /users/follow/:id
Authorization: Bearer <token>
```

Response:

```json
{
  "message": "User followed successfully"
}
```

---

# 🚀 Future Improvements

- Add pagination for posts & notifications  
- Add real-time notifications with sockets  
- Add search for users & hashtags  
- Add rate limiting & security enhancements  
- Deploy backend to cloud (Heroku / Render / Vercel)

---

# 👨‍💻 Author

**Aadil Tamboli**  
Software Engineer | Java • Full-Stack Development • Scalable Systems  
GitHub: [https://github.com/AadilTamboli01](https://github.com/AadilTamboli01)
