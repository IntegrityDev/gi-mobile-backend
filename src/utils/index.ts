import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { APP_SECRET } from "../config";

export async function GenerateSalt(): Promise<string> {
    return await bcrypt.genSalt();
}

export async function GeneratePassword(password: string, salt: string): Promise<string> {
    const generatedPassword = await bcrypt.hash(password, salt);
    return generatedPassword;
}

export async function ValidatePassword(
    enteredPassword: string,
    savedPassword: string,
    salt: string
): Promise<boolean> {
    return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
}

export async function GenerateSignature(payload: any): Promise<string | Error> {
    try {
        return await jwt.sign(payload, APP_SECRET as string, { expiresIn: "30d" });
    } catch (error) {
        console.error(error);
        return error as string;
    }
}

export function ComparePassword(password: string, savedPassword: string): boolean {
    const comparedPass = bcrypt.compareSync(password, savedPassword);
    return comparedPass;
}

export async function ValidateSignature(req: any): Promise<boolean> {
    try {
        const signature = req.get("Authorization");
        if (!signature) {
            return false;
        }
        const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET as string);
        req.user = payload;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export function FormateData(data: any): { data: any; error?: { message: string } } {
    if (data) {
        return { data };
    } else {
        return {
            data: null,
            error: {
                message: 'Data not found'
            }
        };
    }
}

export function Slugify(value: string): string {
    try {
        if (!value) {
            return '';
        }

        return value.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    } catch (error) {
        return '';
    }
}
