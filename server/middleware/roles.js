const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access denied. Admin only" });
  }
  next();
};

const isStudent = (req, res, next) => {
  if (!req.user || req.user.role !== "Student") {
    return res.status(403).json({ message: "Access denied. Student only" });
  }
  next();
};

const isFaculty = (req, res, next) => {
  if (!req.user || req.user.role !== "Faculty") {
    return res.status(403).json({ message: "Access denied. Faculty only" });
  }
  next();
};

module.exports = { isAdmin, isStudent, isFaculty };
