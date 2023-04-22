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


export const userRouter = createTRPCRouter({
    getUser: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
        const user = await ctx.prisma.user.findUnique({
            where: {
                id: input,
            },
            include: {
                likedTweets: {
                    include: {
                        tweet: {
                            include: {
                                author: true,
                                likedBy: true,
                                comments: true,
                            }
                        },
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                tweets: {
                    include: {
                        author: true,
                        likedBy: true,
                        comments: true,
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        })
        if (user === null) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                cause: "user not found"
            })
        }
        return user;
    })
})