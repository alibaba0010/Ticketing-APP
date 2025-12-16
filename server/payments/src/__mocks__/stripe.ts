import { jest, test } from "@jest/globals";

export const stripe = {
  charges: {
    create: jest.fn<() => Promise<object>>().mockResolvedValue({}),
  },
};
