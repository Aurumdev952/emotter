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
            author: true
        }
    })
    return tweets
  }),
  createTweet: tweetInputProcedure.mutation(async ({ input, ctx }) => {
    await ctx.prisma.tweet.create({
        data: input
    })
    return true
  })
});
