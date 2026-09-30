import { prismaAdapter } from "@better-auth/prisma-adapter";
import { APIError } from "better-auth/api";
import { betterAuth } from "better-auth";

import {
  isValidIndonesianPhoneNumber,
  normalizeIndonesianPhoneNumber,
} from "@/lib/phone";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: true,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const phoneNumber = user.phoneNumber;

          if (
            typeof phoneNumber !== "string" ||
            !isValidIndonesianPhoneNumber(phoneNumber)
          ) {
            throw new APIError("BAD_REQUEST", {
              message:
                "Please enter a valid Indonesian mobile phone number.",
            });
          }

          return {
            data: {
              ...user,
              phoneNumber:
                normalizeIndonesianPhoneNumber(phoneNumber),
            },
          };
        },
      },
    },
  },
});