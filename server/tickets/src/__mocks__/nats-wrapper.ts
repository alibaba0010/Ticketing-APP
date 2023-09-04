import { jest } from "@jest/globals";
export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation((subject, data, callback) => {
      callback;
    }),
    //     .mockImplementation(
    //       (subject: string, data: string, callback: () => void) => {
    //         callback();
    //       }
    //     ),
  },
};

