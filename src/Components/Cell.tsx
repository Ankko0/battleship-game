import React, { MouseEventHandler } from "react";
import "../Stylesheets/Cell.css"

enum CellState {
    Empty,
    WithShip,
    SelectedToShot,
    WithDeadShip,
    Miss
}

interface CellProps {
    handleClick: MouseEventHandler,
    handleDoubleClick?: MouseEventHandler,
    cellState: CellState 
}

class Cell extends React.Component<CellProps, {}> {

    render(): React.ReactNode {
        switch (this.props.cellState) {
            case CellState.Empty:
                return (<div className="EmptyCell" onClick={this.props.handleClick}></div>)
            case CellState.WithShip:
                return (<div className="CellWithShip" onDoubleClick={this.props.handleDoubleClick}></div>)
            case CellState.SelectedToShot:
                return (<div className="SelectedToShot" onClick={this.props.handleClick}></div>)
            case CellState.WithDeadShip:
                return (<div className="WithDeadShip" onClick={this.props.handleClick}></div>)
            case CellState.Miss:
                return (<div className="Miss" onClick={this.props.handleClick}></div>)
            default:
                return null;
        }
    }

}
export default Cell;