const express = require('express');
const sqlite3 = require('sqlite3').verbose();
//const sqlite3 = require('node:sqlite'); 

const app = express();
const PORTA = 3000;

// Configuração do motor de visualização e recebimento de dados
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Inicialização e conexão com o banco de dados
const db = new sqlite3.Database('gamevault.db', (err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        const queryCriacao = 
        `CREATE TABLE IF NOT EXISTS jogos(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT,
            plataforma TEXT,
            status TEXT,
            nota INTEGER,   
            capa_url TEXT
        )`;
        db.run(queryCriacao, (err) => {
            if(err) console.error("Erro ao criar tabela:", err.message);
        });
    }
});

app.get('/cadastrar', (req,res) => {
    res.render('cadastro');
})

app.post('/cadastrar', (req, res) => {
    const { titulo, plataforma, status, nota, capa_url } = req.body;
    const query = `INSERT INTO jogos(titulo,plataforma,status,nota,capa_url) VALUES (?, ?, ?, ?, ?)`; 
    db.run(query,[titulo,plataforma,status,nota,capa_url],(err,result) => {
        if(err){
            console.error(err);
            return res.status(500).send("Erro na catalogação de jogo");
        }
        res.redirect('/');
    });
});

app.get('/', (req, res) => {
    
    const query = `SELECT * from jogos`; 
    
    db.all(query,[], (err,rows) =>{
        if(err){
            console.error(err);
            return res.status(500).send("Não tem nenhum jogo catalogado");
        }
        res.render("index",{jogos: rows});
    }); 
});

app.get('/deletar/:id', (req, res) => {

    const idDoJogo = req.params.id;
    const query = `DELETE FROM jogos WHERE id = ?`;
    db.run(query, [idDoJogo], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao deletar jogo");
        }
        res.redirect('/');
    });
});

// O servidor ficará ouvindo a porta 3000
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
