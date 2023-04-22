/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const tweetInputProcedure = protectedProcedure.input(
  z.object({
    content: z.string(),
    // authorId: z.string()
  })
);

export const paginationsInputProcedure = publicProcedure.input(
  z.object({
    offset: z.number(),
    number: z.number(),
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
        author: true,
        likedBy: true,
        comments: true
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
      take: input.number,
      skip: input.offset,
      include: {
        author: true,
        likedBy: true,
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return tweets;
  }),
  createTweet: tweetInputProcedure.mutation(async ({ input, ctx }) => {
    const tweet = await ctx.prisma.tweet.create({
      data: {
        authorId: ctx.session.user.id,
        content: input.content,
      },
    });
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
        content: z.string().max(200).min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          tweetId: input.tweetId,
          authorId: ctx.session.user.id
        }
      })
      return comment
    }),
    getCommentOnTweets: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          tweetId: input 
        },
        include: {
          author: true
        },
        orderBy: {
          createdAt: "desc"
        }
      })

      return comments
    })
});
