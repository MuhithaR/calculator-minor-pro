// Calculator state variables
let currentInput = '0';
let previousInput = null;
let operation = null;
const display = document.getElementById('display');

// Update display with full expression
function updateDisplay() {
    if (previousInput !== null && operation !== null && currentInput !== '') {
        display.innerHTML = `${previousInput} ${operation} ${currentInput}`;
    } else if (previousInput !== null && operation !== null) {
        display.innerHTML = `${previousInput} ${operation}`;
    } else {
        display.innerHTML = currentInput;
    }
}

// Append number or dot
function appendToDisplay(value) {
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else if (currentInput === 'Error') {
        currentInput = value;
    } else {
        if (value === '.' && currentInput.includes('.')) return;
        currentInput += value;
    }
    updateDisplay();
}

// Clear all
function clearDisplay() {
    currentInput = '0';
    previousInput = null;
    operation = null;
    updateDisplay();
}

// FIXED: Square operation - shows ONLY input number ^2, no "x²"
function squareNumber() {
    previousInput = currentInput;
    operation = '^2';
    currentInput = '';
    // Show only "inputNumber ^2" 
    display.innerHTML = `${previousInput} ^2`;
}

// Select operator
function selectOperation(newOperation) {
    if (previousInput !== null && operation !== null && currentInput !== '') {
        calculate();
    }
    previousInput = currentInput === 'Error' ? '0' : currentInput;
    operation = newOperation;
    currentInput = '';
    updateDisplay();
}

// Calculate result - FIXED: Square works properly
function calculate() {
    if (previousInput === null || operation === null) return;
    
    const prev = parseFloat(previousInput);
    
    if (isNaN(prev)) {
        currentInput = 'Error';
        updateDisplay();
        return;
    }
    
    let result;
    
    switch (operation) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '%':
            if (currentInput === '') return;
            const curr = parseFloat(currentInput);
            if (isNaN(curr)) return;
            
            if (operation === '+') result = prev + curr;
            else if (operation === '-') result = prev - curr;
            else if (operation === '*') result = prev * curr;
            else if (operation === '/') {
                if (curr === 0) {
                    currentInput = 'Error';
                    previousInput = null;
                    operation = null;
                    updateDisplay();
                    return;
                }
                result = prev / curr;
            } else if (operation === '%') result = prev % curr;
            break;
            
        case '^2':
            result = prev * prev;  // Square works!
            break;
            
        default:
            return;
    }
    
    result = Math.abs(result) < 1e-10 ? 0 : result;
    currentInput = result.toString();
    previousInput = null;
    operation = null;
    updateDisplay();
}

// Event handlers
document.querySelectorAll('.btn-number').forEach(btn => {
    btn.onclick = () => appendToDisplay(btn.textContent.trim());
});

document.querySelectorAll('.btn-secondary').forEach(btn => {
    const op = btn.textContent.trim();
    if (['+', '-', '*', '/'].includes(op)) {
        btn.onclick = () => selectOperation(op);
    }
});

document.querySelector('.btn-ac').onclick = clearDisplay;
document.querySelector('.btn-square').onclick = squareNumber;
document.querySelector('.btn-equals').onclick = calculate;
