const http = require('http')

const app = require('./index.js');
const socketio = require('socket.io');
const Message = require('./models/messageModel');


const {addUser, removeUser, getUser, getUsersInRoom} = require('./users.js');
const User = require('./models/userModel.js');


const server = http.createServer()
const io = socketio(server, {
  cors: {
    origin: '*',
  }
});


server.on('request', app);



io.on('connection', async (socket)=>{
  console.log('user connected')
  socket.on('join', ({name, room, uid}, callback) => {
    console.log('joined')
    const {error, user} = addUser({id: socket.id, name, room})

     if(error) return callback(error); 

    socket.join(user.room);

    socket.emit('message', {user: 'StartUpSite', text: `${user.name}, welcome to the room ${user.room}. Do you have any suggestions?`});
    socket.broadcast.to(user.room).emit('message', {user: 'StartUpSite', text: `${user.name}, has joined!`})


   callback()
    
  });

  socket.on('sendMessage', async ({message, uid, sender}, callback)=>{
    console.log('dobijena poruka: '+ message)
    console.log(uid)
    console.log(sender)
    console.log(uid === sender)

    let userr;
    try {
        userr = await User.findById(uid)
    } catch (err) {
      
    }


    const user = getUser(socket.id); 
    console.log('user room: '+user.room)

    const createdMessage = new Message({
      user: uid,
      room: user.room,
      text: message
    })

    if(uid === sender){
      try {
        await createdMessage.save();
        userr.messages.push(createdMessage);
        await userr.save();
        
      } catch (err) {
        
      }
    } else {
       try {
          await createdMessage.save(); 
         userr.received.push(createdMessage);
         await userr.save()
       } catch (err) {
         
       }
    }

    
    
    

    io.to(user.room).emit('message', {user: user.name, text: message});

     callback(); 
  })

  socket.on('disconnect', ()=>{
    console.log('user disconnected')
    const user = removeUser(socket.id);

    if(user){
      io.to(user.room).emit('message', {user: 'StartUpSite', text: `${user.name} has left`})
    }
  })
});

server.listen(process.env.PORT || 5000);

