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

// Calculator operations
const add = (num1, num2) => num1 + num2;
const subtract = (num1, num2) => num1 - num2;
const multiply = (num1, num2) => num1 * num2;
const divide = (num1, num2) =>
    num1 === 0
        ? (errorDisplay.innerHTML = "[ERROR] Cannot divide by zero")
        : num1 / num2;

// A constructor is a special type of function that helps set
// up an object when it is created. And a class is like a plan
// for what the object should look like, including what it can
// do and what it contains. Classes make it easier to create similar
// objects with the same characteristics.

// Create the Calculator class with its constructor and methods
class Calculator {
    // Constructor that initializes the previousDisplay and currentDisplay
    constructor(previousDisplay, currentDisplay) {
        this.previousDisplay = previousDisplay;
        this.currentDisplay = currentDisplay;

        this.clear();
    }

    calculate() {
        let result;
        const previousOperandFloat = parseFloat(this.previousOperand);
        const currentOperandFloat = parseFloat(this.currentOperand);

        // If either of the operands is not a number, return
        if (isNaN(previousOperandFloat) || isNaN(currentOperandFloat)) return;

        // Switch statement to choose the correct operation based on this.operation
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
                break;
            default:
                return;
        }

        // Reset the operation, previousOperand, and set the result as the currentOperand
        this.operation = undefined;
        this.previousOperand = "";
        this.currentOperand = result;
    }

    // Function to format the number before displaying it
    formatDisplay(number) {
        const stringNumber = number.toString();

        const integerDigits = parseFloat(stringNumber.split(".")[0]);
        const decimalDigits = stringNumber.split(".")[1];

        let integerDisplay;

        // Check if the integer digits are valid
        if (isNaN(integerDigits)) {
            // If not, set integerDisplay to an empty string
            integerDisplay = "";
        } else {
            // If yes, format the integer digits to a locale string
            integerDisplay = integerDigits.toLocaleString("en", {
                maximumFractionDigits: 0,
            });
        }
        // Check if the decimal digits are present
        if (decimalDigits != null) {
            // If yes, return the formatted string
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            // If not, return the formatted integer string
            return integerDisplay;
        }
    }
    // Check if the current operand contains a decimal point and the selected number is also a decimal point

    outputNumber(number) {
        // Clear display if the number showing is the result
        if (this.currentOperand.toString().includes(".") && number === ".") return;
        // Only allows 15 digits numbers max
        if (this.currentOperand.length > 15) return;
        // Clear the display if the number showing is the result of a calculation
        if (
            this.result != "" &&
            this.currentDisplay.classList.contains("result")
        ) {
            this.currentOperand = "";
            this.currentDisplay.classList.remove("result");
        }

        // Add the selected number to the current operand
        this.currentOperand = `${this.currentOperand}${number.toString()}`;
    }

    // Function to choose the operation to perform
    chooseOperation(operator) {
        // Return if there is no current operand
        if (this.currentOperand == "") return;
        // Return if there is no current operand
        if (this.previousOperand !== "") {
            this.calculate();
        }

        // Store the selected operator and the previous operand
        this.operation = operator;
        this.previousOperand = this.currentOperand;
        this.currentOperand = "";
    }

    // Function to update the calculator display
    updateDisplay() {
        // Update the previous display with the previous operand and the selected operator
        this.previousDisplay.innerText = `${this.formatDisplay(
            this.previousOperand
        )} ${this.operation || ""}`;
        // Update the current display with the current operand
        this.currentDisplay.innerText = this.formatDisplay(this.currentOperand);
    }

    // Function to clear the calculator
    clear() {
        // Reset the previous
        this.previousOperand = "";
        this.currentOperand = "0";
        this.operation = undefined;
        this.result = undefined;
    }

    delete() {
        if (this.currentOperand === "0") return;
        if (
            this.currentOperand.toString().length === 1 &&
            parseFloat(this.currentOperand) <= 0
        )
            return;
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
            calculator.clearError();
            clearButton.blur();
            break;
        case "+":
        case "-":
        case "*":
        case "/":
            calculator.chooseOperation(e.key);
            calculator.updateDisplay();
            calculator.clearError();
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
            calculator.clearError();
            break;
        case ".":
            calculator.outputNumber(".");
            calculator.updateDisplay();
            break;
    }
});
