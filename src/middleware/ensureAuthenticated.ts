import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).json({
            errorCode: "token.invalid",
        });
    }

    //Uma desestruturação do token. Vem como "Bearer dafsd5f4as65df465asd4f65as4d6"
    //Desse forma, com os colchetes estamos pegando o token e descartando o que vem antes, splitando com espaço.
    const [, token] = authToken.split(" ");

    try {
        const { sub } = verify(token, process.env.JWT_SECRET) as IPayload;
        request.user_id = sub;
        return next();
    } catch (err) {
        return response.status(401).json({ 
            errorCode: "token.expired",
        })
    }

}