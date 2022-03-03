import React, {Component} from "react";
import "../Stylesheets/Button.css";


interface IProps {
    hadleClick: Function;
    buttonText: string;
    isDisabled: boolean;
    isHidden: boolean;
}

class Button extends Component<IProps>{

    render() : React.ReactNode {
        return <div className='Button' >
            <button
            type="button" 
            className="btn btn-outline-dark"
            disabled={this.props.isDisabled} 
            hidden={this.props.isHidden}
            onClick={() => this.props.hadleClick()}>
                 {this.props.buttonText} 
            </button>
        </div>

    }
}
export default Button