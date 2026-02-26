// import zod
import { z } from 'zod';

// import schemas auth
import { createUserSchema, updateUserSchema } from '../schemas/user.schema';

// infer types from schemas
export type UserCreateRequest = {
  name: string
  username: string // tambahkan ini
  email: string
  password: string
};

export type UserUpdaterequest = z.infer<typeof updateUserSchema>;
