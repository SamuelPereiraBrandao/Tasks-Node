function extractBoundary(contentType) {
    const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    return boundaryMatch ? (boundaryMatch[1] || boundaryMatch[2]) : null;
}

export async function parseMultipartFile(req, fieldName) {
    const contentType = req.headers['content-type'] ?? '';
    const boundary = extractBoundary(contentType);

    if (!boundary) {
        return null;
    }

    const buffers = [];
    for await (const chunk of req) {
        buffers.push(chunk);
    }

    const body = Buffer.concat(buffers).toString('utf-8');
    const parts = body.split(`--${boundary}`).slice(1, -1);

    for (const part of parts) {
        const normalizedPart = part.replace(/^\r\n/, '');
        const [rawHeaders, rawBody = ''] = normalizedPart.split('\r\n\r\n');

        if (!rawHeaders) {
            continue;
        }

        const nameMatch = rawHeaders.match(/name="([^"]+)"/i);
        if (!nameMatch || nameMatch[1] !== fieldName) {
            continue;
        }

        const filenameMatch = rawHeaders.match(/filename="([^"]*)"/i);
        const content = rawBody.replace(/\r\n$/, '');

        return {
            filename: filenameMatch ? filenameMatch[1] : null,
            content
        };
    }

    return null;
}
