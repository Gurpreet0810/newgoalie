import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jsonwebtoken from "jsonwebtoken";
import { isTokenBlacklisted } from "../utils/blacklist.js";

const jwt = jsonwebtoken;

export const verifyUser = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
 

  if (!authorizationHeader) {
    return res.status(401).json(new ApiError(401, [], "Authorization header missing"));
  }

  const token = authorizationHeader.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json(new ApiError(401, [], "Token missing from authorization header"));
  }

  const isBlacklisted = isTokenBlacklisted(token);

  if (isBlacklisted) {
    return res.status(401).json(new ApiError(401, [], "Authorization failed: Token is invalid or expired"));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    req.decoded = decoded; // Attach decoded token to req object
    req.token = token; // Attach the token to req object
    next();
  } catch (err) {
    return res.status(401).json(new ApiError(401, [], "Authorization failed: Token is invalid or expired"));
  }
});
