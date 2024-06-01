import { Body, Post, Route, Tags, Header, Security, Put, Path, Delete, Get, Query } from "tsoa";
import { EHTTPCode, IMetaValue, IResponseBase } from "../interfaces/common";
import { IBlogCreationRequest, IBlogQuery, IBlogUpdateRequest } from "../interfaces/blogs";
import BlogsModel from "../models/blogs";
import { Request } from "express";

@Tags("Blogs")
@Route("/api/v1/blogs")
export default class BlogsController {

    @Get("/")
    public async getBlogs(
        @Query() page : number,
        @Query() page_size : number,
        @Query() id ?: string,
        @Query() title ?: string,
        @Query() author ?: string,
    ): Promise<IResponseBase> {

        const query: IBlogQuery = {}

        if(id){
            query.id = id
        }

        if(title){
            query.title = new RegExp(title, 'i')
        }

        if(author){
            query.author = author
        }

        const blogs = await BlogsModel.find(query, {
            _id: 1, title: 1, author: 1, createdDate: 1 , content: 1, createdAt: 1, 0: 1, authorName: 1
        })
        .skip((page - 1) * page_size)
        .limit(page_size)
        .sort({ createdAt: -1 });

        if(!blogs){
            return {
                status: false,
                data: null,
                message: "Failed to fetch blogs",
                statusCode: EHTTPCode.INTERNAL_SERVER_ERROR
            }
        }

        const count = await BlogsModel.countDocuments(query);

        const meta: IMetaValue = {
			page,
			page_size: page_size,
			pages: Math.ceil(count / page_size),
			items: count,
		};
        
        return {
            status: true,
            data: blogs,
            meta,
            message: "Blogs fetched successfully",
            statusCode: EHTTPCode.STATUS_OK
        }
    }

    @Post("/")
    @Security('jwt')
    public async createBlog(
        @Body() body: IBlogCreationRequest,
        @Header() token ?: any
    ): Promise<IResponseBase> {

        if(!token){
            return {
                status: false,
                data: null,
                message: "Please provide a valid token",
                statusCode: EHTTPCode.UNAUTHORIZED
            }
        }

        const blog = await BlogsModel.create({
            title: body.title,
            content: body.content,
            author: token?.sub,
            authorName: token?.name
        });

        if(!blog){
            return {
                status: false,
                data: null,
                message: "Failed to create blog",
                statusCode: EHTTPCode.INTERNAL_SERVER_ERROR
            }
        }

        return {
            status: true,
            data: null,
            message: "Blog created successfully",
            statusCode: EHTTPCode.CREATED
        }
    }

    @Put("/:id")
    @Security('jwt')
    public async updateBlog(
        @Body() body: IBlogUpdateRequest,
        @Path("id") id: string,
        @Header() token ?: any,
    ): Promise<IResponseBase> {

        if(!token){
            return {
                status: false,
                data: null,
                message: "Please provide a valid token",
                statusCode: EHTTPCode.UNAUTHORIZED
            }
        }

        const blogCheck = await BlogsModel.findOne({
            _id: id,
            author: token?.sub,
            isDeleted: false
        });

        if(!blogCheck){
            return {
                status: false,
                data: null,
                message: "Blog not found",
                statusCode: EHTTPCode.NOT_FOUND
            }
        }

        const blog = await BlogsModel.findOneAndUpdate({
            _id: id
        }, { $set: { ...body , updatedAt: new Date()} }, { new: true });

        if(!blog){
            return {
                status: false,
                data: null,
                message: "Failed to update blog",
                statusCode: EHTTPCode.INTERNAL_SERVER_ERROR
            }
        }

        return {
            status: true,
            data: {
                _id: blog._id,
                title: blog.title,
                content: blog.content,
                author: blog.author,
                authorName: blog.authorName
            },
            message: "Blog updated successfully",
            statusCode: EHTTPCode.CREATED
        }
    }

    @Delete("/:id")
    @Security('jwt')
    public async deleteBlog(
        @Path("id") id: string,
        @Header() token ?: any
    ): Promise<IResponseBase> {

        if(!token){
            return {
                status: false,
                data: null,
                message: "Please provide a valid token",
                statusCode: EHTTPCode.UNAUTHORIZED
            }
        }   

        const blogCheck = await BlogsModel.findOne({
            _id: id,
            author: token?.sub,
            isDeleted: false
        });

        if(!blogCheck){
            return {
                status: false,
                data: null,
                message: "Blog not found",
                statusCode: EHTTPCode.NOT_FOUND
            }
        }

        const blog = await BlogsModel.findOneAndUpdate({
            _id: id
        }, { $set: { isDeleted: true } }, { new: true });

        if(!blog){
            return {
                status: false,
                data: null,
                message: "Failed to delete blog",
                statusCode: EHTTPCode.INTERNAL_SERVER_ERROR
            }
        }

        return {
            status: true,
            data: null,
            message: "Blog deleted successfully",
            statusCode: EHTTPCode.CREATED
        }
    }
}