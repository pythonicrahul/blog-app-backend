import express from 'express';
import UsersController from '../controllers/users';
import swaggerValidation from 'openapi-validator-middleware';
import { EHTTPCode } from '../interfaces/common';


const users_router = express.Router();

users_router.post('/register', swaggerValidation.validate, async (req: express.Request, res: express.Response) => {
    const controller = new UsersController();
    try{
        const response = await controller.register(req.body);

        if(response.statusCode){
            return res.status(response.statusCode).send({
				data: response.data,
				status: response.status,
				message: response.message,
			});
        }else{
            return res.status(EHTTPCode.CREATED).send(response);
        }
    }catch (err:any){
        return res.status(EHTTPCode.INTERNAL_SERVER_ERROR).json({
            status: false,
            data: null,
            message: err.message
        });
    }
});

users_router.post('/login', swaggerValidation.validate, async (req: express.Request, res: express.Response) => {
    const controller = new UsersController();
    try{
        const response = await controller.login(req.body);
        if(response.statusCode){
            return res.status(response.statusCode).send({
				data: response.data,
				status: response.status,
				message: response.message,
			});
        }else{
            return res.status(EHTTPCode.STATUS_OK).json(response);
        }
    }catch (err:any){
        return res.status(EHTTPCode.INTERNAL_SERVER_ERROR).json({
            status: false,
            data: null,
            message: err.message
        });
    }
});

export default users_router;
