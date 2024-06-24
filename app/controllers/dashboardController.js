const Article = require('../models/articleModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');

exports.getDashboardStats = async (req, res) => {
  try {
    // Tổng số người dùng
    const totalUsers = await User.countDocuments();

    // Tổng số bài viết
    const totalArticles = await Article.countDocuments();

    // // Tổng số danh mục
    const totalCategories = await Category.countDocuments();

    // Lấy thời gian hiện tại và thời gian đầu ngày hôm qua
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    // Số người dùng mới trong ngày hôm qua
    const newUsersYesterday = await User.countDocuments({
      dateCreated: { $gte: startOfYesterday, $lt: startOfToday }
    });

    // Số bài viết mới trong ngày hôm qua
    const newArticlesYesterday = await Article.countDocuments({
      dateCreated: { $gte: startOfYesterday, $lt: startOfToday }
    });

    // Số danh mục mới trong ngày hôm qua
    const newCategoriesYesterday = await Category.countDocuments({
      dateCreated: { $gte: startOfYesterday, $lt: startOfToday }
    });

    // Tính tỷ lệ tăng trưởng
    const userGrowthRate = totalUsers > 0 ? (newUsersYesterday / totalUsers) * 100 : 0;
    const articleGrowthRate = totalArticles > 0 ? (newArticlesYesterday / totalArticles) * 100 : 0;
    const categoryGrowthRate = totalCategories > 0 ? (newCategoriesYesterday / totalCategories) * 100 : 0;

    res.json({
      totalUsers: totalUsers,
      userGrowthRate: userGrowthRate,
      totalArticles: totalArticles,
      articleGrowthRate: articleGrowthRate,
      totalCategories: totalCategories,
      categoryGrowthRate: categoryGrowthRate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
