const login = async (req, res) => {
  // Xác thực thông tin người dùng
  // Tạo token
  // Trả về token
  res.json({ message: 'Login' });
}

const register = async (req, res) => {
  
}

module.exports = {
  login,
  register
};