import { Post, User } from "@prisma/client";
import { prisma } from "./prisma";

describe("create", () => {
  let user!: User;

  beforeEach(async () => {
    user = await prisma.user.create({
      data: {
        name: "user",
        email: "user@example.com",
      },
    });
  });

  test("投稿を一件登録する", async () => {
    const post = await prisma.post.create({
      data: {
        author: {
          connect: { id: user.id },
        },
        title: "title",
        content: "content",
      },
    });

    expect(post).not.toBe(null);
  });

  test("投稿をまとめて登録する", async () => {
    const result = await prisma.post.createMany({
      data: [
        {
          authorId: user.id,
          title: "title1",
          content: "content1",
        },
        {
          authorId: user.id,
          title: "title2",
          content: "content2",
        },
      ],
    });

    expect(result.count).toBe(2);
  });

  test("ユーザーと投稿をまとめて登録する(create)", async () => {
    const user = await prisma.user.create({
      data: {
        email: "user2@example.com",
        posts: {
          create: [{ title: "title1" }, { title: "title2" }],
        },
      },
      include: { posts: true },
    });

    expect(user).not.toBe(null);
    expect(user.posts.length).toBe(2);
  });

  test("ユーザーと投稿をまとめて登録する(createMany)", async () => {
    const user = await prisma.user.create({
      data: {
        email: "user2@example.com",
        posts: {
          createMany: {
            data: [{ title: "title1" }, { title: "title2" }],
          },
        },
      },
      include: { posts: true },
    });

    expect(user).not.toBe(null);
    expect(user.posts.length).toBe(2);
  });

  test("投稿とタグを登録する", async () => {
    const tags = ["prisma", "nodejs"];

    const postWithTags = await prisma.post.create({
      data: {
        authorId: user.id,
        title: "title",
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
      include: { postTags: { include: { tag: true } } },
    });

    expect(postWithTags.postTags.length).toBe(2);
  });

  async function createPostWithTags(
    post: { authorId: number; title: string },
    tags: string[]
  ): Promise<Post> {
    return prisma.post.create({
      data: {
        ...post,
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

  test("投稿とタグを登録する(connectOrCreate)", async () => {
    await Promise.all([
      createPostWithTags({ authorId: user.id, title: "title1" }, [
        "prisma",
        "nodejs",
      ]),
      createPostWithTags({ authorId: user.id, title: "title1" }, [
        "typescript",
        "nodejs",
      ]),
    ]);

    expect(await prisma.postTag.count()).toBe(4);
    expect(await prisma.tag.count()).toBe(3);
  });
});

describe("実行時エラー", () => {
  test.only("文字列の長さの上限を超える", async () => {
    const createUser = prisma.user.create({
      data: {
        name: "a".repeat(1000),
        email: "user@example.com",
      },
    });

    // P2000: データが長すぎる
    await expect(createUser).rejects.toMatchObject({ code: "P2000" });
  });

  test.only("ユニークキー違反", async () => {
    const createUsers = prisma.user.createMany({
      data: [{ email: "user@example.com" }, { email: "user@example.com" }],
    });

    // P2002: ユニークキー違反
    await expect(createUsers).rejects.toMatchObject({ code: "P2002" });
  });

  test.only("余剰プロパティ", async () => {
    const userData = {
      email: "user@example.com",
      hoge: "hoge",
    };

    const createUser = await prisma.user.create({
      data: userData,
    });

    // await expect(createUser).rejects.toBe(null);
  });
});
