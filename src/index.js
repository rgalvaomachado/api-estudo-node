const express = require('express');
const uuidv4 = require('uuidv4');

const app = express();

app.use(express.json()); // conseguir pegar json no body com o express;

// let { teste } = request.query; // desestruturar  (aponta nome especifico)
// let query = request.query;   // pega parametros query (site?teste=php)
// let params = request.params;   //pegar parametros params (site/id)
// let body = request.body;

let projects = [];

function logRequests(request, response, next){
    let { method, url}  = request;
    let logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next();

    console.timeEnd(logLabel);
}

function validateProjectId (request, response, next){
    let params = request.params;
    let id = params.id;

    if(!uuidv4.isUuid(id)){
        return response.status(400).json({
            error: 'Invalid ID.',
        });
    }

    return next();
}

app.use(logRequests);
app.use('/app/:id', validateProjectId);

//rota app get
app.get('/app', (request, response) => {
    let query = request.query;
    if(query.id != undefined){
        let findIndex = projects.findIndex(({ id }) => id == query.id);
        return response.json({
            projeto: projects[findIndex],
        });
    }else{
        return response.json({
            projetos: projects,
        });
    }
})

//rota app post
app.post('/app', (request, response) => {
    let body = request.body;

    nomeProjeto = body.nome;
    donoProjeto = body.dono;
    
    projects.push({
        id: uuidv4.uuid(),
        nome : nomeProjeto,
        dono : donoProjeto,
    })

    return response.json({
        message: 'Projeto '+nomeProjeto+' adicionado',
    });
})

//rota app put
app.put('/app/:id', validateProjectId, (request, response) => {
    let params = request.params;
    let findIndex = projects.findIndex(({ id }) => id == params.id)
    if (findIndex >= 0){
        let body = request.body;
        let projeto = projects[findIndex];
        projects[findIndex].nome = body.nome;
        projects[findIndex].dono = body.dono;
       
        return response.json({ 
            projeto: projeto.nome+' atualizado',
        });
    }else{
        return response.json({ 
            message: 'Projeto não encontrado',
        });
    }
})

//rota app delete
app.delete('/app/:id', (request, response) => {
    let params = request.params;
    let findIndex = projects.findIndex(({ id }) => id == params.id)
    if (findIndex >= 0){
        projects.splice(findIndex, 1);
        return response.json({
            message: 'Projeto deletado'
        });
    }else{
        return response.json({ 
            message: 'Projeto não encontrado',
        });
    }
})


//iniciar a aplicação na porta 8080
app.listen(8080, () => {
    console.log('Back-end!')
});