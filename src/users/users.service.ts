import { Injectable } from '@nestjs/common';
import { RegisterUserDto, RegisterUserResponse } from '../dtos/users/types';
import { ApiResponse } from '../dtos/response/types';
import { db } from '..';
import { usersTable } from '../db/schema';

@Injectable()
export class UsersService {

    async registerUser(data: RegisterUserDto): Promise<ApiResponse<RegisterUserResponse>> {
        let response: ApiResponse<RegisterUserResponse>;
        try {
            const user: typeof usersTable.$inferInsert = {
                id: data.id,
                name: data.name,
                email: data.email
            }

            await db.insert(usersTable).values(user);
            response = {
                success: true,
                statusCode: 201,
                data: { name: data.name, email: data.email },
                message: 'User registered successfully',
                error: null
            };
        } catch(error) {
            response = {
                success: false,
                statusCode: 500,
                data: null,
                message: 'Failed to register user',
                error: error.message,
            }
        }
        return response;
    }
}
