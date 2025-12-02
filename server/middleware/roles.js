export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access denied. Admin only" });
  }
  next();
};

export const isStudent = (req, res, next) => {
  if (!req.user || req.user.role !== "Student") {
    return res.status(403).json({ message: "Access denied. Student only" });
  }
  next();
};

export const isFaculty = (req, res, next) => {
  if (!req.user || req.user.role !== "Faculty") {
    return res.status(403).json({ message: "Access denied. Faculty only" });
  }
  next();
};
