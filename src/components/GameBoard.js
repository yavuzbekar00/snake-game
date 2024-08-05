import React, { useState, useEffect } from "react";
import "./GameBoard.css";

const GameBoard = () => {
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [direction, setDirection] = useState("UP");
  const [food, setFood] = useState({
    x: Math.floor(Math.random() * 25),
    y: Math.floor(Math.random() * 25),
  });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(200);

  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ]);
    setDirection("UP");
    setFood({
      x: Math.floor(Math.random() * 25),
      y: Math.floor(Math.random() * 25),
    });
    setGameOver(false);
    setScore(0);
    setSpeed(200);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = newSnake[0];
        let newHead;

        switch (direction) {
          case "UP":
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case "DOWN":
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case "LEFT":
            newHead = { x: head.x - 1, y: head.y };
            break;
          case "RIGHT":
            newHead = { x: head.x + 1, y: head.y };
            break;
          default:
            newHead = head;
        }

        if (
          newHead.x < 0 ||
          newHead.x >= 25 ||
          newHead.y < 0 ||
          newHead.y >= 25 ||
          newSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(newHead);

        if (newHead.x === food.x && newHead.y === food.y) {
          setFood({
            x: Math.floor(Math.random() * 25),
            y: Math.floor(Math.random() * 25),
          });
          setScore(score + 1);
          setSpeed((speed) => (speed > 50 ? speed - 10 : speed));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    if (!gameOver) {
      const interval = setInterval(moveSnake, speed);
      return () => clearInterval(interval);
    }
  }, [direction, food, gameOver, score, speed]);

  return (
    <div className="container">
      <div className="score">Score: {score}</div>

      <div className="game-board">
        {gameOver && (
          <div className="game-over">
            Game Over
            <button onClick={resetGame}>Restart</button>
          </div>
        )}
        {snake.map((segment, index) => (
          <div
            key={index}
            className="snake-segment"
            style={{ top: `${segment.y * 20}px`, left: `${segment.x * 20}px` }}
          ></div>
        ))}
        <div
          className="food"
          style={{ top: `${food.y * 20}px`, left: `${food.x * 20}px` }}
        ></div>
      </div>
    </div>
  );
};

export default GameBoard;
