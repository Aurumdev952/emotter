/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { type UploadApiResponse } from "cloudinary";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const tweetInputProcedure = protectedProcedure.input(
  z.object({
    content: z.string().max(1000).min(1),
    image: z.string().optional(),
    // authorId: z.string()
  })
);

export const paginationsInputProcedure = publicProcedure.input(
  z.object({
    offset: z.number().optional(),
    number: z.number().optional(),
    cursor: z.string().optional(),
    limit: z.number().min(1).max(100).nullish(),
  })
);
export const tweetRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  getTweet: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const tweet = await ctx.prisma.tweet.findUnique({
      where: {
        id: input,
      },
      include: {
        author: {
          include: {
            followers: true,
            following: true,
          },
        },
        likedBy: true,
        comments: true,
        images: true,
      },
    });
    if (tweet === null) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        cause: "tweet not found",
      });
    }
    return tweet;
  }),
  getAllTweets: paginationsInputProcedure.query(async ({ input, ctx }) => {
    const tweets = await ctx.prisma.tweet.findMany({
      take: (input.limit ?? 50) + 1,
      // skip: input.offset,
      cursor: input.cursor ? { id: input.cursor } : undefined,
      include: {
        author: {
          include: {
            followers: true,
            following: true,
          },
        },
        likedBy: true,
        comments: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    let nextCursor: string | undefined = undefined;
    if (tweets.length > (input.limit ?? 50)) {
      const nextItem = tweets.pop();
      nextCursor = nextItem!.id;
    }
    return {
      tweets,
      nextCursor,
    };
  }),
  createTweet: tweetInputProcedure.mutation(async ({ input, ctx }) => {
    const tweet = await ctx.prisma.tweet.create({
      data: {
        authorId: ctx.session.user.id,
        content: input.content,
      },
    });
    if (input.image) {
      try {
        const r = await axios.post(
          `https:/${
            process.env.VERCEL_URL ?? "http://localhost:3000"
          }/api/upload/images`,
          {
            file: input.image,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        const results = (await r.data) as UploadApiResponse;
        await ctx.prisma.tweetImage.create({
          data: {
            publicId: results.public_id,
            url: results.secure_url,
            tweetId: tweet.id,
          },
        });
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
    return tweet;
  }),
  likeTweet: protectedProcedure
    .input(
      z.object({
        // userId: z.string(),
        tweetId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const newLike = await ctx.prisma.userOnTweet.create({
        data: {
          userId: userId,
          tweetId: input.tweetId,
        },
      });
      return newLike;
    }),
  unlikeTweet: protectedProcedure
    .input(
      z.object({
        // userId: z.string(),
        tweetId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const unlike = await ctx.prisma.userOnTweet.delete({
        where: {
          userId_tweetId: {
            userId: userId,
            tweetId: input.tweetId,
          },
        },
      });
      return unlike;
    }),
  commentOntweet: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
        content: z.string().max(500).min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          tweetId: input.tweetId,
          authorId: ctx.session.user.id,
        },
      });
      return comment;
    }),
  getCommentOnTweets: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          tweetId: input,
        },
        include: {
          author: {
            include: {
              followers: true,
              following: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return comments;
    }),
});
