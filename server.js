import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import Blocks from "./src/components/InitializedCodeBlocks.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// MongoDB Connection
// local - "mongodb://localhost:27017/online-coding"
mongoose.connect("mongodb+srv://edenhotz:edenhotz1997@cluster0.rpc9d.mongodb.net/?retryWrites=true&w=majority&appName=cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define CodeBlock Schema
const codeBlockSchema = new mongoose.Schema({
  id: String,  
  title: String,
  content: String, 
  solution: String,
  hint: String,
});

const CodeBlock = mongoose.model("CodeBlock", codeBlockSchema);

// Deletes all existing records
await CodeBlock.deleteMany({}); 

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

      socket.on("redirect_home", async () => {
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