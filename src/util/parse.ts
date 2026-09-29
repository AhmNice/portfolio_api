export const parseArticleInput = (body: Record<string, any>) => {
  return {
    ...body,

    techStack:
      typeof body.techStack === "string"
        ? JSON.parse(body.techStack)
        : body.techStack,

    featured:
      typeof body.featured === "string"
        ? body.featured === "true"
        : body.featured,

    publishedAt:
      body.publishedAt
        ? new Date(body.publishedAt)
        : undefined,
  };
};