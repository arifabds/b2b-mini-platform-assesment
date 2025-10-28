import { http, HttpResponse } from 'msw'
import { user } from '../../mocks/db'
import type { User } from '../../types'


export const authHandlers = [
    // Intercepts POST requests to /api/login for user authentication.
    http.post('/api/login', async ({ request }) => {

        const credentials = await request.json() as Omit<User, 'id' | 'firstName' | 'lastName'>;

        if (credentials.email === user.email && credentials.password === user.password) {
            // On success, return a mock token and user data without the password.
            const { password, ...userWithoutPassword } = user;

            return HttpResponse.json({
                token: 'mock-jwt-token-12345',
                user: userWithoutPassword,
            });
        }

        // On failure, return a 401 Unauthorized error.
        return HttpResponse.json(
            { message: 'Invalid e-mail or password' },
            { status: 401 }
        );
    }),
];