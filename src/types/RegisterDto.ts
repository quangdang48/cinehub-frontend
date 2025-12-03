/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegisterDto = {
    name: string;
    email: string;
    gender: 'male' | 'female';
    password: string;
    /**
     * Mã OTP để xác thực tài khoản
     */
    otp?: string;
};

