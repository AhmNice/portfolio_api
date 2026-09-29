
> **Note:** This is a sample technical post used to test Markdown rendering.

## Introduction

Building a REST API with **Node.js**, **TypeScript**, and **Express** is a great way to create scalable backend applications.

## Featured Images

![Controller photo 1](images/Black_game_controller_standing_u…_202607221235.jpeg)

![Controller photo 2](<images/Black_game_controller_standing_u…_202607221242 (1).jpeg>)

![Controller photo 3](images/Black_game_controller_standing_u…_202607221242.jpeg)

You can install the required dependencies with:

```bash
npm install express
npm install -D typescript @types/express
```

---

## Creating a Simple Server

Here's a basic Express server:

```typescript
import express from "express";

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

The server exposes a simple health-check endpoint:

```http
GET /api/health
```

And returns:

```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## Using Environment Variables

Never hard-code sensitive configuration such as database credentials or API keys.

Instead, use environment variables:

```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
JWT_SECRET="super-secret-key"
```

Then access them in Node.js:

```typescript
const port = process.env.PORT || 3000;

console.log(`Server running on port ${port}`);
```

> **Warning:** Never commit your `.env` file to Git.

Add it to `.gitignore`:

```gitignore
node_modules/
.env
dist/
```

---

## API Response Structure

I usually prefer keeping API responses consistent.

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
```

A successful response might look like:

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "123",
    "name": "Awwal",
    "email": "awwal@example.com"
  }
}
```

---

## Common HTTP Status Codes

| Status | Meaning               | Example                        |
| ------ | --------------------- | ------------------------------ |
| `200`  | OK                    | Successful GET request         |
| `201`  | Created               | Resource successfully created  |
| `400`  | Bad Request           | Invalid request data           |
| `401`  | Unauthorized          | Missing/invalid authentication |
| `403`  | Forbidden             | User doesn't have permission   |
| `404`  | Not Found             | Resource doesn't exist         |
| `500`  | Internal Server Error | Unexpected server error        |

---

## Authentication

A common authentication flow looks like this:

1. User submits their credentials.
2. Server validates the credentials.
3. Server generates an access token.
4. Client stores the token.
5. Client sends the token with subsequent requests.

For example:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

In Express, you could create authentication middleware:

```typescript
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  next();
};
```

---

## A Useful Quote

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."

This is one of the reasons I prefer readable code over clever code.

---

## Inline Code

You can use inline code when mentioning things like `npm install`, `express`, `useState()`, `process.env`, or `git commit`.

For example:

> The `authenticate()` middleware checks whether the request contains a valid access token.

---

## Task List

Things I want to implement:

- [x] Create Express server
- [x] Add TypeScript
- [x] Add environment variables
- [ ] Add PostgreSQL
- [ ] Add Prisma ORM
- [ ] Implement authentication
- [ ] Add API documentation
- [ ] Deploy the application

---

## Final Thoughts

A good backend isn't just about making endpoints work.

It should also be:

- **Secure**
- **Maintainable**
- **Testable**
- **Well documented**
- **Easy to scale**

If you're building a production application, don't forget about validation, authentication, authorization, logging, error handling, testing, and API documentation.

---

### What's Next?

In the next post, we'll look at how to structure a production-ready Node.js project using:

```text
src/
├── controllers/
├── services/
├── repositories/
├── routes/
├── middleware/
├── schemas/
├── utils/
└── app.ts
```

**Happy coding! 🚀**
