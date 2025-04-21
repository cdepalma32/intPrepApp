# IntPrepApp (WIP 🚧)

> Actively finalizing authentication logic, protected routes, and secure token handling.
> README in progress — full breakdown and demo coming soon.

---

### 🔐 Security Practices & Token Management

As part of implementing secure authentication for this application, I followed real-world best practices with an emphasis on token safety, environment protection, and recovery workflows:

---

### ✅ Environment & Credential Security

- **.env Security:**  
  Environment variables are stored in a `.env` file and properly excluded using `.gitignore` to prevent accidental exposure of sensitive data.

- **Credential Rotation:**  
  After unintentionally pushing a `.env` file early in development, I:
  - Rotated all affected credentials (JWT secrets, MongoDB URI)
  - Migrated from local MongoDB Compass to a secure **MongoDB Atlas Cloud** cluster
  - Documented the process and remediation steps as a learning milestone

---

### 🔐 Authentication System

- **Access Tokens:**  
  Short-lived and stored in memory (via React Context) for improved security

- **Refresh Tokens:**  
  Persisted in `localStorage` to enable seamless re-authentication

- **Token Rotation:**  
  A `/api/users/refresh` endpoint:
  - Verifies refresh tokens
  - Issues new access tokens
  - Rotates the refresh token to prevent reuse

---

### 🛡️ Optional Enhancements (Post-MVP)

- **Token Blacklisting**  
  For invalidated refresh tokens to prevent reuse after logout or suspicious activity

- **Admin-Only Route Protection**  
  Enforced via role-based middleware for privileged endpoints

---

### 💡 Preparedness & Growth

> _"Tell me about a time you handled a security-related issue?"_

This project gave me real-world practice with:
- Rotating secrets
- Securing deployments
- Handling mistakes proactively
- Thinking like a production-minded developer

It reflects my focus on building features that are not just functional - but secure, scalable, and production-ready.


---
