import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button'
import './index.css';

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showQuestions : false,
            numberSelections : Array(8).fill( false )
        }
        this.showQuestionsButtonClick = this.showQuestionsButtonClick.bind(this);
    }    

    showQuestionsButtonClick() {
        this.setState({
            showQuestions : true
        });
    }

    toggleChangeNumber = ( index ) => {
        // Fix here
        this.state.numberSelections[index] = !this.state.numberSelections[index];
    } 

    getSelectedNumbers = () => {
        let numberArray = [];
        for ( let i = 0; i < this.state.numberSelections.length; i++ ) {
            if ( this.state.numberSelections[i] ) {
                numberArray.push( i + 2 );
            }
        }
        return numberArray;
    }

    render() {
        if (this.state.showQuestions) {
            return (
                <div className="game">
                    <Question numberSelections={this.getSelectedNumbers()} />
                </div>
            );            
        } else {        
            return (
                <div className="game">
                    Çarpım tablosu Sayılarını Seçiniz:
                    <br/>                    
                    <NumberCheckBox number="2" numberSelected={this.state.numberSelections[0]} toggleNumberSelected={() => this.toggleChangeNumber(0)} />
                    <NumberCheckBox number="3" numberSelected={this.state.numberSelections[1]} toggleNumberSelected={() => this.toggleChangeNumber(1)} />
                    <NumberCheckBox number="4" numberSelected={this.state.numberSelections[2]} toggleNumberSelected={() => this.toggleChangeNumber(2)} />
                    <NumberCheckBox number="5" numberSelected={this.state.numberSelections[3]} toggleNumberSelected={() => this.toggleChangeNumber(3)} />
                    <NumberCheckBox number="6" numberSelected={this.state.numberSelections[4]} toggleNumberSelected={() => this.toggleChangeNumber(4)} />
                    <NumberCheckBox number="7" numberSelected={this.state.numberSelections[5]} toggleNumberSelected={() => this.toggleChangeNumber(5)} />
                    <NumberCheckBox number="8" numberSelected={this.state.numberSelections[6]} toggleNumberSelected={() => this.toggleChangeNumber(6)} />
                    <NumberCheckBox number="9" numberSelected={this.state.numberSelections[7]} toggleNumberSelected={() => this.toggleChangeNumber(7)} />
                    <Button type="submit" onClick={this.showQuestionsButtonClick}>Soruları Hazırla</Button>
                </div>
            );
        }
    }
}

class NumberCheckBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ticked : false
        };
        this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
    } 

    onChangeCheckBox() {
        this.setState({ 
            ticked : !this.state.ticked
        });
        this.props.toggleNumberSelected();
    }

    render() {
        return (
            <div className="numberCheckBox">
                <label className="numberLabel">
                    <input type="checkbox"
                        checked={this.state.ticked}
                        onChange={this.onChangeCheckBox}
                        className="form-check-input"
                    /> {this.props.number}
                </label>
            </div>
        );
    }    
}
  
class Question extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }       

    render() {
        return (
            <div className="game">
                Sorusunun Yanıtı Nedir?
                {this.props.numberSelections.length}
            </div>
        );
    }    
}

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  // https://appdividend.com/2018/09/25/how-to-save-multiple-checkboxes-values-in-react-js/