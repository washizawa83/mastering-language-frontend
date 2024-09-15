export type SignUpRequest = {
    username: string
    email: string
    password: string
}

export type LoginRequest = {
    email: string
    password: string
}

export type LoginAndVerifyRequest = {
    verification_code: string
} & LoginRequest

export type VerifyUserRequest = {
    email: string
    verification_code: string
}

export type LoginResponse = {
    access_token: string
    token_type: string
}
