// Importando configurações do servidor
var app = require('./config/server');

// Parametrizar a porta de escuta
var server = app.listen(3000, function(){
    console.log('Servidor Online');
});

var io = require('socket.io').listen(server);

// Variavéis globais
app.set('io', io);

io.on('connection' , function(socket){
    console.log("Usuário Conectou!");

    socket.on('disconnect', function(){
        console.log("Usuário Desconectou!");
    })

    // Recebendo do Websocket
    socket.on('sendMsg', function(data){
        // Emite a função apenas para o Usuário atual da requisição
        socket.emit('msgUserIn', {
            apelido: data.apelido,
            msg : data.msg
        });

        // Emite para todos usuários do websocket
        socket.broadcast.emit('msgUserIn', {
            apelido: data.apelido,
            msg : data.msg
        });

        if(parseInt(data.insertedUser) == 0){
            socket.emit('refreshUsers', {
                apelido: data.apelido
            });
    
            socket.broadcast.emit('refreshUsers', {
                apelido: data.apelido
            });
        }
        
    })
    
    socket.on('userTyping', function(data){
        socket.broadcast.emit('userTyping', {
            apelido: data.apelido
        });
    })

    socket.on('userNotTyping', function(data){
        socket.broadcast.emit('userNotTyping', {});
    })

})