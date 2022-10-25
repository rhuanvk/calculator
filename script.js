// Calculator output
const previousDisplay = document.querySelector('[data-previousOperand]');
const currentDisplay = document.querySelector('[data-currentOperand]');

// Calculator keyboard
const numbers = document.querySelectorAll('[data-number]');
const operators = document.querySelectorAll('[data-operator]');

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

  updateDisplay() {
    this.previousDisplay.innerText = `${this.formatDisplay(this.previousOperand)} ${this.operation || ''}`;
    this.currentDisplay.innerText = this.formatDisplay(this.currentOperand);
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

  outputNumber(number) {
    if (this.currentOperand.includes('.') && number === '.') return;

    this.currentOperand = `${this.currentOperand}${number.toString()}`;
  }

  clear() {
    this.previousOperand = '';
    this.currentOperand = '';
    this.operation = undefined;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }
}

const calculator = new Calculator(
  previousDisplay,
  currentDisplay
);

for (const number of numbers) {
  number.addEventListener('click', () => {
    calculator.outputNumber(number.innerText);
    calculator.updateDisplay();
  });
}

for (const operator of operators) {
  operator.addEventListener('click', () => {
    calculator.chooseOperation(operator.innerText);
    calculator.updateDisplay();
  });
}

clearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

equalsButton.addEventListener('click', () => {
  calculator.calculate();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});