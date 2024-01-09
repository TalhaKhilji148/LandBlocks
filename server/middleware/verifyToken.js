import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  console.log("Valueeeeee", req.headers.authorization); // Log the authorization header

  if (!req.headers.authorization) {
    return res.status(403).json({ msg: "Not authorized. No token" });
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        console.error("Expired Token");
        return res.status(403).json({ msg: "Token has expired" });
      } else {
        req.user = data; // data = {id: user._id}
        next();
      }
    });
  }
};

export default verifyToken;
