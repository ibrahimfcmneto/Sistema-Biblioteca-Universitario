
const express = require('express'); 
const mysql = require('mysql2');     


const app = express();               
const port = 3000;                  


app.use(express.urlencoded({ extended: true }));
app.use(express.static('Aluno'));  
app.use(express.static('Bibliotecario'));             


const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'SENHA BANCO DE DADOS',      
    database: 'biblioteca_puc'
});

app.post('/cadastrar', (req, res) => {
    
    console.log('Recebi dados do formulário:');
    
    const nome = req.body.nome;
    const ra = req.body.ra;

    console.log('Nome:', nome, 'RA:', ra);

    
    const sql = "INSERT INTO alunos (nome, ra) VALUES (?, ?)";

    db.query(sql, [nome, ra], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar no banco:', err);
            res.send('Ocorreu um erro ao tentar cadastrar. Tente novamente.');
            return;
        }

        console.log('Aluno cadastrado com sucesso!');
        res.send('<h1>Cadastro realizado com sucesso!</h1> <a href="/">Voltar</a>');
    });
});
app.post('/cadastrar-livro', (req, res) => {
    
    console.log('Recebi dados do formulário [LIVRO]:');

    const titulo = req.body.titulo;
    const codigo_livro = req.body.codigo_livro;
    const genero = req.body.genero;
    const autor = req.body.autor;
    const editora = req.body.editora;
    const quantidade_total = req.body.quantidade_total;
    
    const quantidade_disponivel = quantidade_total; 

    console.log('Dados do Livro:', { titulo, codigo_livro, autor, quantidade_total });

    const sql = `
        INSERT INTO Livros 
        (codigo_livro, titulo, autor, genero, editora, quantidade_total, quantidade_disponivel) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [codigo_livro, titulo, autor, genero, editora, quantidade_total, quantidade_disponivel], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar livro:', err);
            
            if (err.code === 'ER_DUP_ENTRY') {
                // CORRIGIDO AQUI:
                return res.status(409).send('<h1>Erro: Este Código de Livro já está cadastrado.</h1> <a href="/cadastro.html">Voltar</a>');
            }
            
            // CORRIGIDO AQUI:
            res.status(500).send('Ocorreu um erro ao tentar cadastrar o livro. Tente novamente. <a href="/cadastro.html">Voltar</a>');
            return;
        }

        console.log('Livro cadastrado com sucesso!');
        
        // CORRIGIDO AQUI:
        res.send('<h1>Livro cadastrado com sucesso!</h1> <a href="/cadastro.html">Voltar</a>');
    });
});

//INICIANDO O SERVIDOR
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log('Acesse http://localhost:3000 no seu navegador.');
});

//http://localhost:3000/cadastro.html para cadastro de aluno
//http://localhost:3000/cadastrar-livro para cadastro de livro 
