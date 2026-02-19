import http from 'node:http';
import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';
import { json } from './middlewares/json.js';

const database = new Database();

const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query;

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search,
            } : null);


            return res.end(JSON.stringify(tasks));
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body ?? {};

            if (!title || !description) {
                return res.writeHead(400).end(JSON.stringify({
                    message: 'title and description are required'
                }));
            }

            const note = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            };

            database.insert('tasks', note);
            return res.writeHead(201).end();
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const { title, description } = req.body ?? {};

            if (!title || !description) {
                return res.writeHead(400).end(JSON.stringify({
                    message: 'title and description are required'
                }));
            }

            database.update('tasks', id, {
                title,
                description,
                updated_at: new Date(),
                completed_at: new Date()
            });

            return res.writeHead(204).end();
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            database.delete('tasks', id);
            return res.writeHead(204).end();
        }
    }
];

const server = http.createServer(async (req, res) => {
    await json(req, res);

    const route = routes.find(route => {
        return route.method === req.method && route.path.test(req.url);
    });

    if (route) {
        const routeParams = req.url.match(route.path);

        req.params = routeParams.groups;
        const query = req.params.query;

        req.query = query
            ? Object.fromEntries(new URLSearchParams(query.slice(1)))
            : {};

        delete req.params.query;

        return route.handler(req, res);
    }

    return res.writeHead(404).end(JSON.stringify({
        message: 'Route not found'
    }));
});

server.listen(3333);
