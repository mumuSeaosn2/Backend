const express = require('express');
const room = require("../../controllers/room.controller.js");
const router = express.Router();

//Create a new room
router.post("/create/:id",room.roomCreate);

//Retrive all roomList
router.get("/list",room.roomFindAll);


//Retrive roomList by user email
router.get("/list/:id",room.roomFindById);

/*
//Retrive a room with id
//router.get("/:id",room.roomFindOne)

//Update a room with id (현재 기능상으로는 쓰이지 않을듯, 방에 이름등을 추가하면 사용할 메소드)
router.patch("/:id",room.roomUpdate);

//Delete a room with id
router.delete("/:id",room.roomDelete);
*/
module.exports = router;

/**
 * @swagger
 * /room/create/{id}:
 *   post:
 *     summary: Create a room
 *     description: Only admins can create other users.
 *     tags: [room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
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

/** 
 * @swagger
 * /room/list:
 *   get:
 *     summary: Get all roomlist
 *     description: Only admins can retrieve all room.
 *     tags: [room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: string
 *         description: Room Id
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Room'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /room/list/{id}:
 *   get:
 *     summary : Find room which user get in there
 *     description: Only admins cam create other users.
 *     tags: [room]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
