import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
export class Password {
  static async hashPassword(password: string) {
    const salt = randomBytes(6).toString("hex");
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buffer.toString("hex")}.${salt}`;
  }
  static async comparePassword(srtoredPassowrd: string, password: string) {
    const [hashedPassword, salt] = srtoredPassowrd.split(".");
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer;
    return buffer.toString("hex") === hashedPassword;
  }
}
