require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerOptions'); // Import the Swagger options

const app = express();
const port = process.env.PORT || 3000;

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, // Cho phép gửi cookies
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Swagger setup


const authRoute = require('./app/routes/authRoutes');
const categoryRoutes = require('./app/routes/categoryRoutes');
const articleRoutes = require('./app/routes/articleRoutes');
const userRoutes = require('./app/routes/userRoutes');
const dashboardRoutes = require('./app/routes/dashboardRoutes');
const applicationRoutes = require('./app/routes/applicationRoutes');
const commentRoutes = require('./app/routes/commentRoutes');


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoute);
app.use('/api/categories', categoryRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/comment', commentRoutes);


// Xử lý lỗi 404
app.use((req, res, next) => {
  next(createError(404));
});

// Xử lý các lỗi khác
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {},
  });
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
