const zod = require('zod');

// Define the validation schema for the email
const emailSchema = zod.object({
  email: zod.string().email("Invalid email format").min(1, "Email is required")
});

// Validate the email
const result = emailSchema.safeParse({ email: "chaitanya.sharma09315@gmail.com" });

if (result.success) {
  console.log("Valid email");
} else {
  console.error("Invalid email:", result.error.errors);
}
