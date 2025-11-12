import type { Gender } from "./Gender";

export type UpdateUserDto = {
    name: string;
    email: string;
    gender: Gender;
};
