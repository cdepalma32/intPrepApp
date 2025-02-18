import bcrypt from "bcryptjs";

// Use the exact password from registration
const enteredPassword = "YourTestPasswordHere";

// Copy & paste the stored hash from MongoDB Compass
const storedHashedPassword = "YourStoredHashHere";

bcrypt.compare(enteredPassword, storedHashedPassword, function (err, result) {
    if (err) console.error("❌ Error:", err);
    console.log("🔍 Manually Comparing Passwords... Match?", result ? "✅ YES" : "❌ NO");
});
