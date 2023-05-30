import { useState, useEffect } from "react";
import styled from "styled-components";

const BIRD_SIZE = 30;
const BIRD_LEFT = 50;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 400;
const GRAVYTI = 7;
const JUMP_HEIGHT = 40;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 100;
function App() {
  const [birdPosition, setBirdPosition] = useState(250);
  const [gameStart, setGameStart] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(20);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = useState(-1)
  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;

  useEffect(() => {
    let timeID;
    if (gameStart && birdPosition < GAME_HEIGHT - BIRD_SIZE) {
      timeID = setInterval(() => {
        setBirdPosition((birdPosition) => birdPosition + GRAVYTI);
      }, 90);
    }
    return () => {
      clearInterval(timeID);
    };
  }, [birdPosition, gameStart]);

  useEffect(() => {
    let obstacleID;
    if (gameStart && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleID = setInterval(() => {
        setObstacleLeft((prev) => prev - 4);
      }, 90);
      return () => {
        clearInterval(obstacleID);
      };
    } else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      setObstacleHeight(Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP)));
      setScore(prev => prev + 1)
    }
  }, [gameStart, obstacleLeft]);

  useEffect(() => {
    const hasCollidedWidthTopObstacle = birdPosition >= 0 && birdPosition < obstacleHeight
    const hasCollidedWidthBottomObstacle = birdPosition <= 500 && birdPosition >= 500 - bottomObstacleHeight
    console.log("hasCollidedWidthTopObstacle", hasCollidedWidthTopObstacle)
    console.log("hasCollidedWidthBottomObstacle", hasCollidedWidthBottomObstacle)
    if (obstacleLeft >= 0
      && obstacleLeft <= OBSTACLE_WIDTH
      && (hasCollidedWidthBottomObstacle || hasCollidedWidthTopObstacle)
    ) {
      setGameStart(false)
    }

  }, [birdPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft])

  const handleClick = () => {
    const newPositon = birdPosition - JUMP_HEIGHT;
    if (!gameStart) {
      setGameStart(true);
    } else if (newPositon < 0) {
      setBirdPosition(0);
    } else {
      setBirdPosition(newPositon);
    }
  };
  return (
    <>
      <Div onClick={handleClick}>
        <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
          <Obstacle
            top={0}
            width={OBSTACLE_WIDTH}
            height={obstacleHeight}
            left={obstacleLeft}
          />
          <Obstacle
            top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
            width={OBSTACLE_WIDTH}
            height={bottomObstacleHeight}
            left={obstacleLeft}
          />
          <Bird size={BIRD_SIZE} top={birdPosition} left={BIRD_LEFT} />
          <span>{score}</span>
          <img src="./assets/image/bird.jpg" alt="" />
        </GameBox>
      </Div>
    </>
  );
}

export default App;

const Bird = styled.div`
  position: absolute;
  background-image: url("https://scontent.xx.fbcdn.net/v/t1.15752-9/350660041_7237740529576160_5228392727736440207_n.jpg?stp=dst-jpg_p168x128&_nc_cat=100&ccb=1-7&_nc_sid=aee45a&_nc_ohc=P0i7f7iqsusAX9F_h14&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdSsPqUR0kJIK9ypC3ytRhgbCn62ayRYPP3D0--ZGYDciQ&oe=649D5A6E");
  background-repeat: no-repeat;
  background-size: cover;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
`;

const GameBox = styled.div`
  position: relative;
  background-image: url("https://cdn.sforum.vn/sforum/wp-content/uploads/2022/02/4-27-300x300.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: green;
  overflow: hidden;
`;

const Div = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  & span{
    color:white;
    font-size:20px;
    position: absolute;
    left:50%;
    top:20px;
    transform: translate(-50%, -50%);
  }
`;

const Obstacle = styled.div`
  position: relative;
  top: ${(props) => props.top}px;
  background-color: #8BAF67;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
`;
