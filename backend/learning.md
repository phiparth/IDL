WHAT IS BACKEND?
[Imagine a frontend like a waiter — it takes your order.
The backend is the kitchen — it prepares the food (data) and sends it back.
Frontend: Button, form, website
Backend: Saves data, checks passwords, gives you your badges or levels, stores progress]

WHAT IS NODE JS
[Node.js lets us use JavaScript to run programs outside the browser.
Normally JS runs in Chrome. But with Node.js, we can use it to build servers — like our debate app’s backend.
We use Node + a helpful framework called Express to:
Receive requests
Run logic
Return responses]

What’s a server?
[A server is just a program that listens to the internet.
It says: "Hey, if someone goes to /signup, I’ll do X".
In backend terms:
"/" → homepage
"/signup" → signup route
"/login" → login route
"/progress" → update learning progress
Each one of these is called a route.]
 [now creater a server by yourself]

 WHAT IS MONGODB?
[We are building a debate platform where users:
Sign up
Earn points
Unlock badges
You need a place to store that data.
MongoDB is that data storage system, like a notebook for your app.]e
[Terms We Need to Know (Simple Explanation)
Term	Meaning (Simple)
Database	A folder (e.g., debateDB)
Collection	A category (e.g., users, modules, progress)
Document	A single item (e.g., user Lucky's data)
MongoDB	The system to hold these documents]

WHAT IS DOTENV?
[🌱 What is dotenv?
dotenv is a Node.js package that loads environment variables from a .env file into your Node.js project.
⸻
🔧 Why use it?
Imagine you have sensitive data like:
	•	MongoDB URI
	•	API keys
	•	Port number
	•	Secret tokens
You don’t want to hardcode them in your source code like this:
Benefits:
	•	.env is not committed to Git if added to .gitignore.
	•	Easy to change configs without editing your JS code.
	•	Cleaner, safer, and industry-standard.]

 WHAT IS TIMESTAMP ?
 [
    ⏱️ What does { timestamps: true } mean in Mongoose?

This option tells Mongoose to automatically add two fields to your schema:

⸻

✅ 1. createdAt
	•	Stores the date and time when the document was created.

✅ 2. updatedAt
	•	Stores the date and time when the document was last modified.
 ]
Routes → Define the path (e.g., /signup)
Controllers → Logic for what happens when user hits the path


WHAT IS BYCRYPT ?
🔸 bcryptjs is a library that helps us hide passwords using hashing. This makes your app more secure.


DIFF B/W SYNC AND ASYNC FUNCTION ?
🔄 Synchronous (sync) vs Asynchronous (async) — Simple Explanation:

🧠 Imagine this:

You’re cooking Maggi in the kitchen. While the water is boiling (which takes 5 minutes), do you:
	1.	🪑 Sit and wait doing nothing? (synchronous)
	2.	🧹 Clean your room while the water boils? (asynchronous)

WHAT IS AWAIT ?
await means “wait for this to finish before going to the next line.”
But it only works inside an async function
eg const maggi = await boilWater();“Don’t cook Maggi yet — first, wait for the water to boil.”

LOGIC OF LOGIN?
Authenticate User & Return Token

What is JWT (JSON Web Token)?
It’s like an ID card. Once a user logs in, we give them a token.
They send it with every request, and we know it's them — no password needed every time.
This token is:
Signed using a secret (your JWT_SECRET)
Sent in headers (like "authorization")
Verified by backend to allow access

*Protect Routes Using JWT (Token Middleware)
 Why do we need this?
Let’s say your app has a route:
bash
Copy
Edit
GET /profile
You only want logged-in users to access it.
So how do we check if someone is logged in?
✅ We ask them to send their token in every request
🔐 We verify the token to decide if the user is allowed*

