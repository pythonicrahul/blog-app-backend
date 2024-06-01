const mockingoose = require('mockingoose');
import UsersController from '../../controllers/users';
import UserModel  from '../../models/users';
import bcrypt from 'bcrypt';
import { validateEmail, validateEmailLength, validatePassword, generate_token } from '../../utils/common';
import { EHTTPCode } from '../../interfaces/common';

jest.mock('bcrypt');
jest.mock('../../utils/common');

describe('UsersController', () => {
    let usersController: UsersController;

    beforeEach(() => {
        usersController = new UsersController();
        jest.clearAllMocks(); // Clear mocks before each test
    });

    describe('register', () => {
        it('should return bad request if email length is invalid', async () => {
            (validateEmailLength as jest.Mock).mockReturnValue(false);
            const body = { name: 'Test User', email: 't@t', password: 'Password123!' };

            const response = await usersController.register(body);

            expect(response).toEqual({
                status: false,
                data: null,
                message: 'Please enter a valid email address',
                statusCode: EHTTPCode.BAD_REQUEST,
            });
        });

        it('should return bad request if email is invalid', async () => {
            (validateEmailLength as jest.Mock).mockReturnValue(true);
            (validateEmail as jest.Mock).mockReturnValue(false);
            const body = { name: 'Test User', email: 'invalid-email', password: 'Password123!' };

            const response = await usersController.register(body);

            expect(response).toEqual({
                status: false,
                data: null,
                message: 'Please enter a valid email address',
                statusCode: EHTTPCode.BAD_REQUEST,
            });
        });

        it('should return bad request if password is invalid', async () => {
            (validateEmailLength as jest.Mock).mockReturnValue(true);
            (validateEmail as jest.Mock).mockReturnValue(true);
            (validatePassword as jest.Mock).mockReturnValue(false);
            const body = { name: 'Test User', email: 'test@test.com', password: 'short' };

            const response = await usersController.register(body);

            expect(response).toEqual({
                status: false,
                data: null,
                message: 'Please enter a valid password',
                statusCode: EHTTPCode.BAD_REQUEST,
            });
        });

        it('should return bad request if user already exists', async () => {
            (validateEmailLength as jest.Mock).mockReturnValue(true);
            (validateEmail as jest.Mock).mockReturnValue(true);
            (validatePassword as jest.Mock).mockReturnValue(true);
            mockingoose(UserModel).toReturn(1, 'countDocuments');

            const body = { name: 'Test User', email: 'test@test.com', password: 'Password123!' };

            const response = await usersController.register(body);

            expect(response).toEqual({
                status: false,
                data: null,
                message: 'User already exists',
                statusCode: EHTTPCode.BAD_REQUEST,
            });
        });

        // it('should return internal server error if user creation fails', async () => {
        //     (validateEmailLength as jest.Mock).mockReturnValue(true);
        //     (validateEmail as jest.Mock).mockReturnValue(true);
        //     (validatePassword as jest.Mock).mockReturnValue(true);
        //     mockingoose(UserModel).toReturn(0, 'countDocuments');
        //     mockingoose(UserModel).toReturn(undefined, 'create');

        //     const body = { name: 'Test User', email: 'test@test.com', password: 'Password123!' };

        //     const response = await usersController.register(body);

        //     expect(response).toEqual({
        //         status: false,
        //         data: null,
        //         message: 'User registration failed',
        //         statusCode: EHTTPCode.INTERNAL_SERVER_ERROR,
        //     });
        // });

        it('should register user successfully', async () => {
            (validateEmailLength as jest.Mock).mockReturnValue(true);
            (validateEmail as jest.Mock).mockReturnValue(true);
            (validatePassword as jest.Mock).mockReturnValue(true);
            mockingoose(UserModel).toReturn(0, 'countDocuments');
            const user = { _id: '1', name: 'Test User', email: 'test@test.com', password: 'hashedPassword' };
            mockingoose(UserModel).toReturn(user, 'create');
            (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            (generate_token as jest.Mock).mockReturnValue('jwt_token');

            const body = { name: 'Test User', email: 'test@test.com', password: 'Password123!' };

            const response = await usersController.register(body);

            expect(response).toEqual({
                status: true,
                data: { token: 'jwt_token' },
                message: 'User registered successfully',
            });
        });
    });

    describe('login', () => {
        it('should return bad request if user is not found', async () => {
            mockingoose(UserModel).toReturn(null, 'findOne');

            const body = { email: 'test@test.com', password: 'Password123!' };

            const response = await usersController.login(body);

            expect(response).toEqual({
                status: false,
                data: body,
                message: 'User not found',
                statusCode: EHTTPCode.BAD_REQUEST,
            });
        });

        it('should return bad request if password is invalid', async () => {
            const user = { _id: '1', name: 'Test User', email: 'test@test.com', password: 'hashedPassword' };
            mockingoose(UserModel).toReturn(user, 'findOne');
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const body = { email: 'test@test.com', password: 'Password123!' };

            const response = await usersController.login(body);

            expect(response).toEqual({
                status: false,
                data: body,
                message: 'Invalid password',
                statusCode: EHTTPCode.BAD_REQUEST,
            });
        });

        it('should log in user successfully', async () => {
            const user = { _id: '1', name: 'Test User', email: 'test@test.com', password: 'hashedPassword' };
            // (UserModel.findOne as jest.Mock).mockResolvedValue(user);
            mockingoose(UserModel).toReturn(user, 'findOne');
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (generate_token as jest.Mock).mockReturnValue('jwt_token');

            const body = { email: 'test@test.com', password: 'Password123!' };

            const response = await usersController.login(body);

            expect(response).toEqual({
                status: true,
                data: { token: 'jwt_token' },
                message: 'User logged in successfully',
            });
        });
    });
});
