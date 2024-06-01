import { Tags, Route, Post, Body} from "tsoa";
import { ILoginRequest, IRegistrationRequest } from "../interfaces/users";
import { EHTTPCode, IResponseBase } from "../interfaces/common";
import { generate_epoch_time, generate_token, validateEmail, validateEmailLength, validatePassword } from "../utils/common";
import bcrypt from 'bcrypt';
import UserModel from "../models/users";

@Route("/api/v1")
@Tags("Users")
export default class UsersController {

    @Post("/register")
    public async register(
        @Body() body: IRegistrationRequest,
    ): Promise<IResponseBase> {

        if(!validateEmailLength(body.email)){
            return {
                status: false,
                data: null,
                message: `Please enter a valid email address`,
                statusCode: EHTTPCode.BAD_REQUEST
            }
        }

        if(!validateEmail(body.email)){
            return {
                status: false,
                data: null,
                message: `Please enter a valid email address`,
                statusCode: EHTTPCode.BAD_REQUEST
            }
        }

        if(!validatePassword(body.password)){
            return {
                status: false,
                data: null,
                message: `Please enter a valid password`,
                statusCode: EHTTPCode.BAD_REQUEST
            }
        }

        const userCheck = await UserModel.countDocuments({ 
            email: body.email,
            isDeleted: false
        });

        if(userCheck){
            return {
                status: false,
                data: null,
                message: `User already exists`,
                statusCode: EHTTPCode.BAD_REQUEST
            }
        }

        const salt = await bcrypt.genSalt(10);
        const securedPassword = await bcrypt.hash(body.password, salt);
        body.password = securedPassword

        const user  = await UserModel.create({
            name: body.name,
            email: body.email,
            password: body.password
        });

        if(!user){
            return {
                status: false,
                data: null,
                message: `User registration failed`,
                statusCode: EHTTPCode.INTERNAL_SERVER_ERROR
            }
        }

        const token = generate_token({
            sub: String(user._id),
            name: user.name,
            email: user.email
        }, generate_epoch_time(3600))
        
        return { 
            status: true, 
            data: {
                token
            }, 
            message: 'User registered successfully' 
        }
    }

    @Post("/login")
    public async login(
        @Body() body: ILoginRequest
    ): Promise<IResponseBase> {

        const user = await UserModel.findOne({ email: body.email });

        if(!user){
            return {
                status: false,
                data: body,
                message: `User not found`,
                statusCode: EHTTPCode.BAD_REQUEST
            }
        }

        const validPassword = await bcrypt.compare(body.password, user.password);
        if(!validPassword){
            return {
                status: false,
                data: body,
                message: `Invalid password`,
                statusCode: EHTTPCode.BAD_REQUEST
            }
        }

        const token = generate_token({
            sub: String(user._id),
            name: user.name,
            email: user.email
        }, generate_epoch_time(3600))
        
        return { 
            status: true, 
            data: {
                token
            }, 
            message: 'User logged in successfully' 
        }
    }
}