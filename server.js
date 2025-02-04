import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import Blocks from "./src/components/InitializedCodeBlocks.js";

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// MongoDB Connection
// local - "mongodb://localhost:27017/online-coding"
mongoose.connect("mongodb+srv://edenhotz:edenhotz1997@cluster0.rpc9d.mongodb.net/?retryWrites=true&w=majority&appName=cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// added solution part - change if doesnot work
// Define CodeBlock Schema
const codeBlockSchema = new mongoose.Schema({
  id: String,  // Unique identifier for each code block
  title: String,
  content: String, // Code content
  solution: String,
  hint: String,
});

const CodeBlock = mongoose.model("CodeBlock", codeBlockSchema);

await CodeBlock.deleteMany({}); // Deletes all existing records
// Initialize Default Code Blocks (Run Once)
const initializeCodeBlocks = async () => {
  const count = await CodeBlock.countDocuments();
  if (count === 0) {
    await CodeBlock.insertMany(Blocks);
    console.log("Default code blocks initialized.");
  }
};

initializeCodeBlocks();

// localy - "http://localhost:3000"
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store active users
let mentors = {};

app.get("/codeblocks", async (req, res) => {
  const codeBlocks = await CodeBlock.find();
  res.json(codeBlocks);
});

// WebSocket Connection
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_codeblock", async (codeblockId) => {
    socket.join(codeblockId);

    const roomSize = io.sockets.adapter.rooms.get(codeblockId)?.size || 0;
    const mentor = roomSize === 1 ? socket.id : null;
    if (roomSize === 1) {
      mentors[codeblockId] = socket.id; // Assign mentor
    }
    const studentCount = Math.max(roomSize - 1, 0);

    io.to(codeblockId).emit("update_user_data", { mentor, studentCount });

    // Retrieve code block from MongoDB
    const codeBlock = await CodeBlock.findOne({ id: codeblockId });
    if (codeBlock) {
      socket.emit("load_code_and_hint", {content: codeBlock.content, hint: codeBlock.hint});
    }
  });

  socket.on("code_update", async ({ codeblockId, newCode }) => {
    socket.to(codeblockId).emit("code_update", newCode);

    // Update code in MongoDB
    const codeBlock = await CodeBlock.findOneAndUpdate(
      { id: codeblockId },
      { content: newCode },
      { new: true }
    );
    
    console.log(newCode)
    console.log(codeBlock)
    // Check if the submitted code matches the solution
    if (codeBlock && codeBlock.solution && newCode.trim() === codeBlock.solution.trim()) {
      io.to(codeblockId).emit("solution_matched"); // Send event when solution is correct
    }
  });

    // New event listener for 'leave_codeblock' to update the student count when a user leaves
    socket.on("leave_codeblock", async (codeblockId) => {
      socket.leave(codeblockId);
  
      const roomSize = io.sockets.adapter.rooms.get(codeblockId)?.size || 0;
      const studentCount = Math.max(roomSize - 1, 0); // Exclude the mentor
  
      io.to(codeblockId).emit("update_user_data", { mentor: mentors[codeblockId], studentCount });
    });

  socket.on("disconnect", async () => {
    console.log(`User Disconnected: ${socket.id}`);
    for (const [codeblockId, mentorId] of Object.entries(mentors)) {
      if (mentorId === socket.id) {
        console.log(`Mentor left code block ${codeblockId}`);

        // Reset code in database
        await CodeBlock.findOneAndUpdate({ id: codeblockId }, { content: "// Code Reset" });

        // Notify students & redirect them
        io.to(codeblockId).emit("mentor_left");

        // Remove mentor tracking
        delete mentors[codeblockId];
      }
    }
 });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// first
// import express from "express";
// const app = express();
// import { createServer } from "http";
// import { Server } from "socket.io";
// import cors from "cors";
// import mongoose from "mongoose";


// app.use(cors());

// const server = createServer(app);
// app.use(express.json()); // Middleware to parse JSON

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// let users = []; // Store connected users

// io.on("connection", (socket) => {
//   users.push(socket.id); // Add user to list
//   const mentor = users[0]; // First user is the mentor
//   const studentCount = users.length > 1 ? users.length - 1 : 0; // Students are all other users

//   console.log(`User Connected: ${socket.id} | Mentor: ${mentor} | Students: ${studentCount}`);

//   // Emit mentor and student count to all clients
//   io.emit("update_user_data", { mentor, studentCount });

//   socket.on("disconnect", () => {
//     users = users.filter((id) => id !== socket.id); // Remove user from list
//     const newMentor = users[0] || null; // Update mentor if needed
//     const updatedStudentCount = users.length > 0 ? users.length - 1 : 0;

//     console.log(`User Disconnected: ${socket.id} | Mentor: ${newMentor} | Students: ${updatedStudentCount}`);

//     io.emit("update_user_data", { mentor: newMentor, studentCount: updatedStudentCount });
//   });

//   socket.on('code_update', (newCode) => {
//     socket.broadcast.emit('codeUpdate', newCode);
// });

// });

// server.listen(5000, () => {
//   console.log("Server running on port 5000"); 
// }); 