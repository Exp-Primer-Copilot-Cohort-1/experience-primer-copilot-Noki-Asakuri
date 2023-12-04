// Create web server
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { randomBytes } = require("crypto");

// Create application
const app = express();

// Add middleware
app.use(bodyParser.json());
app.use(cors());

// Create comments object
const commentsByPostId = {};

// Add route
app.get("/posts/:id/comments", (req, res) => {
	// Return comments array
	res.send(commentsByPostId[req.params.id] || []);
});

// Add route
app.post("/posts/:id/comments", (req, res) => {
	// Generate random id
	const commentId = randomBytes(4).toString("hex");
	// Get comment content from request body
	const { content } = req.body;
	// Get comments array for post
	const comments = commentsByPostId[req.params.id] || [];
	// Add new comment to comments array
	comments.push({ id: commentId, content, status: "pending" });
	// Add comments array to comments object
	commentsByPostId[req.params.id] = comments;
	// Emit event to event bus
	const data = { id: commentId, content, postId: req.params.id, status: "pending" };
	req.app.get("eventBus").emit("CommentCreated", data);
	// Return comments array
	res.status(201).send(comments);
});

// Add route
app.post("/events", (req, res) => {
	// Get event type and data from request body
	const { type, data } = req.body;
	// Check event type
	if (type === "CommentModerated") {
		// Get comments array for post
		const comments = commentsByPostId[data.postId];
		// Get comment from comments array
		const comment = comments.find((comment) => comment.id === data.id);
		// Update comment status
		comment.status = data.status;
		// Emit event to event bus
		req.app.get("eventBus").emit("CommentUpdated", data);
	}
	// Return ok
	res.send({});
});

// Start application
app.listen(4001, () => {
	console.log("Listening on 4001");
});
