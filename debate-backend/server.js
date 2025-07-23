// const express =require("express");  
// // import express framework
// const app = express();
// //  an instance of express or we make an app (server )using express
// const port = 3001;
// // port number on which the server will run
// app.use(express.json());
// // middleware to parse JSON data from incoming requests
// // // This allows our server to read JSON data (like form input)
// app.get("/",(req,res)=>{
//     res.send("debate backend is live");
// })
// // when someone opens your site’s homepage, send this message.
// app.listen(port,()=>{
//     console.log(`Server is running on port ${port}`);
//     // this will log a message to the console when the server starts
// })


const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT || 3001;
const app = express();
// connect to MongoDB
// middleware to parse JSON data from incoming requests
app.use(express.json());
// This allows our server to read JSON data (like form input)
const authRoutes = require("./routes/authroutes");
const cors = require('cors');
app.use(cors());
app.use("/api/auth", authRoutes);
// This sets up the authentication routes so that when someone goes to /api/auth/signup, it will use the authRoutes defined in authroutes.js.
// This way, we keep our code organized and separate the authentication logic from other parts of the application.

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const moduleRoutes = require("./routes/moduleRoutes");
app.use("/api/modules", moduleRoutes);

const progressRoutes = require("./routes/Progressroutes");
app.use("/api/progress", progressRoutes);



const feedbackRoutes = require("./routes/feedbackRoutes");
app.use("/api/feedback", feedbackRoutes);


const judgeRoutes = require("./routes/judgeRoutes");
app.use("/api/judge", judgeRoutes);

const userStatsRoutes = require("./routes/userStatsRoutes");
app.use("/api/user", userStatsRoutes);

const quizRoutes = require("./routes/quizRoutes");
app.use("/api/quiz", quizRoutes);
// // This sets up the quiz routes so that when someone goes to /api/quiz/submit, it will use the submitQuiz function defined in quizController.js.







const audioRoutes = require("./routes/audioRoutes");
app.use(express.json());
app.use("/api", audioRoutes); // 👈 register routes





app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.get("/",(req,res)=>{
    res.send("debate backend is live");
})
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Error connecting to DB:", err.message);
});


