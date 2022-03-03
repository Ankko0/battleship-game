import React, { Component } from 'react';
import './Stylesheets/App.css';
import BattleGrid from './Components/BattleGrid'
import Button from "./Components/Button";
import "bootstrap/dist/css/bootstrap.min.css"

enum GameStage {
  Initialising,
  Playing,
  Finish
}

enum CellState {
  Empty,
  WithShip,
  SelectedToShot,
  WithDeadShip,
  Miss,

}
interface IState {

  gameStage: GameStage;
  firstPlayerTurn: boolean;
  isBeginOfTurn: boolean;
  isGridVisible:boolean;
  cellToHitCoords?: { i: number, j: number };
  player1Data: {
    field: CellState[][];
    shipsAvailable: number;
    shipsRemain: number;
  };
  player2Data: {
    field: CellState[][];
    shipsAvailable: number;
    shipsRemain: number;
  }
}
const FIELD_SIZE = 5;
const SHIPS_AVAILBLE = 8;


class App extends Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = this.initState();
    this.handleWin = this.handleWin.bind(this);
    this.handleChangeTurn = this.handleChangeTurn.bind(this);
    this.putShip = this.putShip.bind(this);
    this.selectShipToShot = this.selectShipToShot.bind(this);
    this.deleteShip = this.deleteShip.bind(this);
    this.makeShot = this.makeShot.bind(this);

  }

  initState() {
    let state = {
      player1Data : {
        field:  Array<Array<CellState>>(FIELD_SIZE).fill(Array<CellState>(FIELD_SIZE).fill(CellState.Empty)),
        shipsAvailable: SHIPS_AVAILBLE,
        shipsRemain: 0,
      },
      player2Data : {
        field:  Array<Array<CellState>>(FIELD_SIZE).fill(Array<CellState>(FIELD_SIZE).fill(CellState.Empty)),
        shipsAvailable: SHIPS_AVAILBLE,
        shipsRemain: 0,
      },
      gameStage: GameStage.Initialising,
      firstPlayerTurn: true,
      isBeginOfTurn: true,
      isGridVisible:true,
      cellToHitCoords: undefined,

    };
    return(state);
  }


  handleWin() {
    this.setState({gameStage: GameStage.Finish})
  }

  handleChangeTurn() {
    if(!this.state.firstPlayerTurn && this.state.gameStage === GameStage.Initialising) {
      this.setState({firstPlayerTurn: true, gameStage: GameStage.Playing })
      return;
    } 
    this.setState({firstPlayerTurn: !this.state.firstPlayerTurn, isBeginOfTurn: true});
  }

  putShip(i: number, j: number): void {
    let field: CellState[][];
    let playerData =  this.state.firstPlayerTurn ?  { ...this.state.player1Data } : { ...this.state.player2Data };
    if (playerData.shipsAvailable === 0 )
      return;
    field = playerData.field.map(function (arr: CellState[]) {
        return arr.slice();
      });
    
    if (field[i][j] !== CellState.Empty)
      return;
    field[i][j] = CellState.WithShip;

    if (this.state.firstPlayerTurn) {

      this.setState((prevState) =>
      ({
        player1Data: {
          ...prevState.player1Data, field: field,
          shipsAvailable: prevState.player1Data.shipsAvailable - 1,
          shipsRemain: prevState.player1Data.shipsRemain + 1
        }
      }));
    }
    else {
      this.setState((prevState) =>
      ({
        player2Data: {
          ...prevState.player2Data, field: field,
          shipsAvailable: prevState.player2Data.shipsAvailable - 1,
          shipsRemain: prevState.player2Data.shipsRemain + 1
        }
      }));
    }
  }


