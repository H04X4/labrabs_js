const request = require('request');
const requestSync = require('sync-request');
const readline = require('readline');

// URL файлов
const url1 = 'https://pcoding.ru/txt/labrab04-1.txt';
const url2 = 'https://pcoding.ru/txt/labrab04-2.txt';
const url3 = 'https://pcoding.ru/txt/labrab04-3.txt';

// 1. Самое большое двузначное число
function task1() {
    request(url1, (err, res, body) => {
        if (err) return console.error(err);
        const numbers = body.match(/\d+/g).map(Number);
        const maxTwoDigit = Math.max(...numbers.filter(n => n >= 10 && n <= 99));
        console.log('Задание 1: Самое большое двузначное число =', maxTwoDigit);
        menu();
    });
}

// 2. Количество строк, где все числа нечётные
function task2() {
    request(url2, (err, res, body) => {
        if (err) return console.error(err);
        const lines = body.split('\n');
        let count = 0;
        lines.forEach(line => {
            const nums = line.match(/\d+/g)?.map(Number) || [];
            if (nums.length > 0 && nums.every(n => n % 2 === 1)) count++;
        });
        console.log('Задание 2: Количество строк с нечётными числами =', count);
        menu();
    });
}

// 3. Индекс строки с максимальной суммой нечётных чисел
function task3() {
    request(url2, (err, res, body) => {
        if (err) return console.error(err);
        const lines = body.split('\n');
        let maxSum = -1;
        let maxIndex = -1;
        lines.forEach((line, idx) => {
            const nums = line.match(/\d+/g)?.map(Number) || [];
            const sumOdd = nums.filter(n => n % 2 === 1).reduce((a,b)=>a+b,0);
            if (sumOdd > maxSum) {
                maxSum = sumOdd;
                maxIndex = idx;
            }
        });
        console.log('Задание 3: Индекс строки с максимальной суммой нечётных чисел =', maxIndex);
        menu();
    });
}

// 4. Языки по возрастанию названия
function task4() {
    const res = requestSync('GET', url3);
    const body = res.getBody('utf-8');
    const lines = body.split('\n');
    const langs = lines.map(line => {
        const parts = line.trim().split(/\s+/);
        const rating = parseFloat(parts[0]);
        const name = parts.slice(1).join(' ');
        return { rating, name };
    });
    langs.sort((a,b) => a.name.localeCompare(b.name));
    console.log('Задание 4: Языки по возрастанию названия:');
    langs.forEach(l => console.log(l.rating.toFixed(1), l.name));
    menu();
}

// 5. Языки по убыванию рейтинга
function task5() {
    const res = requestSync('GET', url3);
    const body = res.getBody('utf-8');
    const lines = body.split('\n');
    const langs = lines.map(line => {
        const parts = line.trim().split(/\s+/);
        const rating = parseFloat(parts[0]);
        const name = parts.slice(1).join(' ');
        return { rating, name };
    });
    langs.sort((a,b) => b.rating - a.rating);
    console.log('Задание 5: Языки по убыванию рейтинга:');
    langs.forEach(l => console.log(l.rating.toFixed(1), l.name));
    menu();
}


function menu() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('\nВыберите задание:');
    console.log('1 - Самое большое двузначное число');
    console.log('2 - Количество строк с нечётными числами');
    console.log('3 - Индекс строки с максимальной суммой нечётных чисел');
    console.log('4 - Языки по возрастанию названия');
    console.log('5 - Языки по убыванию рейтинга');
    console.log('0 - Выход');

    rl.question('Введите номер задания: ', (answer) => {
        rl.close();
        switch(answer) {
            case '1': task1(); break;
            case '2': task2(); break;
            case '3': task3(); break;
            case '4': task4(); break;
            case '5': task5(); break;
            case '0': console.log('Выход'); process.exit(); break;
            default: console.log('Неверный выбор'); menu();
        }
    });
}

menu();