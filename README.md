# Blog Management System

This project was developed as a technical assignment to demonstrate full-stack development skills, including REST API development, authentication, CRUD operations, media uploads, comments, likes, and responsive UI design. 
The application provides a public blog interface where visitors can view, like, comment, and share blog posts, along with an admin dashboard for managing blog content.

## Features

### Public Features

- View all published blogs
- View individual blog details
- Support for multiple content types:
  - Images
  - GIFs
  - Videos
  - External URLs
- Like blog posts
- Add comments without registration
- View comments
- Share blogs using the browser Share API
- Clipboard fallback for sharing
- Responsive design for mobile, tablet, and desktop

### Admin Features

- Predefined admin account
- Secure admin login using JWT authentication
- Protected admin dashboard
- Create new blogs
- Edit blog title and description
- Replace existing images
- Replace existing GIFs
- Replace existing videos
- Update external URLs
- Delete blogs
- View comments for individual blogs
- Delete comments
- Logout
- Upload progress indicator for large files

### Media Upload

For uploaded content:

- Images are uploaded to Cloudinary
- GIFs are uploaded to Cloudinary
- Videos are uploaded to Cloudinary
- Only the Cloudinary URL is stored in MongoDB
- Large video uploads use chunked uploading
- Frontend displays upload progress while updating media

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary
- CORS

## Project Structure

```text
blog-project/
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── blogController.js
│   │   └── commentController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Blog.js
│   │   └── Comment.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── blogRoutes.js
│   │
│   ├── scripts/
│   │   └── createAdmin.js
│   │
│   ├── utils/
│   │   └── cloudinaryUpload.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md