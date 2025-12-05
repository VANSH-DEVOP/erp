# Course Registration System (MERN)

A complete Course Registration System web application with authentication, role-based access (Admin / Faculty / Student), course offerings, and student management.

This README explains how to install and run the project on your local system.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite), Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Authentication | OTP Email Verification + JWT |
| Others | bcrypt, dotenv, nodemon |

---

---

## ✨ Features

✔ OTP email verification  
✔ Login + JWT authentication  
✔ Role-based access (Admin / Faculty / Student)  
✔ Course offering creation and registration  
✔ Student and faculty profiles  
✔ Secure protected routes  
✔ Pastel-themed responsive UI  

---

## 🔧 Useful npm Scripts

| Location | Command | Action |
|----------|---------|--------|
| server | `npm run dev` | Start backend in dev mode |
| server | `npm start` | Run backend in production |
| client | `npm run dev` | Start React frontend |
| client | `npm run build` | Build production bundle |
| client | `npm run preview` | Preview build |

---

## 🧩 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error | Ensure backend allows `http://localhost:5173` |
| API Not Working | Check `VITE_API_URL` in `client/.env` |
| MongoDB not connecting | Verify `MONGO_URI` and MongoDB status |
| OTP not sending | Update correct `EMAIL_USER` + app password |

---

## 📌 Notes

- Rename `.env.example` to `.env` if provided.
- To deploy, update `CLIENT_URL` and `VITE_API_URL` with live URLs.

---

## 📄 License

This project is open-source. You may modify or extend it for personal or academic use.
