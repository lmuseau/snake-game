import React, { Component } from 'react';
import Snake from './Snake';
import Food from './Food';

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  let y = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  return [x,y]
}

const initialState = {
  food: getRandomCoordinates(),
  speed: 200,
  direction: 'RIGHT',
  snakeDots: [
    [0, 0],
    [2, 0],
    [4, 0]
  ]
}

class App extends Component {

  constructor(props) {
    super();
    this.state = initialState;
  }

  speed() {
    clearInterval(this.interval);
    this.interval = setInterval(this.moveSnake, this.state.speed);
  }

  componentDidMount() {
    this.speed();
    document.onkeydown = this.onKeyDown;
  }

  componentDidUpdate() {
    this.checkIfOutOfBorders();
    this.checkIfCollapsed();
    this.checkIfEat();
    this.speed();
  }

  onKeyDown = (e) => { // this code changes direction of the snake
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        this.setState({direction: 'UP'});
        break;
      case 40:
        this.setState({direction: 'DOWN'});
        break;
      case 37:
        this.setState({direction: 'LEFT'});
        break;
      case 39:
        this.setState({direction: 'RIGHT'});
        break;
      // no default
    }
  }

  moveSnake = () => {  // this code moves snake in the direction chosen from onKeyDown
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];
    switch (this.state.direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        break;
      // no default
    }
    dots.push(head);
    dots.shift();
    this.setState({
      snakeDots: dots
    }) 
  }

  checkIfEat() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;
    if (head[0] === food[0] && head[1] === food[1]) {
      let newState = { ...this.state };
      newState.food = getRandomCoordinates();
      newState.snakeDots = this.enlargeSnake();
      newState.speed = this.increaseSpeed();
      this.setState(newState);
      this.speed();
    }
  }

  enlargeSnake() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([]);
    return newSnake;
  }

  increaseSpeed() {
    if (this.state.speed > 50) {
      return this.state.speed - 10;
    }
  }

  checkIfOutOfBorders() { // check if snake is out of borders
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }

  checkIfCollapsed() { // check if snake hit itself
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        this.onGameOver();
      }
    })
  }

  onGameOver() { // game over message
    alert(`Game Over. Snake length is ${this.state.snakeDots.length}`);
    this.setState(initialState)
  }

  render() {
    return (
      <div className="game-area">
        <Snake snakeDots={this.state.snakeDots}/>
        <Food dot={this.state.food}/>
      </div>
    );
  }
}

export default App;
