# Blog-App-Backend

## Project Setup

Test Live Project on https://heyrahul.cloud/api/v1/
[Link to import PostMan Collection](https://drive.google.com/file/d/1tVCd0NvcLCIsC80wDaKElFx41fRbM_J3/view?usp=sharing)

### 1. Run without Docker

Command To Run the Project
```
npm run dev
```

### 2. Run with Docker
```
docker compose up --build 
```

### 3. Run Unit test
```
npm run test
```

## API Documentation

The Swagger Documentation is available here [Click here](https://heyrahul.cloud/docs/)

### User Authentication APIs

1. **Register API**
   - **Endpoint**: `api/v1/register`
   - **Method**: `POST`
   - **Payload**:
     ```json
     {
         "name": "Rahul Jain",
         "email": "rahuljain3109@gmail.com",
         "password": "password"
     }
     ```

2. **Login API**
   - **Endpoint**: `api/v1/login`
   - **Method**: `POST`
   - **Payload**:
     ```json
     {
         "email": "rahuljain3109@gmail.com",
         "password": "password"
     }
     ```

### Response for Both Register and Login APIs
```json
{
    "status": true,
    "data": {
        "token": "<token>"
    },
    "message": "User logged/Registered in successfully"
}
```

### Blog APIs

**Note**: These APIs are protected and require a valid JWT token.

1. **Add Blog**
   - **Method**: `POST`
   - **Endpoint**: `api/v1/blogs`
   - **Payload**:
     ```json
     {
         "title": "Postman",
         "content": "API "
     }
     ```

2. **Update Blog**
   - **Method**: `PUT`
   - **Endpoint**: `api/v1/blogs/:id`
   - **Payload**:
     ```json
     {
         "title": "Postman Updated",
         "content": ""
     }
     ```

3. **Get Blogs**
   - **Method**: `GET`
   - **Endpoint**: `/api/v1/blogs`
   - **Supported Query Params**:
     - `page`
     - `page_size`
     - `author`
     - `title`
   - **Note**: Records will appear in the latest first order.

4. **Delete Blog**
   - **Method**: `DELETE`
   - **Endpoint**: `/api/v1/blog/:id`