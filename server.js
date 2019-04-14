const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
// our localhost port
const port = process.env.PORT || 4001;

const app = express();
const router = express.Router();

app.use(cors());

// our server instance
const server = http.createServer(app);

// This creates our socket using the instance of the server
const io = socketIO(server);
let client;

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  console.log('User connected');
  client = socket;

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

router.get('/snapshot', (req, res) => {
  console.log('say cheeesee');
  client.emit('snapshot', true);
  client.on('snap', imageSrc => {
    return res.send(imageSrc);
  });
});

app.use('/', router);

// Server  static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

server.listen(port, () => console.log(`Listening on port ${port}`));
