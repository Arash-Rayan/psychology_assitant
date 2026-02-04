from ninja import Schema


class SignupRequest(Schema):
    name: str
    email: str
    password: str


class SignupResponse(Schema):
    id: int
    name: str
    email: str


class LoginRequest(Schema):
    email: str
    password: str


class LoginResponse(Schema):
    id: int
    name: str
    email: str