deleteShip(i: number, j: number) {

  let playerData =  this.state.firstPlayerTurn ?  { ...this.state.player1Data } : { ...this.state.player2Data };

    if (playerData.field[i][j] !== CellState.WithShip)
      return;
    playerData.field[i][j] = CellState.Empty;

    if (this.state.firstPlayerTurn) {

      this.setState((prevState) =>
      ({
        player1Data: {
          ...prevState.player1Data, field: playerData.field,
          shipsAvailable: prevState.player1Data.shipsAvailable + 1,
          shipsRemain: prevState.player1Data.shipsRemain - 1
        }
      }));
    }
    else {
      this.setState((prevState) =>
      ({
        player2Data: {
          ...prevState.player2Data, field: playerData.field,
          shipsAvailable: prevState.player2Data.shipsAvailable + 1,
          shipsRemain: prevState.player2Data.shipsRemain - 1
        }
      }));
    }
  }
  
  selectShipToShot(i: number, j: number) {
    let currentField = this.state.firstPlayerTurn ? this.state.player2Data.field : this.state.player1Data.field;
    let field = currentField.map(function (arr) {
      return arr.slice();
    });

    if (this.state.cellToHitCoords != null && this.state.cellToHitCoords.i === i && this.state.cellToHitCoords.j === j) { //Если выбрана помеченная клетка - снять метку
        this.setState({ cellToHitCoords: undefined });
        return;
    }
    if (this.state.cellToHitCoords != null || field[i][j] === CellState.WithDeadShip || field[i][j] === CellState.Miss) {
        return;
    }

    this.setState({ cellToHitCoords: { i: i, j: j } });

  }

  makeShot() {

    if (this.state.cellToHitCoords == null)
      return;

    var i = this.state.cellToHitCoords.i;
    var j = this.state.cellToHitCoords.j;
    let currentField = this.state.firstPlayerTurn ? this.state.player2Data.field : this.state.player1Data.field;
    var currentCellState = currentField[i][j];
    let field = currentField.map(function (arr) {
      return arr.slice();
    });


    if (currentCellState === CellState.WithShip) {
      field[i][j] = CellState.WithDeadShip;
      let shipsRemain = this.state.firstPlayerTurn ? this.state.player2Data.shipsRemain - 1 : this.state.player1Data.shipsRemain - 1 ;
      this.handleHit(field);
      if (shipsRemain === 0 ) {
        this.handleWin();
      }
      return;
    }
    if (currentCellState === CellState.Empty) {
      field[i][j] = CellState.Miss;
      this.handleMiss(field);
      this.handleChangeTurn();
    }

  }

  handleHit(field: CellState[][]) {
    if (this.state.firstPlayerTurn) {
      this.setState((prevState) => ({
        player2Data: {
          ...prevState.player2Data,
          field: field,
          shipsRemain: prevState.player2Data.shipsRemain - 1
        },
        cellToHitCoords: undefined
      }));
    }
    else {
      this.setState((prevState) => ({
        player1Data: {
          ...prevState.player1Data,
          field: field,
          shipsRemain: prevState.player1Data.shipsRemain - 1
        },
        cellToHitCoords: undefined
      }));
    }
    alert("Есть пробитие!");
  }

  handleMiss(field: CellState[][]) {
    if (this.state.firstPlayerTurn)
      this.setState((prevState) => ({
        player2Data: {
          ...prevState.player2Data, field: field,
        },
        cellToHitCoords: undefined
      }));
    else
      this.setState((prevState) => ({
        player1Data: {
          ...prevState.player1Data, field: field,
        },
        cellToHitCoords: undefined
      }));
      alert("Мимо !");
  }

  render(): React.ReactNode {

    let isGridVisible = true;

    if (this.state.gameStage === GameStage.Playing && this.state.isBeginOfTurn) {
      isGridVisible = false;
    }
    let gameStage = "";
    let handleClickFunction = this.state.gameStage === GameStage.Initialising ? this.putShip : this.selectShipToShot;
    let handleDoubleClick = this.state.gameStage === GameStage.Initialising ? this.deleteShip : undefined;
    let buttonText = this.state.gameStage === GameStage.Initialising ? "Закончить" : "Выстрел";
    let buttonAction = this.state.gameStage === GameStage.Initialising ? this.handleChangeTurn : this.makeShot;
    switch(this.state.gameStage){
      case GameStage.Initialising:
        gameStage = "Начало игры. Расстановка кораблей";
        break;
      case GameStage.Playing:
        gameStage = "Игра";
        break;
      case GameStage.Finish:
        gameStage = `Победа игрока ${this.state.firstPlayerTurn ? "1" : "2"}` ;
        break; 
    }

    return (
      <div className="App">

        <Button
        isDisabled={false}
        isHidden={false}
        hadleClick={() => this.setState(this.initState())}
        buttonText={"Начать новую игру"}  
        />
        <h2>{gameStage}</h2>
        <h2 hidden={this.state.gameStage === GameStage.Finish}>Ход игрока {this.state.firstPlayerTurn ? 1 : 2}</h2>

        <BattleGrid
          player={1}
          isGridVisible={isGridVisible}
          gameStage={this.state.gameStage}
          isFirstPlayerTurn={this.state.firstPlayerTurn}
          field = {this.state.player1Data.field}
          cellToHitCoords = {this.state.cellToHitCoords}
          handleClick={handleClickFunction}
          handleDoubleClick = {handleDoubleClick}
          />

        <BattleGrid
         player={2}
         isGridVisible={isGridVisible}
         gameStage={this.state.gameStage}
         isFirstPlayerTurn={this.state.firstPlayerTurn}
         field = {this.state.player2Data.field}
         cellToHitCoords = {this.state.cellToHitCoords}
         handleClick={handleClickFunction}
         handleDoubleClick = {handleDoubleClick}
         />
          
        <Button 
        hadleClick ={() => { this.setState({ isBeginOfTurn: false }) }} 
        isHidden={!this.state.isBeginOfTurn || this.state.gameStage !== GameStage.Playing} 
        buttonText = {"Начать ход"}
        isDisabled ={false}
        />
        
        <Button
        isDisabled={this.state.gameStage === GameStage.Playing && !this.state.cellToHitCoords ? true : false}
        isHidden={(this.state.isBeginOfTurn && this.state.gameStage === GameStage.Playing) || this.state.gameStage === GameStage.Finish  }
        hadleClick={() => buttonAction()}
        buttonText={buttonText}
        />
      </div>);

  }
}

export default App;
