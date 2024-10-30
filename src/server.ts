import * as http from 'node:http';
import { json } from './middlewares/json.js';
import { routes } from './http/routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

//  QUERY PARAMETERS : URL Stateful => Filtros, paginação, não-obrigatórios.
// http://localhost:3333/users?userId=1&name=Pablo

//  ROUTE PARAMETERS : Identificação de recurso
// http://localhost:3333/users/1

//  REQUEST BODY: Envio de informações de um formulário (HTTPs)


export interface UsersObjects {
    id: string;
    name: string;
    email: string;
}

const server = http.createServer(async (request: any, response: any) => {
    const { method, url } = request;

    await json(request, response);

    const route = routes.find(route => {
        return route.method === method && route.path.test(url) //Testando a ReGex bate com a url recebida
    })

    if(route) {
        const routeParams = request.url.match(route.path)

        // console.log(extractQueryParams(routeParams.groups.query))
        const { query, ...params } = routeParams.groups
        request.params = params
        request.query = query ? extractQueryParams(query) : {}

        request.params = {...routeParams.groups}

        return route.handler(request, response)
    }

    return response.writeHead(404).end('Not found!');
});

server.listen(3333, () => {
    console.log('Server is running on port: 3333');
});
