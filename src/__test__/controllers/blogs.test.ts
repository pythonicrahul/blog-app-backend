const mockingoose = require('mockingoose');
import  BlogController  from '../../controllers/blogs';
import  BlogsModel  from '../../models/blogs';
import { EHTTPCode } from '../../interfaces/common';
import { IBlogCreationRequest, IBlogUpdateRequest } from '../../interfaces/blogs';


describe('BlogController - getBlogs', () => {
    let blogController: BlogController;
    jest.mock('../../models/blogs');
    beforeEach(() => {
        blogController = new BlogController();
        jest.clearAllMocks();
        mockingoose.resetAll();
    });

    it('should return an empty list if no blogs match the query', async () => {
        const findMock = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            sort: jest.fn().mockResolvedValue([]),
        };

        (BlogsModel.find as jest.Mock).mockReturnValue(findMock);
        (BlogsModel.countDocuments as jest.Mock).mockResolvedValue(0);

        const response = await blogController.getBlogs(1, 10, undefined, 'Nonexistent Title', undefined);

        expect(response).toEqual({
            status: true,
            data: [],
            meta: {
                page: 1,
                page_size: 10,
                pages: 0,
                items: 0,
            },
            message: 'Blogs fetched successfully',
            statusCode: EHTTPCode.STATUS_OK,
        });
    });

    it('should return blogs with correct pagination and meta data', async () => {
        const blogs = [
            { _id: '1', title: 'Title1', author: 'Author1', createdDate: new Date(), content: 'Content1', createdAt: new Date(), authorName: 'Author Name 1' },
            { _id: '2', title: 'Title2', author: 'Author2', createdDate: new Date(), content: 'Content2', createdAt: new Date(), authorName: 'Author Name 2' }
        ];

        const findMock = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            sort: jest.fn().mockResolvedValue(blogs),
        };

        (BlogsModel.find as jest.Mock).mockReturnValue(findMock);
        (BlogsModel.countDocuments as jest.Mock).mockResolvedValue(2);

        const response = await blogController.getBlogs(1, 2, undefined, undefined, undefined);

        expect(response).toEqual({
            status: true,
            data: blogs,
            meta: {
                page: 1,
                page_size: 2,
                pages: 1,
                items: 2,
            },
            message: 'Blogs fetched successfully',
            statusCode: EHTTPCode.STATUS_OK,
        });
    });

    it('should return blogs filtered by title and author', async () => {
        const blogs = [
            { _id: '1', title: 'Title1', author: 'Author1', createdDate: new Date(), content: 'Content1', createdAt: new Date(), authorName: 'Author Name 1' }
        ];

        const findMock = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            sort: jest.fn().mockResolvedValue(blogs),
        };

        (BlogsModel.find as jest.Mock).mockReturnValue(findMock);
        (BlogsModel.countDocuments as jest.Mock).mockResolvedValue(1);

        const response = await blogController.getBlogs(1, 10, undefined, 'Title1', 'Author1');

        expect(response).toEqual({
            status: true,
            data: blogs,
            meta: {
                page: 1,
                page_size: 10,
                pages: 1,
                items: 1,
            },
            message: 'Blogs fetched successfully',
            statusCode: EHTTPCode.STATUS_OK,
        });
    });

    it('should handle optional query parameters correctly', async () => {
        const blogs = [
            { _id: '1', title: 'Title1', author: 'Author1', createdDate: new Date(), content: 'Content1', createdAt: new Date(), authorName: 'Author Name 1' }
        ];

        const findMock = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            sort: jest.fn().mockResolvedValue(blogs),
        };

        (BlogsModel.find as jest.Mock).mockReturnValue(findMock);
        (BlogsModel.countDocuments as jest.Mock).mockResolvedValue(1);

        const response = await blogController.getBlogs(1, 10, '1', 'Title1', 'Author1');

        expect(response).toEqual({
            status: true,
            data: blogs,
            meta: {
                page: 1,
                page_size: 10,
                pages: 1,
                items: 1,
            },
            message: 'Blogs fetched successfully',
            statusCode: EHTTPCode.STATUS_OK,
        });
    });
});

describe('BlogController - createBlog', () => {
    let blogController: BlogController;

    beforeEach(() => {
        blogController = new BlogController();
        jest.clearAllMocks();
        mockingoose.resetAll();
    });

    it('should return unauthorized if token is not provided', async () => {
        const request: IBlogCreationRequest = { title: 'Test Title', content: 'Test Content' };

        const response = await blogController.createBlog(request, undefined);

        expect(response).toEqual({
            status: false,
            data: null,
            message: 'Please provide a valid token',
            statusCode: EHTTPCode.UNAUTHORIZED,
        });
    });

    it('should return an error if blog creation fails', async () => {
        // Mocking BlogsModel.create to return null to simulate failure
        mockingoose(BlogsModel).toReturn(null, 'save');

        const request: IBlogCreationRequest = { title: 'Test Title', content: 'Test Content' };
        const token = { sub: 'authorId', name: 'authorName' };

        const response = await blogController.createBlog(request, token);

        // Expecting failure response
        expect(response).toEqual({
            status: false,
            data: null,
            message: 'Failed to create blog',
            statusCode: EHTTPCode.INTERNAL_SERVER_ERROR,
        });
    });

    test.only('should create a blog successfully', async () => {
        const request: IBlogCreationRequest = { title: 'Test Title', content: 'Test Content' };
        const token = { sub: 'authorId', name: 'authorName' };

        const createdBlog = { _id: 'blogId', ...request, author: token.sub, authorName: token.name };
        
        mockingoose(BlogsModel).toReturn("ar", 'save');

        const response = await blogController.createBlog(request, token);

        expect(response).toEqual({
            status: true,
            data: null,
            message: 'Blog created successfully',
            statusCode: EHTTPCode.CREATED,
        });
    });
});

