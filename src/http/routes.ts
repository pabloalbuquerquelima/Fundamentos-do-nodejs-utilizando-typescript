import { randomUUID } from 'node:crypto';
import { Database } from '../middlewares/database.js';
import type { UsersObjects } from '../server.js';
import { buildRoutePath } from '../utils/build-route-path.js';

//  QUERY PARAMETERS : URL Stateful => Filtros, paginação, não-obrigatórios.
//  ROUTE PARAMETERS : Identificação de recurso
//  REQUEST BODY: Envio de informações de um formulário (HTTPs)

const database = new Database();

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/users'),
        handler: (request: any, response: any) => {
            const { search } = request.query
            const users = database.select('users', search ? {
                name: search,
                email: search
            } : null)
            
            return response.end(JSON.stringify(users))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/users'),
        handler: (request: any, response: any) => {
        const { name, email } = request.body;

        const user: UsersObjects = {
            id: randomUUID(),
            name,
            email,
        };

        database.insert('users', user)
        return response.writeHead(201).end('');
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/users/:id'),
        handler: (request: any, response: any) => {

        const { id } = request.params
        const { name, email } = request.body

        database.update('users', id, {name, email})

        return response.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/users/:id'),
        handler: (request: any, response: any) => {

        const { id } = request.params

        database.delete('users', id)

        return response.writeHead(204).end()
        }
    }
]