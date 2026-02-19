export async function json(req, res) {
    const contentType = req.headers['content-type'] ?? '';

    res.setHeader('Content-Type', 'application/json')

    if (!contentType.includes('application/json')) {
        req.body = null;
        return;
    }

    const buffers = [];

    for await (const chunk of req) {
        buffers.push(chunk);
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString());
    } catch (error) {
        return req.body = null;
    }
}
