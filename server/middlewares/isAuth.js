import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken || !verifyToken.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    return res.status(500).json({ message: `isAuth error: ${error.message}` });
  }
};

export default isAuth;