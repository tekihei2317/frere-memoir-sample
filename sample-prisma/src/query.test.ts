import { Post, Prisma, User } from "@prisma/client";
import { prisma } from "./prisma";

type CreatePostInput = {
  authorId: number;
  title: string;
  content: string;
  published: boolean;
};

describe("query", () => {
  let user!: User;
  let postInput!: CreatePostInput;

  beforeEach(async () => {
    user = await prisma.user.create({
      data: {
        name: "user",
        email: "user@example.com",
      },
    });
    postInput = {
      authorId: user.id,
      title: "test",
      content: "test",
      published: true,
    };
  });

  test("1つのテーブルからデータを1件取得する", async () => {
    const createdPost = await prisma.post.create({
      data: {
        authorId: user.id,
        title: "test",
        content: "test",
        published: false,
      },
    });
    const post = await prisma.post.findUniqueOrThrow({
      where: { id: createdPost.id },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    expect(post).not.toBe(null);
  });

  test("1つのテーブルからデータを複数取得する", async () => {
    const postInput: Prisma.PostCreateManyInput = {
      authorId: user.id,
      title: "test",
      content: "test",
      published: true,
    };
    const result = await prisma.post.createMany({
      data: [postInput, postInput],
    });
    console.log({ result });

    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
      },
      where: {
        authorId: user.id,
        published: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    expect(posts.length).toBe(2);
  });

  test("ユーザーとそのユーザーの投稿を取得する(select)", async () => {
    await prisma.post.createMany({
      data: [postInput, postInput],
    });

    const userWithPosts = await prisma.user.findUniqueOrThrow({
      select: {
        id: true,
        posts: true,
      },
      where: {
        id: user.id,
      },
    });

    expect(userWithPosts.id).toBe(user.id);
    expect(userWithPosts.posts.length).toBe(2);
  });

  test("ユーザーとそのユーザーの投稿を取得する(include)", async () => {
    await prisma.post.createMany({
      data: [postInput, postInput],
    });

    const userWithPosts = await prisma.user.findUniqueOrThrow({
      include: {
        posts: true,
      },
      where: {
        id: user.id,
      },
    });

    expect(userWithPosts.id).toBe(user.id);
    expect(userWithPosts.posts.length).toBe(2);
  });

  test("投稿をユーザーのメールアドレスで検索する", async () => {
    await prisma.post.createMany({
      data: [postInput, { ...postInput, published: true }],
    });

    const posts = await prisma.post.findMany({
      select: { id: true, title: true },
      where: {
        author: {
          email: "user@example.com",
        },
      },
    });
    expect(posts.length).toBe(2);
  });

  test("投稿をユーザーのメールアドレスでソートする", async () => {
    await prisma.post.createMany({
      data: [postInput, { ...postInput, published: true }],
    });

    const posts = await prisma.post.findMany({
      select: { id: true, title: true },
      orderBy: {
        author: { email: "asc" },
      },
      take: 10,
    });
    expect(posts.length).toBe(2);
  });
});

describe("aggregation", () => {
  let user!: User;
  let postInput!: CreatePostInput;

  beforeEach(async () => {
    user = await prisma.user.create({
      data: {
        name: "user",
        email: "user@example.com",
      },
    });
    postInput = {
      authorId: user.id,
      title: "test",
      content: "test",
      published: true,
    };
  });

  async function createPostWithTags(tags: string[]): Promise<Post> {
    return prisma.post.create({
      data: {
        ...postInput,
        postTags: {
          create: tags.map((tag) => ({
            tag: {
              connectOrCreate: {
                where: { name: tag },
                create: { name: tag },
              },
            },
          })),
        },
      },
    });
  }

  test("タグごとの記事数を取得する", async () => {
    await Promise.all([
      createPostWithTags(["prisma", "typescript"]),
      createPostWithTags(["prisma", "nodejs"]),
    ]);

    const result = await prisma.postTag.groupBy({
      by: ["tagId"],
      _count: true,
      orderBy: { tagId: "asc" },
    });
    const articleCounts = result.map((tag) => tag._count);
    articleCounts.sort();

    expect(articleCounts).toStrictEqual([1, 1, 2]);
  });

  test("タグごとの記事数を取得する(Raw SQL)", async () => {
    await Promise.all([
      createPostWithTags(["prisma", "typescript"]),
      createPostWithTags(["prisma", "nodejs"]),
    ]);

    type TagWithPostCount = {
      id: number;
      name: string;
      postCount: bigint;
    };

    const result = await prisma.$queryRaw<TagWithPostCount[]>`
      select
        Tag.id,
        Tag.name,
        count(Tag.id) as postCount
      from
        PostTag
        inner join Tag
        on PostTag.tagId = Tag.id
      group by
        Tag.id
      order by
        postCount desc,
        name
      ;
    `;
    expect(result).toMatchObject([
      { name: "prisma", postCount: BigInt(2) },
      { name: "nodejs", postCount: BigInt(1) },
      { name: "typescript", postCount: BigInt(1) },
    ]);
  });
});
