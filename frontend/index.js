import { backend } from 'declarations/backend';

let display = document.getElementById('display');
let buttons = document.querySelectorAll('button');
let currentValue = '';
let operator = '';
let firstOperand = null;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (value >= '0' && value <= '9' || value === '.') {
            currentValue += value;
            display.value = currentValue;
        } else if (['+', '-', '*', '/'].includes(value)) {
            if (firstOperand === null) {
                firstOperand = parseFloat(currentValue);
                currentValue = '';
                operator = value;
            }
        } else if (value === '=') {
            if (firstOperand !== null && currentValue !== '') {
                const secondOperand = parseFloat(currentValue);
                calculate(firstOperand, secondOperand, operator);
            }
        } else if (value === 'Clear') {
            clear();
        }
    });
});

async function calculate(a, b, op) {
    try {
        let result;
        switch (op) {
            case '+':
                result = await backend.add(a, b);
                break;
            case '-':
                result = await backend.subtract(a, b);
                break;
            case '*':
                result = await backend.multiply(a, b);
                break;
            case '/':
                const divResult = await backend.divide(a, b);
                if (divResult === null) {
                    throw new Error('Division by zero');
                }
                result = divResult;
                break;
        }
        display.value = result;
        currentValue = result.toString();
        firstOperand = null;
        operator = '';
    } catch (error) {
        display.value = 'Error';
        console.error('Calculation error:', error);
    }
}

function clear() {
    currentValue = '';
    firstOperand = null;
    operator = '';
    display.value = '';
}
