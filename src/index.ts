import express, {Application, NextFunction, Request, Response} from 'express';
import morgan from 'morgan';
import swaggerValidation from 'openapi-validator-middleware';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import users_router from './routes/users';
import blogs_router from './routes/blogs';

swaggerValidation.init('public/swagger.yaml', {beautifyErrors: true});


const mongoDB = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/blog-app';
mongoose.connect(mongoDB);

const PORT = process.env.PORT || 5000;
const app: Application = express();

app.use(express.json({ limit: 10485760 }));
app.use(morgan('tiny'));
app.use(express.static('public'));

app.use(express.urlencoded({
	extended: true,
}));

app.use(
	'/docs',
	swaggerUi.serve,
	swaggerUi.setup(undefined, {
		swaggerOptions: {
			url: '/swagger.yaml',
		},
	}),
);

app.use("/api/v1", users_router);
app.use("/api/v1/blogs", blogs_router);

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
	if (err instanceof swaggerValidation.InputValidationError) {
		return res.status(400).json({
			status: false,
			data: "",
			message: err.errors[0] 
		});
	}
});

app.listen(PORT, () => {
	console.log(`Blog App Backend is running on ${PORT}`) //eslint-disable-line
});