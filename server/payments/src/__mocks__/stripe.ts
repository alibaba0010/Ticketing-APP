import { jest } from "@jest/globals";

const createMock = jest.fn((body: any) =>
  Promise.resolve({ id: "ch_test", amount: body.amount, currency: "usd" })
);

const listMock = jest.fn(() => {
  const calls = createMock.mock.calls;
  const data = calls.map((args: any[]) => ({
    id: "ch_test",
    amount: args[0].amount,
    currency: "usd",
  }));
  return Promise.resolve({ data });
});

export const stripe = {
  charges: {
    create: createMock,
    list: listMock,
  },
};
