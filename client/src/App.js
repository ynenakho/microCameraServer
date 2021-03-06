import React, { Component } from 'react';
import Webcam from 'react-webcam';
import socketIOClient from 'socket.io-client';

class App extends Component {
  constructor() {
    super();

    this.state = {
      endpoint: 'micro-camera-server.herokuapp.com'
    };
  }

  componentDidMount() {
    this.socket = socketIOClient(this.state.endpoint);
    this.socket.on('snapshot', () => {
      this.capture();
    });
    this.socket.on('disconnect', () => {
      window.location.reload();
    });
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    console.log('CHEEEEEESEEEE');
    console.log('socket = ', this.socket);
    const imageSrc = this.webcam.getScreenshot();
    console.log(imageSrc);
    this.socket.emit('snap', imageSrc);
    console.log('socket emited!');
  };

  send = () => {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('change color', this.state.color); // change 'red' to this.state.color
  };

  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: 'user'
    };

    return (
      <div className="app">
        <div className="cameraWrapper">
          <Webcam
            audio={false}
            height={350}
            ref={this.setRef}
            screenshotFormat="image/jpeg"
            width={350}
            videoConstraints={videoConstraints}
          />
        </div>
      </div>
    );
  }
}

export default App;
