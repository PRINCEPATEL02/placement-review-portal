mkdir frontend
cd frontend
mkdir public src
type nul > public/index.html
cd src
mkdir assets components pages services context utils
type nul > App.jsx
type nul > main.jsx
type nul > routes.jsx
cd pages
mkdir auth
type nul > auth/Login.jsx
type nul > auth/ForgotPassword.jsx
mkdir student
type nul > student/StudentHome.jsx
type nul > student/AddReview.jsx
type nul > student/StudentProfile.jsx
mkdir admin
type nul > admin/AdminDashboard.jsx
type nul > admin/ManageReviews.jsx
type nul > admin/AdminProfile.jsx
cd ..
type nul > components/Navbar.jsx
type nul > components/Footer.jsx
type nul > components/ReviewCard.jsx
type nul > components/ProtectedRoute.jsx
type nul > services/authService.js
type nul > services/reviewService.js
type nul > services/userService.js
type nul > context/AuthContext.jsx
type nul > utils/roleCheck.js
cd ..
type nul > package.json
cd ..
mkdir backend
cd backend
mkdir config models controllers routes middlewares utils
type nul > server.js
type nul > package.json
cd config
type nul > db.js
type nul > jwt.js
cd ..
cd models
type nul > Login.js
type nul > User.js
type nul > Post.js
cd ..
cd controllers
type nul > authController.js
type nul > userController.js
type nul > postController.js
cd ..
cd routes
type nul > authRoutes.js
type nul > userRoutes.js
type nul > postRoutes.js
cd ..
cd middlewares
type nul > authMiddleware.js
type nul > roleMiddleware.js
cd ..
cd utils
type nul > passwordHash.js
type nul > sendEmail.js
cd ..
cd ..
mkdir database
type nul > database/login.schema.md
type nul > database/user.schema.md
type nul > database/post.schema.md
type nul > .env
type nul > .gitignore
type nul > README.md
