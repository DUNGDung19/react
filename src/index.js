import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

function NumberButton (props) {
	let nameBtn;
	if(props.value === '=' || props.value === 'C' || props.value === 'AC'){
		nameBtn = 'equal';
	}
	if(props.value === '+' || props.value === '-' || props.value === '*' || props.value === '/'){
		nameBtn = 'operator';
	}
    return (
		<input type="button" onClick={props.onClick} name={nameBtn} value={props.value}/>
    );
}

function Output (props){
	return (
		<input type="text" value={props.value} onChange={props.onChange} />
	);
}

function CheckPoint(cal, number){
	const point = ['+', '-', '*', '/'];
	const firstBtn = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-'];
	// Dấu trừ đầu tiên
	if(!firstBtn.includes(cal[0])){
		cal = cal.substr(0, cal.length-1);	
	}else{
		if(cal[0] === '-'){
			if (point.includes(cal[1])) {
				cal = cal.substr(0, cal.length-1);
			}
		}
		
	}
	// Dấu trừ sau dấu cộng trừ
	if(point.slice(0, 2).includes(cal[cal.length-2])){
		if(point.includes(cal[cal.length-1])){ 
			cal = cal.substr(0, cal.length-2);
			cal = cal.concat(number);
		}
	}
	// Dấu trừ sau dấu nhân chia
	if(point.slice(2, 4).includes(cal[cal.length-2])){
		if(!firstBtn.includes(cal[cal.length-1])){
			cal = cal.substr(0, cal.length-2);
			cal = cal.concat(number);
		}
	}
	return cal;
}

function CheckDot(cal){
	let s= cal.replace(/[+*/-]/g, ',');
	s = s.replace(/[0-9]/g, '');
	for(let i=0; i< s.length; i++){
		if(s[i] === '.' && s[i]===s[i+1]){
			return true;
		}
	}
	return false;
}

function DeleteCal(cal){
	return cal.substr(0, cal.length-1);
}

function EqualAction(cal){
	let opCal = cal.match(/([0-9.]+)|\*-|\/-|\+|-|\*|\//g);
	if(opCal[0] === '-'){
		opCal = opCal.slice(1, cal.length);
		opCal[0] *=-1;
	}
	
	let i = -1;
	// multiplications/divide
	while(i++ < opCal.length - 1){
		if(opCal[i] === '/-'){
			opCal = DoMatch(i, opCal);
			i--;
		}
		
		
		if(opCal[i] === '*-'){
			opCal = DoMatch(i, opCal);
			i--;
		}
		
		if(opCal[i] === '*'){
			opCal = DoMatch(i, opCal);
			i--;
		}
	
		if(opCal[i] === '/'){
			opCal = DoMatch(i, opCal);
			i--;
		}
	}
	
	// sum/substract
	i = -1;
	while(i++ < opCal.length - 1){
		if(opCal[i] === '+'){
			opCal = DoMatch(i, opCal);
			i--;
		}

		if(opCal[i] === '-'){
			opCal = DoMatch(i, opCal);
			i--;
		}
	}
	
	return (opCal[0] !== Infinity && !isNaN(opCal[0]))? parseFloat(opCal[0]): opCal[0].toString();
}

function DoMatch(op, cal){
	const num1 = op-1;
	const num2 = op+1;
	switch(cal[op]){
		case '*-':
			cal[num1] = cal[num1] * cal[num2] * -1;
			break;
		case '/-':
			cal[num1] = cal[num1] / cal[num2] * -1;
			break;
		case '*':
			cal[num1] = cal[num1] * cal[num2];
			break;
		case '/':
			cal[num1] = cal[num1] / cal[num2];
			break;
		case '+':
			cal[num1] = parseFloat(cal[num1]) + parseFloat(cal[num2]);
			break;
		case '-':
			cal[num1] = cal[num1] - cal[num2];
			break;
		default:
			break;
	}
	cal[op] = false;
	cal[num2] = false;
	return CreateNewArray(cal);
}

function CreateNewArray(array){
	const newArray = [];
	let k = -1;
	while(++k < array.length){
		if(array[k] !== false) newArray.push(array[k]);
	}
	return newArray;
}

class Board extends React.Component {
	
	renderBtn(i) {
		return (
			<NumberButton
			onClick={() => this.props.onClick(i)}
			value={i}
			/>
		);
	}
	
	render() {
		return (
			<table>
			<tbody>
			<tr>
                <td colSpan="4">
					<Output value={this.props.value} onChange={this.props.onChange}/>
					<Output value={this.props.total} onChange={this.props.onChange}/>
				 </td>
            </tr>
			 <tr>
                <td>
					{this.renderBtn('+')}
				</td>
                <td>
					{this.renderBtn('-')}
				</td>
                <td>
					{this.renderBtn('*')}
				</td>
                <td>
					{this.renderBtn('/')}
				</td>
			</tr>
            <tr>
                <td>
					{this.renderBtn(7)}
				</td>
                <td>
					{this.renderBtn(8)}
				</td>
                <td>
					{this.renderBtn(9)}
				</td>
				<td rowSpan="3">
					{this.renderBtn('=')}
				</td>
			</tr>
			<tr>
                <td>
					{this.renderBtn(4)}
				</td>
                <td>
					{this.renderBtn(5)}
				</td>
                <td>
					{this.renderBtn(6)}
				</td>
			</tr>
			<tr>
				<td>
					{this.renderBtn(1)}
				</td>
                <td>
					{this.renderBtn(2)}
				</td>
                <td>
					{this.renderBtn(3)}
				</td>
			</tr>
			<tr>
				<td>
					{this.renderBtn(0)}
				</td>
                <td>
					{this.renderBtn('.')}
				</td>
                <td>
					{this.renderBtn('C')}
				</td>
				<td>
					{this.renderBtn('AC')}
				</td>
			</tr>
			</tbody>
		</table>
		);
	}
}

class Calculator extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			value: '',
			total: 0,
			memory: '',
		};
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleClick(i){
		let cal = this.state.value;
		let memory = this.state.memory;
		let total = 0;
		
		// Nút C
		if(i === 'AC'){
			cal = '';
			memory = '';
		}
		else if(i === 'C'){
			if(cal.length === 1){
				memory ='';
			}
			cal = DeleteCal(cal);
		}
		else if(i === '='){
			total = EqualAction(cal);
			memory = EqualAction(cal);
		}else{
			if(memory === Infinity || isNaN(memory)){
				memory = '';
				cal='';
			}

			if(memory !== ''){
				cal=memory;
				memory = '';
			}
			cal+=i.toString();
			cal = CheckPoint(cal, i);
			// Kiểm tra dấu "."
			if(CheckDot(cal)){
				cal = cal.substr(0, cal.length-1);
			}
		}
	
		this.setState({value: cal, total: total, memory: memory});
	}
	
	handleChange(e){
		if(!e.target.value.match(/([\D]+)/g)){
			this.setState({value: e.target.value});
		}
	}
		
	
  render() {
    return (
		<Board onClick={(i) => this.handleClick(i)} onChange={this.handleChange} value={this.state.value} total={this.state.total}/>
    );
  }
}

// ========================================

ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
