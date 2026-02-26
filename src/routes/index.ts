//import hono
import { Hono } from 'hono';

//import middleware validateBody
import { validateBody } from '../middlewares/validate.middleware';

//import middleware auth
import { verifyToken } from '../middlewares/auth.middleware';

//import schema auth
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

//import schema user
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.js';

//import controller register
import { register } from '../controllers/registerController';

//import controller login
import { login } from '../controllers/loginController';

//import controller user
import { getUsers, createUser, getUserById, updateUser, deleteUser } from '../controllers/userController';

//inistialize router
const router = new Hono()

//register route
router.post('/register', validateBody(registerSchema), register);

//login route
router.post('/login', validateBody(loginSchema), login);

//get users route
router.get('/users', verifyToken, getUsers);

//create user route
router.post('/users', verifyToken, validateBody(createUserSchema), createUser);

//get user by ID route
router.get('/users/:id', verifyToken, getUserById);

//update user by ID route
router.put('/users/:id', verifyToken, validateBody(updateUserSchema), updateUser);

//delete user by ID route
router.delete('/users/:id', verifyToken, deleteUser);

export const Routes = router;
