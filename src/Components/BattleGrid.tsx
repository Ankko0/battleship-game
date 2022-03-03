import React, { Component } from "react";
import Cell from "./Cell";
import "../Stylesheets/BattleGrid.css"

enum CellState {
    Empty,
    WithShip,
    SelectedToShot,
    WithDeadShip,
    Miss,

}


interface IProps {

    player: number;
    gameStage: any;
    isFirstPlayerTurn: any;
    isGridVisible: boolean;
    field: CellState[][];
    handleClick: Function;
    handleDoubleClick?: Function;
    cellToHitCoords?: { i: number, j: number };

}

class BattleGrid extends Component<IProps, any> {

    getStartField() {
        
        let cells = [];
        let fieldSize = this.props.field.length;
        for (let i = 0; i < fieldSize; i++) {
            let columns = [];
            for (let j = 0; j < fieldSize; j++) {
                columns[j] = <Cell key={j}
                    cellState={this.props.field[i][j]}
                    handleClick={() => { this.props.handleClick(i, j); }}
                    handleDoubleClick={() => this.props?.handleDoubleClick?.(i, j)} />
            }
            cells[i] = <div key={i} className="Row">{[...columns]}</div>
        }
        return cells;
    }

    getHomeField() {

        let cells = [];
        let fieldSize = this.props.field.length;
        for (let i = 0; i < fieldSize; i++) {
            let columns = [];
            for (let j = 0; j < fieldSize; j++) {
                columns[j] = <Cell key={j}
                    cellState={this.props.field[i][j]}
                    handleClick={() => { }}
                    handleDoubleClick={() => { }} />
            }
            cells[i] = <div key={i} className="Row">{[...columns]}</div>
        }
        return cells;
    }

    getEnemyField() {
        let cells = [];
        let fieldSize = this.props.field.length;
        for (let i = 0; i < fieldSize; i++) {
            let columns = [];
            for (let j = 0; j < fieldSize; j++) {
                let displayedCellState = this.props.field[i][j];
                if (this.props.field[i][j] === CellState.WithShip)
                    displayedCellState = CellState.Empty;
                if (this.props.cellToHitCoords && this.props.cellToHitCoords?.i === i && this.props.cellToHitCoords?.j === j)
                    displayedCellState = CellState.SelectedToShot;

                columns[j] = <Cell key={j}
                    cellState={displayedCellState}
                    handleClick={() => { this.props.handleClick(i, j) }}
                    handleDoubleClick={() => { }} />
            }
            cells[i] = <div key={i} className="Row">{[...columns]}</div>
        }
        return cells;

    }


    render(): React.ReactNode {

        if (this.props.gameStage === 0)

            return (this.props.player === 1 && this.props.isFirstPlayerTurn) || (this.props.player === 2 && !this.props.isFirstPlayerTurn) ?
                <div className='Battle-grid'>
                    {this.getStartField()}
                </div> : null;

        if (this.props.gameStage === 1) {

            if (!this.props.isGridVisible)
                return null;
            if ((this.props.player === 1 && this.props.isFirstPlayerTurn) || (this.props.player === 2 && !this.props.isFirstPlayerTurn)) {
                return (
                    <div className='Battle-grid'>
                        <h3>Свое поле</h3>
                        {this.getHomeField()}
                    </div>);

            }

            if ((this.props.player === 1 && !this.props.isFirstPlayerTurn) || (this.props.player === 2 && this.props.isFirstPlayerTurn)) {
                return (
                    <div className='Battle-grid'>
                        <h3>Поле противника</h3>
                        {this.getEnemyField()}
                    </div>);

            }
        }

        if (this.props.gameStage === 2) {
            return (
                <div className='Battle-grid'>
                    {this.getHomeField()}
                </div>);

        }
    }

}

export default BattleGrid;