import JWT from 'jsonwebtoken';

export default class Token {
    static async verify(req, res, next) {
        let user;

        try {
            user = JWT.verify(req.cookies.session, process.env.SECRET).data;
        } catch {
            user = '';
        }

        res.set('Session-User', user);

        next();
    }
}