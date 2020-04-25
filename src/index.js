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
            second : 0,
            blankAnswerCount : 0,
            correctAnswerCount : 0,
            wrongAnswerCount : 0,
            gameCompleted : false
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

    toggleGameCompleted = (numbers) => {
        
        let counterFunc = (val) => { return numbers.filter(a => a[2] === val).length; }

        this.stopTimer();
        this.setState({
            blankAnswerCount : counterFunc(0),
            correctAnswerCount : counterFunc(1),
            wrongAnswerCount : counterFunc(2),
            gameCompleted : true
        });
    }     

    renderRadioButton(number) {        
        return (
            <label class='radio-inline giveSpace'>
                <input  type='radio' value={number} checked={this.state.questioncount == number} onChange={this.onQuestionCountChanged} /> {number}
            </label>
        );
    }
 
    renderGameResults = () => {
        if (this.state.gameCompleted) {
            let completedMin = 60 * this.state.minute + this.state.second;

            return(
                <div class="resultTable">
                    <div class="row">
                        <div class="col-md-2">
                            <label class="answerTrue">Doğru Sayısı:</label>
                        </div>
                        <div class="col-md-1">
                            <label class="answerTrue">{this.state.correctAnswerCount}</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-2">
                            <label class="answerFalse">Yanlış Sayısı:</label>
                        </div>
                        <div class="col-md-1">
                            <label class="answerFalse">{this.state.wrongAnswerCount}</label>                            
                        </div>
                    </div>   
                    <div class="row">
                        <div class="col-md-2">
                            <label class="answerWarning">Boş/Geçersiz Sayısı:</label>
                        </div>
                        <div class="col-md-1">
                            <label class="answerWarning">{this.state.blankAnswerCount}</label>                            
                        </div>
                    </div>   
                    <div class="row">
                        <div class="col-md-2">
                            Bitirme Süresi:
                        </div>
                        <div class="col-md-2">
                            {completedMin} saniye
                        </div>
                    </div>                                                                              
                </div>
            );
        }
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
                    {this.renderGameResults()}
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
            showCorrectAnswer : 0,
            numbers : this.generateNumberValues()
        }
        this.checkAnswersButtonClick = this.checkAnswersButtonClick.bind(this);
        this.checkShowCorrectAnswers = this.checkShowCorrectAnswers.bind(this);
    }       

    /*  numbers is a matrix for each question. The zero index refers to the generated number value from the user selections
        1th index refers to the randamly generated value between 1 to 10
        2th index refers to the answer status of the question: 0: blank or invalid, 1: correct, 2: wrong
    */
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
                numbersArray[currentIndex].push( secondNumberValue );                                                     
                numbersArray[currentIndex++].push( 0 );
            }
        }     

        return numbersArray;
    }    

    componentDidMount() {
        document.getElementById("inputtext1").focus();
    }

    changeQuestionInputValue(index, answerStatus) {
        this.state.numbers[index][2] = answerStatus;
    }

    createTable = () => {
        let table = []
    
        // Outer loop to create parent
        for (let i = 0; i < this.props.questioncount; i++) {
          table.push( <Question number={this.state.numbers[i][0]} 
                                secondNumber={this.state.numbers[i][1]} 
                                showanswer={this.state.showAnswers}
                                showcorrectanswer={this.state.showCorrectAnswer}
                                numberindex={i+1}
                                changeInputValue={this.changeQuestionInputValue.bind(this)}/> )
          table.push( <br/> )
        }
        return table
    }

    checkAnswersButtonClick() {
        this.setState({
            showAnswers : 1
        });
        document.getElementById("checkResultBtn").disabled = true;
        this.props.callbackFromParent(this.state.numbers);
    }

    checkShowCorrectAnswers() {
        this.setState({
            showCorrectAnswer : this.state.showCorrectAnswer === 0 ? 1 : 0
        });
    }

    showCheckBox = () => {
        // Show the checkbox if the game is completed and there is some incorrect or blank answers
        if ( this.state.showAnswers === 1 && this.state.numbers.filter(a => a[2] === 1).length !== this.props.questioncount ) {
            return( <div class="showAnswersCheckBox">Doğru Yanıtları Göster : <input type="checkbox" checked={this.state.showCorrectAnswer} onChange={this.checkShowCorrectAnswers} /></div> );
        }
    }

    render() {
        return (
            <div className="game">
                {this.createTable()}
                <div class="row">
                    <div class="col-md-3">
                        <Button id="checkResultBtn" type="submit" onClick={this.checkAnswersButtonClick}>Yanıtları Kontrol</Button>
                    </div>
                    <div class="col-md-3">
                        {this.showCheckBox()}
                    </div>
                    <div class="col-md-3">
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
            numberInputValue : '',
            // 0: blank or invalid, 1: correct, 2: wrong
            answerStatus : 0,
            resultText : 'Lütfen bir değer giriniz',
            answerlabelClass : 'answerWarning',
            correctAnswer : parseInt(this.props.number) * parseInt(this.props.secondNumber)                         
        }
    }       

    showResult = () => {
        if ( this.props.showanswer === 1 ) {
            return ( <label class={this.state.answerlabelClass}>{this.state.resultText}</label>);
        }
    }

    showCorrectAnswer = () => {
        if ( this.props.showcorrectanswer === 1 && this.state.answerStatus !== 1 ) {
            return ( <label class="answerTrue">Doğru Yanıt : {this.state.correctAnswer}</label>);
        }        
    }



    updateInputValue(evt) {
        let inputValue = evt.target.value
        let resultTextValue = 'Lütfen bir değer giriniz'
        let answerStatusValue = 0
        let answerlabelClassValue = 'answerWarning'

        if (inputValue === '') {
            resultTextValue = 'Lütfen bir değer giriniz'
        } else if ( isNaN(inputValue) ) {
            resultTextValue = 'Lütfen numarasal bir değer giriniz'
        } else if ( this.state.correctAnswer === parseInt(inputValue) ) {
            resultTextValue = 'Doğru'
            answerStatusValue = 1
            answerlabelClassValue = 'answerTrue'
        } else {
            resultTextValue = 'Yanlış'
            answerStatusValue = 2
            answerlabelClassValue = 'answerFalse'
        }        

        this.setState({
            numberInputValue: inputValue,
            answerStatus : answerStatusValue,
            resultText : resultTextValue,
            answerlabelClass : answerlabelClassValue
        });

        // Change value in the parent component
        this.props.changeInputValue(this.props.numberindex - 1, answerStatusValue);
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
                <div class="col-md-3">
                    {this.showResult()}
                </div>
                <div class="col-md-2">
                    {this.showCorrectAnswer()}
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
