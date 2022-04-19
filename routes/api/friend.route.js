const express = require('express');
const friend = require("../../controllers/friend.controller.js");
const router = express.Router();

// Create friend relationship
router.post("/add/:friendEmail", friend.friendAdd);

// Retrieve all friends of user
//router.get("/list/:id", friend.friendFind);

// Retrieve a single Tutorial with id
//router.get("/:email", user.userFindOne);

// Update a Tutorial with id
//router.patch("/:id", user.userUpdate);

// Delete a Tutorial with id
//router.delete("/delete/:userId/:friendId", friend.friendDelete);

// Delete all Tutorials
//router.delete("/", user.userDeleteAll);

module.exports = router;

/**
 * @swagger
 * /friend/add/{friendEmail}:
 *   post:
 *     summary: Create friend relationship
 *     description: Only admins can create other users.
 *     tags: [friend]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendEmail
 *         required: true
 *         schema:
 *           type: string
 *         description: friend Email
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Room'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 * 
 */