const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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


function saveImageToServer(imageSrc) {
	console.log(" imageSrc = ", imageSrc);
	const base64Data = imageSrc.replace(/^data:image\/jpeg;base64,/, "");
	console.log("base64Data = ", base64Data);
	const filePath = `uploads/snapshot.jpeg`
	fs.writeFile(filePath, base64Data, 'base64', function(err) {
		if(err){
		   console.log(err);
		 }
	});
	console.log('saved! ');
}


router.get('/snapshot', (req, res) => {
  console.log('say cheeesee');
  client.emit('snapshot', true);
  return client.on('snap', imageSrc => {
	client.disconnect();
	saveImageToServer(imageSrc);




    return res.json({ imageSrc });
  });
});

app.use('/', router);

// Server  static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  app.use("/uploads", express.static('uploads/'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

server.listen(port, () => console.log(`Listening on port ${port}`));
