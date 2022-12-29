// Calculator output
const previousDisplay = document.querySelector('[data-previousOperand]');
const currentDisplay = document.querySelector('[data-currentOperand]');

// Calculator numbers and operators
const numbers = document.querySelectorAll('[data-number]');
const operators = document.querySelectorAll('[data-operator]');

// Calculator functional buttons
const equalsButton = document.querySelector('[data-equals]');
const clearButton = document.querySelector('[data-clear]');
const deleteButton = document.querySelector('[data-delete]');

class Calculator {
  constructor(previousDisplay, currentDisplay) {
    this.previousDisplay = previousDisplay;
    this.currentDisplay = currentDisplay;
    this.clear();
  }

  calculate() {
    let result;
    const previousOperandFloat = parseFloat(this.previousOperand);
    const currentOperandFloat = parseFloat(this.currentOperand);

    if (isNaN(previousOperandFloat) || isNaN(currentOperandFloat)) return;

    switch (this.operation) {
      case '+':
        result = previousOperandFloat + currentOperandFloat;
        break;
      case '-':
        result = previousOperandFloat - currentOperandFloat;
        break;
      case 'x':
        result = previousOperandFloat * currentOperandFloat;
        break;
      case '/':
        result = previousOperandFloat / currentOperandFloat;
        break;
      default:
        return;
    }

    this.operation = undefined;
    this.previousOperand = '';
    this.currentOperand = result;
  }

  formatDisplay(number) {
    const stringNumber = number.toString();

    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];

    let integerDisplay;

    if (isNaN(integerDigits)) {
      integerDisplay = '';
    }
    else {
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    }
    else {
      return integerDisplay;
    }
  }

  outputNumber(number) {
    if (this.currentOperand.toString().includes('.') && number === '.') return;
    // Clear display if the number showing is the result
    if (this.result != '' && this.currentDisplay.classList.contains('result')) {
      this.currentOperand = '';
      this.currentDisplay.classList.remove('result');
    }

    this.currentOperand = `${this.currentOperand}${number.toString()}`;
  }

  chooseOperation(operator) {
    if (this.currentOperand == '') return;
    if (this.previousOperand !== '') {
      this.calculate();
    }

    this.operation = operator;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  updateDisplay() {
    this.previousDisplay.innerText = `${this.formatDisplay(this.previousOperand)} ${this.operation || ''}`;
    this.currentDisplay.innerText = this.formatDisplay(this.currentOperand);
  }

  clear() {
    this.previousOperand = '';
    this.currentOperand = '';
    this.operation = undefined;
    this.result = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }
}

const calculator = new Calculator(previousDisplay, currentDisplay);

// When a number is pressed, it goes to the display
for (const number of numbers) {
  number.addEventListener('click', () => {
    calculator.outputNumber(number.innerText);
    calculator.updateDisplay();
  });
}

// When an operator is pressed the value informed before goes upside
for (const operator of operators) {
  operator.addEventListener('click', () => {
    calculator.chooseOperation(operator.innerText);
    calculator.updateDisplay();
  });
}

// Make the "AC" button clear the display
clearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

// Make the "=" button calculate and show the result
equalsButton.addEventListener('click', () => {
  calculator.calculate();
  calculator.updateDisplay();
  calculator.currentDisplay.classList.add('result');
});


// Make the "DEL" button erase the last number
deleteButton.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});