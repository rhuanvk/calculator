// Calculator output
const previousDisplay = document.querySelector("[data-previousOperand]");
const currentDisplay = document.querySelector("[data-currentOperand]");
const errorDisplay = document.querySelector("[data-error]");

// Calculator numbers and operators
const numbers = document.querySelectorAll("[data-number]");
const operators = document.querySelectorAll("[data-operator]");

// Calculator functional buttons
const equalsButton = document.querySelector("[data-equals]");
const clearButton = document.querySelector("[data-clear]");
const deleteButton = document.querySelector("[data-delete]");

const add = (num1, num2) => num1 + num2;
const subtract = (num1, num2) => num1 - num2;
const multiply = (num1, num2) => num1 * num2;
const divide = (num1, num2) =>
    num1 === 0
        ? (errorDisplay.innerHTML = "[ERROR] Cannot divide by zero")
        : num1 / num2;

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
        console.log(previousOperandFloat);
        console.log(currentOperandFloat);

        if (isNaN(previousOperandFloat) || isNaN(currentOperandFloat)) return;

        switch (this.operation) {
            case "+":
                result = add(previousOperandFloat, currentOperandFloat);
                break;
            case "-":
                result = subtract(previousOperandFloat, currentOperandFloat);
                break;
            case "*":
                result = multiply(previousOperandFloat, currentOperandFloat);
                break;
            case "/":
                result = divide(previousOperandFloat, currentOperandFloat);
                console.log(result);
                break;
            default:
                return;
        }

        this.operation = undefined;
        this.previousOperand = "";
        this.currentOperand = result;
    }

    formatDisplay(number) {
        const stringNumber = number.toString();

        const integerDigits = parseFloat(stringNumber.split(".")[0]);
        const decimalDigits = stringNumber.split(".")[1];

        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = "";
        } else {
            integerDisplay = integerDigits.toLocaleString("en", {
                maximumFractionDigits: 0,
            });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    outputNumber(number) {
        if (this.currentOperand.toString().includes(".") && number === ".")
            return;
        // Clear display if the number showing is the result
        if (
            this.result != "" &&
            this.currentDisplay.classList.contains("result")
        ) {
            this.currentOperand = "";
            this.currentDisplay.classList.remove("result");
        }

        this.currentOperand = `${this.currentOperand}${number.toString()}`;
    }

    chooseOperation(operator) {
        if (this.currentOperand == "") return;
        if (this.previousOperand !== "") {
            this.calculate();
        }

        this.operation = operator;
        this.previousOperand = this.currentOperand;
        this.currentOperand = "";
    }

    updateDisplay() {
        this.previousDisplay.innerText = `${this.formatDisplay(
            this.previousOperand
        )} ${this.operation || ""}`;
        this.currentDisplay.innerText = this.formatDisplay(this.currentOperand);
    }

    clear() {
        this.previousOperand = "";
        this.currentOperand = "0";
        this.operation = undefined;
        this.result = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    clearError() {
        errorDisplay.innerHTML = "";
    }
}

const calculator = new Calculator(previousDisplay, currentDisplay);

// When a number is pressed, it goes to the display
for (const number of numbers) {
    number.addEventListener("click", () => {
        calculator.outputNumber(number.innerText);
        calculator.updateDisplay();
        calculator.clearError();
    });
}

// When an operator is pressed the value informed before goes upside
for (const operator of operators) {
    operator.addEventListener("click", () => {
        calculator.chooseOperation(operator.innerText);
        calculator.updateDisplay();
        calculator.clearError();
    });
}

// Make the "DEL" button clear the display
clearButton.addEventListener("click", () => {
    calculator.clear();
    calculator.updateDisplay();
    calculator.clearError();
    // Remove the focus of the DEL button so the keyboard inputs work right
    clearButton.blur();
});

// Make the "=" button calculate and show the result
equalsButton.addEventListener("click", () => {
    calculator.calculate();
    calculator.updateDisplay();
    calculator.currentDisplay.classList.add("result");
});

// Make the "Backspace" button erase the last number
deleteButton.addEventListener("click", () => {
    calculator.delete();
    calculator.updateDisplay();
});

// Add keyboard support
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            calculator.outputNumber(e.key);
            calculator.updateDisplay();
            break;
        case "+":
        case "-":
        case "*":
        case "/":
            calculator.chooseOperation(e.key);
            calculator.updateDisplay();
            break;
        case "Enter":
            calculator.calculate();
            calculator.updateDisplay();
            calculator.currentDisplay.classList.add("result");
            break;
        case "Backspace":
            calculator.delete();
            calculator.updateDisplay();
            break;
        case "Escape":
        case "Delete":
            calculator.clear();
            calculator.updateDisplay();
            break;
        case ".":
            calculator.outputNumber(".");
            calculator.updateDisplay();
            break;
    }
});
