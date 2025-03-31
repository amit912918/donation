// Define TypeScript interfaces for request body
export interface RegisterUserRequest {
    name: string;
    gender: string;
    dob: string;
    address: string;
    city: string;
    language: string;
    email?: string;
    mobile?: string;
    password: string;
}
