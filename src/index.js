import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button'
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

class MultiplicationGame extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showQuestions : false,
            questioncount : 5,
            numberSelections : Array(8).fill( false ),
            minute : 0,
            second : 0
        }
        this.showQuestionsButtonClick = this.showQuestionsButtonClick.bind(this);
        this.onQuestionCountChanged = this.onQuestionCountChanged.bind(this);
        this.renderRadioButton = this.renderRadioButton.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
    }    

    componentDidMount() {
        this.myInterval = setInterval( () => {
            const { second, minute } = this.state

            this.setState({
                second : second + 1
            });

            if (second === 59) {
                this.setState({
                    second : 0,
                    minute : minute + 1
                });    
            }
        }, 1000)
    }

    stopTimer() {
        clearInterval(this.myInterval)
    }

    showQuestionsButtonClick() {

        if ( this.state.numberSelections.filter(x => x).length === 0 ) {
            alert('Lütfen çarpım tablosundan en az bir sayı seçiniz!');
            return;
        }
        
        this.setState({
            showQuestions : true,
            second : 0,
            minute : 0
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

    onQuestionCountChanged(e) {
        this.setState({
            questioncount : e.currentTarget.value
        });
    }

    createCheckBoxes = () => {
        let table = []
    
        for (let i = 0; i < 8; i++) {
            table.push( <NumberCheckBox number={i + 2} numberSelected={this.state.numberSelections[i]} toggleNumberSelected={() => this.toggleChangeNumber(i)} /> )
        }

        return table;
    }

    toggleGameCompleted = () => {
        this.stopTimer();
    }     

    renderRadioButton(number) {
        return (
            <label class='radio-inline giveSpace'>
                <input  type='radio' value={number} checked={this.state.questioncount == number} onChange={this.onQuestionCountChanged} /> {number}
            </label>
        );
    }
 
    render() {
        const { second, minute } = this.state

        if (this.state.showQuestions) {
            return (
                <div className="questionspage">
                    <div>
                        <label class="timerText">Geçen Süre: {minute < 10 ? `0${minute}` : minute}:{second < 10 ? `0${second}` : second}</label>
                    </div>
                    <div class="col-md-7">
                        <label class="questionsTitle">Sorular</label>
                    </div>    
                    <Questions numberSelections={this.getSelectedNumbers()} questioncount={this.state.questioncount} callbackFromParent={this.toggleGameCompleted}/>                                                            
                </div>
            );            
        } else {        
            return (
                <div class="questionspage">
                    <label class="title">Çarpım Tablosu Sayıları:</label>
                    <br/>
                    {this.createCheckBoxes()}
                    <br/>
                    <label class="title">Soru Sayısı:</label>
                    <br/>
                    {this.renderRadioButton(3)}
                    {this.renderRadioButton(5)}
                    {this.renderRadioButton(10)}
                    <br/><br/>
                    <Button type="submit" class="btn btn-primary" onClick={this.showQuestionsButtonClick}>Soruları Hazırla</Button>
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
        const idValue = 'inlineCheckbox' + this.props.number;
        const checkBoxValue = 'option' + this.props.number;

        return (
            <label class="checkbox-inline giveSpace">
                <input type="checkbox" id={idValue} value={checkBoxValue} checked={this.state.ticked} onChange={this.onChangeCheckBox} /> {this.props.number}
            </label> 
        );
    }    
}

class Questions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAnswers : 0,
            numbers : this.generateNumberValues()
        }
        this.checkAnswersButtonClick = this.checkAnswersButtonClick.bind(this);
    }       

    generateNumberValues = () => {
        
        let numbersArray = [];

        for (let i = 0; i < this.props.questioncount; i++) {
            numbersArray.push( [] );
        }

        let currentIndex = 0

        while ( currentIndex < this.props.questioncount ) {

            let numberValue = this.props.numberSelections[Math.floor(Math.random() * this.props.numberSelections.length)];
            let secondNumberValue = Math.floor(Math.random() * 10) + 1

            // Avoid duplication
            if ( !numbersArray.filter( a => ( a[0] === numberValue && a[1] === secondNumberValue ) || 
                                            ( a[1] === numberValue && a[0] === secondNumberValue ) ).length ) {
                numbersArray[currentIndex].push( numberValue );
                numbersArray[currentIndex++].push( secondNumberValue );                                                     
            }
        }     

        return numbersArray;
    }    

    createTable = () => {
        let table = []
    
        // Outer loop to create parent
        for (let i = 0; i < this.props.questioncount; i++) {
          table.push( <Question number={this.state.numbers[i][0]} secondNumber={this.state.numbers[i][1]} showanswer={this.state.showAnswers} numberindex={i+1} /> )
          table.push( <br/> )
        }
        return table
    }

    checkAnswersButtonClick() {
        this.setState({
            showAnswers : 1
        });
        this.props.callbackFromParent();
    }

    render() {
        return (
            <div className="game">
                {this.createTable()}
                <div class="row">
                    <div class="col-md-4">
                        <Button type="submit" onClick={this.checkAnswersButtonClick}>Yanıtları Kontrol</Button>
                    </div>
                    <div class="col-md-4">
                        <Button onClick={() => window.location.reload(false)}>Tekrar Oyna</Button>
                    </div>
                </div>                
            </div>
        );
    }    
}

class Question extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numberInputValue : ''                       
        }
    }       

    showResult = () => {
        if ( this.props.showanswer === 1 ) {
            let resultText = '';
            let labelClass = 'answerWarning';
           
            if (this.state.numberInputValue === '') {
                resultText = 'Lütfen bir değer giriniz'
            } else if ( isNaN(this.state.numberInputValue) ) {
                resultText = 'Lütfen bir numarasal bir değer giriniz'
            } else if ( parseInt(this.props.number) * parseInt(this.props.secondNumber) === parseInt(this.state.numberInputValue) ) {
                resultText = 'Doğru'
                labelClass = 'answerTrue';
            } else {
                resultText = 'Yanlış'
                labelClass = 'answerFalse';
            }

            return ( <label class={labelClass}>{resultText}</label>);
        }
    }

    updateInputValue(evt) {
        this.setState({
            numberInputValue: evt.target.value
        });
    }    

    render() {
        const inputidval = 'inputtext' + this.props.numberindex;

        return (
            <div class="row">
                <div class="col-md-3 centered">
                    <label class="questiontitle">{this.props.numberindex})</label>
                    <label class="control-label" for={inputidval}>{this.props.number} X {this.props.secondNumber} sorusunun yanıtı nedir?</label>
                </div>
                <div class="col-md-1">
                    <input type="text" class="form-control" value={this.state.numberInputValue} onChange={evt => this.updateInputValue(evt)} id={inputidval}/>
                </div>
                <div class="col-md-4">
                    {this.showResult()}
                </div>                                    
            </div>
        );
    }    
}

  // ========================================
  
  ReactDOM.render(
    <MultiplicationGame />,
    document.getElementById('root')
  );
