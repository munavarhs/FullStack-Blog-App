# Blog Application (MERN Stack)

## **Overview**
This project is a **Blog Application** built using the **MERN Stack** (MongoDB, Express.js, React, Node.js). It allows users to create, edit, and manage blog posts with a rich-text editor powered by **React Quill**. The application features user authentication using **JWT (JSON Web Tokens)** for secure access and provides functionalities like image uploads and dynamic content management.

---

## **Features**

### **User Authentication**
- Secure user login and registration with JWT-based authentication.
- Persistent user sessions with token management.
- Role-based access to resources (e.g., only authors can edit their posts).

### **Post Management**
- **Create New Posts**: Users can compose posts using a rich text editor (**React Quill**) with advanced formatting options.
- **Edit Existing Posts**: Edit content, update summaries, and modify uploaded images dynamically.
- **Delete Posts**: Remove unwanted posts from the platform.
- **View Posts**: A clean and responsive interface to display blog content.

### **File Upload**
- Users can upload images for their blog posts.
- Uploaded images are stored in the server's file system and dynamically rendered.

### **Rich Text Editing**
- Powered by **React Quill**, enabling features like:
  - Bold, italic, and underline formatting.
  - Lists, links, and media embedding.
  - Header styles and blockquotes.

### **Responsive Design**
- Fully responsive front-end, optimized for desktop and mobile devices.

---

## **Technology Stack**

### **Frontend**
- **React**: Dynamic and responsive user interface.
- **React Router**: Navigation and routing between pages.
- **React Quill**: Rich-text editor for post content creation and editing.
- **Axios**: For API calls to the backend.

### **Backend**
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for handling routes and middleware.
- **Multer**: Middleware for handling file uploads.
- **JWT**: Secure token-based authentication.

### **Database**
- **MongoDB**: Document-oriented database to store user and blog post data.

---

## **Features in Detail**

### **Authentication**
1. **Registration**:
   - Users register with their email, username, and password.
   - Passwords are securely hashed before storing in the database.
2. **Login**:
   - Users authenticate with their credentials.
   - A JWT token is generated and stored for secure session management.

---

### **Post Management**
- **Create Post**:
  - Compose posts with a title, summary, content, and optional image.
- **Edit Post**:
  - Modify post content, title, summary, or image.
  - Authorization ensures only the original author can edit the post.
- **Delete Post**:
  - Authenticated authors can delete their posts.

---

### **Image Uploads**
- Users can upload images as part of their blog posts.
- Images are stored in a server-side folder and linked dynamically in posts.

---

## **Installation Instructions**

### **Prerequisites**
- Node.js and npm installed.
- MongoDB installed and running.

### **Steps to Run the Project**

1. Clone the repository:
   bash
   git clone https://github.com/username/blog-app-mern.git
   cd blog-app-mern
