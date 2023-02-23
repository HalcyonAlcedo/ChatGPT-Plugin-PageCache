#!/usr/bin/env node
import fastify from 'fastify';
import cors from '@fastify/cors';
import fstatic from '@fastify/static';
import random from 'string-random';
import swig from 'swig';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

const server = fastify();

const ChatGPT = swig.compileFile('template/ChatGPT.html')
const Bing = swig.compileFile('template/Bing.html')

await server.register(cors, {
    origin: '*',
})
await server.register(fstatic, {
    root: path.join(__dirname, '/tempage/'),
    prefix: '/'
})

await server.setNotFoundHandler((request, reply) => {
  reply.redirect('/404.html')
})

server.post('/cache', async (request, reply) => {
    const body = request.body || {};

    if (body.content) {
        let Web_Output = body.bing ? 
        Bing({
            content: body.content.content,
            prompt: body.content.prompt,
            quote: body.content.quote,
            senderName: body.content.senderName
        }) : 
        ChatGPT({
            content: body.content.content,
            prompt: body.content.prompt,
            senderName: body.content.senderName
        })
        let data = Web_Output
        let buffer = Buffer.from(data)
        let filename = body.entry ? body.entry : random(5, {letters: true, numbers: true});
        if (fs.existsSync(`tempage/${filename}`)) {
            await fs.rmdir(imgDirPath, { recursive: true })
        }
        await fs.mkdir(`tempage/${filename}`, (err) => {
            if (err) throw err
            fs.writeFile(`tempage/${filename}/index.html`, buffer, {flag: 'a'}, function(err) {
                if (err) {
                    filename = ''
                    console.log(`${filename}创建缓存失败`, err)
                } else {
                    console.log(`${filename}创建缓存成功`)
                }
            })
        })

        reply.send({
            file: filename,
        });
    }
})

server.listen({
    port: 3000,
    host: 'localhost'
}, (error) => {
    if (error) {
        console.error(error);
    }
    server.log.info(`server listening on ${server.server.address().port}`)
});
