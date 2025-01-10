import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const isCustomAuth = token.length < 500;
    let decodedData;

    if (isCustomAuth) {
      try {
        decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedData?.id;
      } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub; // Google OAuth user ID
    }

    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export default auth;
