/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";


export const tweetInputProcedure = protectedProcedure.input(z.object({
    content: z.string(),
    authorId: z.string()
}))

export const paginationsInputProcedure = publicProcedure.input(z.object({
    offset: z.number(),
    number: z.number()
}))
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
  getAllTweets: paginationsInputProcedure.query(async ({ input, ctx }) => {
    
    const tweets = await ctx.prisma.tweet.findMany({
        take: input.number,
        skip: input.offset,
        include: {
            author: true,
            likedBy: true
        },
        orderBy: {
          createdAt: "desc"
        }
    })
    return tweets
  }),
  createTweet: tweetInputProcedure.mutation(async ({ input, ctx }) => {
    const tweet = await ctx.prisma.tweet.create({
        data: input
    })
    return tweet
  }),
  likeTweet: protectedProcedure.input(z.object({
    userId: z.string(),
    tweetId: z.string()
  })).mutation( async ({ input, ctx }) => {
    const newLike = await ctx.prisma.userOnTweet.create({
      data: {
        ...input
      }
    })
    return newLike
  }),
  unlikeTweet: protectedProcedure.input(z.object({
    userId: z.string(),
    tweetId: z.string()
  })).mutation(async ({ ctx, input }) => {
    const unlike = await ctx.prisma.userOnTweet.delete({
    where: {
      userId_tweetId: input
      }  
    })
    return unlike 
  })
});
