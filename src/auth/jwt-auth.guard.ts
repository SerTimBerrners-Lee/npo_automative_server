import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";


/// имплемнетация !!!
@Injectable()
export class JwtAuth implements CanActivate {

    constructor(private jwtService: JwtService) {}
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        const tryPath = this.tryPath(req.originalUrl);
        if (tryPath) return true;

        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];

            console.log('\n\n\n', authHeader, bearer, token, '\n\n\n');
            console.log(req.originalUrl);

            if (bearer !== 'Bearer' || !token || token == 'undefined') {
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }

            const user = this.jwtService.verify(token);
            // req.user = user;
            console.log('\n\n\n', user, '\n\n\n');
            // Здесь вызываем метод который фиксирует действие а платформе.
            return true;
        } catch (e) {
            console.log(e)
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }
    }

    tryPath(url: string): Boolean {
        const paths = [
            '/api/settings/inaction/',
        ];
        let find = false;
        for (const path of paths) {
            if (path === url) find = true;
        }

        return find;
    }
    
}