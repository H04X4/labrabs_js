const request = require('request');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { parse } = require('json2csv');

const getJsonFromUrl = (url) => new Promise((resolve, reject) => {
    request.get(url, { json: true }, (err, res, body) => {
        if (err) reject(err);
        else resolve(body);
    });
});

const saveJsonToFile = (data, filename) => {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Файл ${filename} сохранён`);
};

const saveCsvToFile = (data, filename, fields) => {
    const csv = parse(data, { fields, delimiter: ';' });
    fs.writeFileSync(filename, csv, 'utf-8');
    console.log(`CSV файл ${filename} сохранён`);
};

async function task01() {
    const url = 'http://files-pcoding.1gb.ru/json?filename=users.json';
    const users = await getJsonFromUrl(url);
    const simplified = users.map(u => ({
        id: u.id,
        name: u.name,
        phone: u.phone,
        city: u.address.city
    })).sort((a,b) => a.name.localeCompare(b.name));
    saveJsonToFile(simplified, path.join(__dirname, 'task01_users.json'));
}

async function task02() {
    const url1 = 'http://files-pcoding.1gb.ru/json?filename=wb_laptops_popular.json';
    const url2 = 'http://files-pcoding.1gb.ru/json?filename=wb_laptops_pricedown.json';
    const [popular, pricedown] = await Promise.all([getJsonFromUrl(url1), getJsonFromUrl(url2)]);
    const idsPopular = new Set(popular.map(p => p.id));
    const common = pricedown.filter(p => idsPopular.has(p.id));
    saveJsonToFile(common, path.join(__dirname, 'task02_common.json'));
}

async function task03(brand) {
    const url = 'http://files-pcoding.1gb.ru/json?filename=wb_laptops_popular.json';
    const data = await getJsonFromUrl(url);
    const filtered = data.filter(d =>
        d.brand.toLowerCase() === brand.toLowerCase() &&
        d.storageType.toLowerCase().includes('ssd')
    );
    const simplified = filtered.map(d => ({
        name: d.name,
        brand: d.brand,
        price: d.price,
        screenDiagonal: d.screenDiagonal,
        screenResolution: d.screenResolution,
        ram: d.ram,
        ssd: d.ssd,
        matrixType: d.matrixType
    })).sort((a,b) => a.price - b.price);
    const fields = ['name','brand','price','screenDiagonal','screenResolution','ram','ssd','matrixType'];
    saveCsvToFile(simplified, path.join(__dirname, `task03_${brand}.csv`), fields);
}

function menu() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log('\nВыберите задание:');
    console.log('1 - Task01 (users.json → JSON)');
    console.log('2 - Task02 (общие товары JSON)');
    console.log('3 - Task03 (фильтр по бренду → CSV)');
    console.log('0 - Выход');

    rl.question('Введите номер задания: ', async (answer) => {
        rl.close();
        try {
            switch(answer) {
                case '1': await task01(); break;
                case '2': await task02(); break;
                case '3': 
                    const rl2 = readline.createInterface({ input: process.stdin, output: process.stdout });
                    rl2.question('Введите название бренда: ', async (brand) => {
                        rl2.close();
                        await task03(brand);
                        menu();
                    });
                    return;
                case '0': process.exit(); break;
                default: console.log('Неверный выбор'); break;
            }
        } catch (e) {
            console.error(e);
        }
        menu();
    });
}

menu();