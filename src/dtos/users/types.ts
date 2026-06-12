import { MessageResponse } from "../response/types";
import { z } from "zod";

export interface RegisterUserDto {
    id: string;
    name: string;
    email: string;
}

export const RegisterUserSchema = z.object({
    id: z.string().min(1, { message: "ID is required" }),
    name: z.string().min(1, { message: "Name must be there" }),
    email: z.string().check(
        z.email({
            error: "Invalid email format",
        })
    )
});


export interface RegisterUserResponse {
    name: string;
    email: string;
}

export interface LoggedInUser {
    name: string;
    uid: string;
}

export interface BotCreateMessage extends MessageResponse {}