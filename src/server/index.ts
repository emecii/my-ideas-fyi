import express from "express";
import mongoose from "mongoose";
import {
  getIdeaList,
  getIdeaById,
  addNewIdea,
  updateIdeaById,
  updateCurrentUser,
  deleteIdea,
} from "../api/IdeaAPI";
import { IdeaStatus } from "../interfaces/Idea";
import { UserModel } from "../models/IdeaModel";
import { clerkClient } from "@clerk/clerk-sdk-node";
import dotenv from "dotenv";

dotenv.config();

export const app = express();
app.use(express.json()); // To parse JSON bodies

// Mongoose Connection
const connectionString = process.env.MONGODB_CONNECTION_STRING || "";

mongoose.connect(connectionString, {});

// Test API
app.get("/api/test", (_, res) => res.json({ greeting: "Hello" }));

// Idea APIs
app.get("/api/ideas", async (req, res) => {
  try {
    const query =
      typeof req.query.query === "string" ? req.query.query : undefined;
    const sortBy =
      typeof req.query.sortBy === "string" ? req.query.sortBy : undefined;
    let status: IdeaStatus | undefined;

    const ideas = await getIdeaList(query, sortBy, status);
    res.json(ideas);
  } catch (error) {
    if (error instanceof Error) {
      // If error is an instance of Error, send the error message
      res.status(500).send(error.message);
    } else {
      // If error is not an instance of Error, send a generic error message
      res.status(500).send("An unknown error occurred");
    }
  }
});

app.get("/api/user/:userId", async (req, res) => {
  try {
    const filter = { id: req.params.userId };
    const userDoc = await UserModel.findOne(filter).exec();
    if (!userDoc) {
      // Return a 404 if the user is not found
      res.status(404).send("User not found");
      return;
    }
    console.log("userDoc is: ", userDoc);
    res.json(userDoc);
  } catch (error) {
    if (error instanceof Error) {
      // If error is an instance of Error, send the error message
      res.status(500).send(error.message);
    } else {
      // If error is not an instance of Error, send a generic error message
      res.status(500).send("An unknown error occurred");
    }
  }
});

app.get("/api/idea/:id", async (req, res) => {
  try {
    const idea = await getIdeaById(req.params.id);
    res.json(idea);
  } catch (error) {
    if (error instanceof Error) {
      // If error is an instance of Error, send the error message
      res.status(500).send(error.message);
    } else {
      // If error is not an instance of Error, send a generic error message
      res.status(500).send("An unknown error occurred");
    }
  }
});

app.post("/api/idea", async (req, res) => {
  try {
    const newIdea = await addNewIdea(req.body);
    res.json(newIdea);
  } catch (error) {
    if (error instanceof Error) {
      // If error is an instance of Error, send the error message
      res.status(500).send(error.message);
    } else {
      // If error is not an instance of Error, send a generic error message
      res.status(500).send("An unknown error occurred");
    }
  }
});

app.put("/api/idea/:id", async (req, res) => {
  try {
    const updatedIdea = await updateIdeaById(req.params.id, req.body);
    res.json(updatedIdea);
  } catch (error) {
    if (error instanceof Error) {
      // If error is an instance of Error, send the error message
      res.status(500).send(error.message);
    } else {
      // If error is not an instance of Error, send a generic error message
      res.status(500).send("An unknown error occurred");
    }
  }
});

app.put("/api/user/:userId", async (req, res) => {
  try {
    const updatedUser = await updateCurrentUser(req.params.userId, req.body);
    res.json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      // If error is an instance of Error, send the error message
      res.status(500).send(error.message);
    } else {
      // If error is not an instance of Error, send a generic error message
      res.status(500).send("An unknown error occurred");
    }
  }
});

app.delete("/api/idea/:id", async (req, res) => {
  try {
    const message = await deleteIdea(req.params.id);
    res.status(200).send(message);
  } catch (error) {
    if (error instanceof Error) {
      // If error is an instance of Error, send the error message
      res.status(500).send(error.message);
    } else {
      // If error is not an instance of Error, send a generic error message
      res.status(500).send("An unknown error occurred");
    }
  }
});

app.post("/api/metadata/:userId", async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.params.userId);

    res.status(200).json(user.privateMetadata);
  } catch (error) {
    if (error instanceof Error) {
      // If error is an instance of Error, send the error message
      res.status(500).send(error.message);
    } else {
      // If error is not an instance of Error, send a generic error message
      res.status(500).send("An unknown error occurred");
    }
  }
});

app.post("/api/updateVotes", async (req, res) => {
  try {
    const { userId, voteId, isUpvote } = await req.body;

    const user = await clerkClient.users.getUser(userId);
    const currentMetadata = user.privateMetadata;
    const currentVotes = currentMetadata.votes as [];
    var newVotes;
    if (isUpvote) {
      newVotes = currentVotes ? [...currentVotes, voteId] : [voteId];
    } else {
      newVotes = currentVotes
        ? currentVotes.filter((vote: any) => vote !== voteId)
        : [];
    }
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        votes: newVotes,
      },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      // If error is an instance of Error, send the error message
      res.status(500).send(error.message);
    } else {
      // If error is not an instance of Error, send a generic error message
      res.status(500).send("An unknown error occurred");
    }
  }
});

// Serve Frontend Files
const frontendFiles = process.cwd() + "/dist";
app.use(express.static(frontendFiles));
app.use("/api", express.static(process.cwd() + "/api"));
app.use("/interfaces", express.static(process.cwd() + "/interfaces"));
app.use("/models", express.static(process.cwd() + "/models"));
app.get("/*", (_, res) => {
  res.sendFile(frontendFiles + "/index.html");
});
app.listen(3000, () => console.log("Server running on port 3000"));