describe('BlogController - updateBlog', () => {
    let blogController: BlogController;

    beforeEach(() => {
        blogController = new BlogController();
        jest.clearAllMocks();
        mockingoose.resetAll();
    });

    it('should return unauthorized if token is not provided', async () => {
        const request: IBlogUpdateRequest = { title: 'Updated Title', content: 'Updated Content' };

        const response = await blogController.updateBlog(request, 'blogId', undefined);

        expect(response).toEqual({
            status: false,
            data: null,
            message: 'Please provide a valid token',
            statusCode: EHTTPCode.UNAUTHORIZED,
        });
    });

    it('should return not found if the blog does not exist or does not belong to the user', async () => {
        const request: IBlogUpdateRequest = { title: 'Updated Title', content: 'Updated Content' };
        const token = { sub: 'authorId', name: 'authorName' };

        // Mock the findOne method to return null
        mockingoose(BlogsModel).toReturn(null, 'findOne');

        const response = await blogController.updateBlog(request, 'blogId', token);

        expect(response).toEqual({
            status: false,
            data: null,
            message: 'Blog not found',
            statusCode: EHTTPCode.NOT_FOUND,
        });
    });

    it('should return an error if blog update fails', async () => {
        const request: IBlogUpdateRequest = { title: 'Updated Title', content: 'Updated Content' };
        const token = { sub: 'authorId', name: 'authorName' };

        // Mock the findOne method to return a blog object
        mockingoose(BlogsModel).toReturn({ _id: 'blogId', author: token.sub, isDeleted: false }, 'findOne');

        // Mock the findOneAndUpdate method to return null
        mockingoose(BlogsModel).toReturn(null, 'findOneAndUpdate');

        const response = await blogController.updateBlog(request, 'blogId', token);

        expect(response).toEqual({
            status: false,
            data: null,
            message: 'Failed to update blog',
            statusCode: EHTTPCode.INTERNAL_SERVER_ERROR,
        });
    });

    it('should update a blog successfully', async () => {
        const request: IBlogUpdateRequest = { title: 'Updated Title', content: 'Updated Content' };
        const token = { sub: 'authorId', name: 'authorName' };

        // Mocking BlogsModel.findOne to return the blog object to be updated
        mockingoose(BlogsModel).toReturn({
            _id: 'blogId',
            author: 'authorId',
            isDeleted: false,
        }, 'findOne');

        // Mocking BlogsModel.findOneAndUpdate to simulate successful update
        mockingoose(BlogsModel).toReturn({
            _id: 'blogId',
            title: 'Updated Title',
            content: 'Updated Content',
            author: 'authorId',
            authorName: 'authorName',
            updatedAt: new Date(),
        }, 'findOneAndUpdate');

        const response = await blogController.updateBlog(request, 'blogId', token);

        expect(response).toEqual({
            status: true,
            data: {
                _id: 'blogId',
                title: 'Updated Title',
                content: 'Updated Content',
                author: 'authorId',
                authorName: 'authorName',
            },
            message: 'Blog updated successfully',
            statusCode: EHTTPCode.CREATED,
        });
    });
});

describe('BlogController - deleteBlog', () => {
    let blogController: BlogController;

    beforeEach(() => {
        blogController = new BlogController();
        jest.clearAllMocks();
        mockingoose.resetAll();
    });

    it('should return unauthorized if token is not provided', async () => {
        const response = await blogController.deleteBlog('blogId', undefined);

        expect(response).toEqual({
            status: false,
            data: null,
            message: 'Please provide a valid token',
            statusCode: EHTTPCode.UNAUTHORIZED,
        });
    });

    it('should return not found if the blog does not exist or does not belong to the user', async () => {
        const token = { sub: 'authorId', name: 'authorName' };

        // Mock BlogsModel.findOne to return null
        mockingoose(BlogsModel).toReturn(null, 'findOne');

        const response = await blogController.deleteBlog('blogId', token);

        expect(response).toEqual({
            status: false,
            data: null,
            message: 'Blog not found',
            statusCode: EHTTPCode.NOT_FOUND,
        });
    });

    it('should return an error if blog deletion fails', async () => {
        const token = { sub: 'authorId', name: 'authorName' };

        // Mock BlogsModel.findOne to return a blog object
        mockingoose(BlogsModel).toReturn({ _id: 'blogId', author: token.sub, isDeleted: false }, 'findOne');

        // Mock BlogsModel.findOneAndUpdate to return null
        mockingoose(BlogsModel).toReturn(null, 'findOneAndUpdate');

        const response = await blogController.deleteBlog('blogId', token);

        expect(response).toEqual({
            status: false,
            data: null,
            message: 'Failed to delete blog',
            statusCode: EHTTPCode.INTERNAL_SERVER_ERROR,
        });
    });

    it('should delete a blog successfully', async () => {
        const token = { sub: 'authorId', name: 'authorName' };

        // Mock BlogsModel.findOne to return a blog object
        mockingoose(BlogsModel).toReturn({ _id: 'blogId', author: token.sub, isDeleted: false }, 'findOne');

        // Mock BlogsModel.findOneAndUpdate to return an updated blog object with isDeleted set to true
        mockingoose(BlogsModel).toReturn({ _id: 'blogId', isDeleted: true }, 'findOneAndUpdate');

        const response = await blogController.deleteBlog('blogId', token);

        expect(response).toEqual({
            status: true,
            data: null,
            message: 'Blog deleted successfully',
            statusCode: EHTTPCode.CREATED,
        });
    });
});
