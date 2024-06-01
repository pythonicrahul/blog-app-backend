import express from 'express';
import swaggerValidation from 'openapi-validator-middleware';
import { EHTTPCode, ICustomRequest } from '../interfaces/common';
import BlogsController from '../controllers/blogs';
import { authenticate } from '../middleware/auth';


const blogs_router = express.Router();

blogs_router.get('/', swaggerValidation.validate, async (req: ICustomRequest, res: express.Response) => {
    const controller = new BlogsController();
    try{
        const response = await controller.getBlogs(
            Number(req.query.page),
            Number(req.query.page_size),
            req.query.id ? String(req.query.id).trim() : undefined,
            req.query.title ? String(req.query.title).trim() : undefined,
            req.query.author ? String(req.query.author).trim() : undefined,
        );
        if(response.statusCode){
            return res.status(response.statusCode).send({
                data: response.data,
                status: response.status,
                message: response.message,
                meta: response.meta
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

blogs_router.post('/', authenticate, swaggerValidation.validate, async (req: ICustomRequest, res: express.Response) => {
    const controller = new BlogsController();
    try{
        console.log(req.decodedToken);
        const response = await controller.createBlog(
            req.body, 
            req.decodedToken
        );
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

blogs_router.put('/:id', authenticate, swaggerValidation.validate, async (req: ICustomRequest, res: express.Response) => {
    const controller = new BlogsController();
    try{
        const response = await controller.updateBlog(
            req.body, 
            req.params.id,
            req.decodedToken
        );
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

blogs_router.delete('/:id', authenticate, swaggerValidation.validate, async (req: ICustomRequest, res: express.Response) => {
    const controller = new BlogsController();
    try{
        const response = await controller.deleteBlog(
            req.params.id,
            req.decodedToken
        );
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


export default blogs_router;