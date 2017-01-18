import {Router} from 'express';
import HttpStatus from 'http-status-codes';
import * as userService from '../services/userService';
import {findUser, userValidator} from '../validators/userValidator';

let router = Router();

/**
 * @swagger
 * definitions:
 *   User:
 *     title: User
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *         description: Unique identifier representing a specific user
 *       name:
 *         type: string
 *         description: Name of the user
 *       created_at:
 *         type: string
 *         format: date-time
 *         description: User creation datetime
 *       updated_at:
 *         type: string
 *         format: date-time
 *         description: User update datetime
 *   Error:
 *     title: Error
 *     type: object
 *     properties:
 *       code:
 *         type: integer
 *         format: int32
 *       message:
 *         type: string
 *   ServerError:
 *     allOf:
 *       - $ref: '#/definitions/Error'
 *       - title: ServerError
 *   NotFoundError:
 *     allOf:
 *       - $ref: '#/definitions/Error'
 *       - title: NotFoundError
 *   ValidationError:
 *     allOf:
 *       - $ref: '#/definitions/Error'
 *       - title: ValidationError
 *       - properties:
 *           details:
 *             type: array
 *             items:
 *               title: FieldError
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 param:
 *                   type: string
 */

 /**
  * @swagger
  * /users:
  *   get:
  *     summary: List all users
  *     description: Returns users
  *     produces:
  *       - application/json
  *     tags:
  *       - users
  *     responses:
  *       200:
  *         description: An array of users
  *         schema:
  *           title: Users
  *           type: array
  *           items:
  *             $ref: '#/definitions/User'
  */
router.get('/', (req, res, next) => {
  userService.getAllUsers()
    .then(data => res.json({data}))
    .catch(err => next(err));
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Create a user
 *     produces:
 *       - application/json
 *     tags:
 *       - users
 *     parameters:
 *       - name: name
 *         description: Name of the user
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Newly created user object
 *         schema:
 *           title: User
 *           type: object
 *           $ref: '#/definitions/User'
 *       400:
 *         description: Bad request
 *         schema:
 *           $ref: '#/definitions/ValidationError'
 *       500:
 *         description: Internal server error
 *         schema:
 *           $ref: '#/definitions/ServerError'
 */
router.post('/', userValidator, (req, res, next) => {
  userService.createUser(req.body)
    .then(data => res.status(HttpStatus.CREATED).json({data}))
    .catch(err => next(err));
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update an user
 *     description: Update an user
 *     produces:
 *       - application/json
 *     tags:
 *       - users
 *     parameters:
 *       - name: id
 *         description: Unique identifier of the user
 *         in: path
 *         required: true
 *         type: number
 *       - name: name
 *         description: Name of the user
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Updated user object
 *         schema:
 *           title: UpdatedUser
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               description: Unique identifier representing a specific user
 *             name:
 *               type: string
 *               description: Name of the user
 *             updated_at:
 *               type: string
 *               format: date-time
 *               description: Updated user datetime
 *       400:
 *         description: Bad request
 *         schema:
 *           $ref: '#/definitions/ValidationError'
 *       404:
 *         description: User not found
 *         schema:
 *           $ref: '#/definitions/NotFoundError'
 *       500:
 *         description: Internal server error
 *         schema:
 *           $ref: '#/definitions/ServerError'
 */
router.put('/:id', findUser, userValidator, (req, res, next) => {
  userService.updateUser(req.params.id, req.body)
    .then(data => res.json({data}))
    .catch(err => next(err));
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete an user
 *     description: Delete an user
 *     produces:
 *       - application/json
 *     tags:
 *       - users
 *     parameters:
 *       - name: id
 *         description: Unique identifier of the user
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       204:
 *         description: User deleted (no-content)
 *       400:
 *         description: Bad request
 *         schema:
 *           $ref: '#/definitions/ValidationError'
 *       404:
 *         description: User not found
 *         schema:
 *           $ref: '#/definitions/NotFoundError'
 *       500:
 *         description: Internal server error
 *         schema:
 *           $ref: '#/definitions/ServerError'
 */
router.delete('/:id', findUser, (req, res, next) => {
  userService.deleteUser(req.params.id)
    .then(data => res.status(HttpStatus.NO_CONTENT).json({data}))
    .catch(err => next(err));
});

export default router;
