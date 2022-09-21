let os = require("os");

let red = "\x1B[31m",
    green = "\x1B[32m",
    brightGreen = "\x1B[92m";

let draw = [];
let lPrint = [];
let drawBuffer = [];
let charSet = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ";
let blank = " ";

function rChar() {
    return charSet[Math.floor(Math.random() * charSet.length)];
}

function setPos(row, col) {
    process.stdout.write(`\x1B[${row + 1};${col + 1}H`);
}

let e404 = `
    ██    ████        ██            ██████   █████    █████     ████    █████ 
   ███   ██  ██      ███            ██       ██  ██   ██  ██   ██  ██   ██  ██
  ████   ██ ███     ████            ██       ██  ██   ██  ██   ██  ██   ██  ██
██  ██   ███ ██   ██  ██            ████     █████    █████    ██  ██   █████ 
███████  ██  ██   ███████           ██       ████     ████     ██  ██   ████
    ██   ██  ██       ██            ██       ██ ██    ██ ██    ██  ██   ██ ██ 
    ██    ████        ██            ██████   ██  ██   ██  ██    ████    ██  ██
`;
let i = 0;

setInterval(() => {
    i++;
    if (process.stdout.columns > draw.length) {
        for (let i = 0; i < process.stdout.columns - draw.length; i++) draw.push(-2);
    } else if (process.stdout.columns < draw.length) {
        draw.splice(-(process.stdout.columns - draw.length));
    }
    if (process.stdout.columns > lPrint.length) {
        for (let i = 0; i < process.stdout.columns - lPrint.length; i++) lPrint.push(false);
    } else if (process.stdout.columns < lPrint.length) {
        lPrint.splice(-(process.stdout.columns - lPrint.length));
    }

    let df = [];
    draw = draw.map((v, i) => {
        if (v <= -2) {
            return Math.floor(Math.random() * 50) ? -2 : (lPrint[i] = true && (Math.floor(Math.random() * 7) + 3));
        } else return v;
    });

    draw = draw.map((v, i) => {
        if (v > 0) {
            df.push((lPrint[i] ? (!(lPrint[i] = false) && brightGreen) : green) + rChar());
        } else {
            df.push(blank);
        }
        return v - 1;
    });

    drawBuffer.unshift(df);
    drawBuffer = drawBuffer.slice(0, process.stdout.rows);
    //\x1B[2J
    setPos(0, 0);
    for (let dl of [...drawBuffer, ...new Array(process.stdout.rows).fill([])].slice(0, process.stdout.rows - 1))
        process.stdout.write([...dl, ...new Array(process.stdout.columns).fill(blank)].slice(0, process.stdout.columns).join("") + os.EOL);

    if (i % 10 >= 5) {
        let e = e404.split(/\n|\r|(?:\r\n)/).filter(x => x);
        let initialRow = Math.floor(process.stdout.rows / 2) - Math.floor(e.length / 2);
        let initialCol = Math.floor(process.stdout.columns / 2) - Math.floor(e[1].length / 2);
        //console.log(initialRow, initialCol);

        for (let iRow in e) {
            setPos((+iRow) + initialRow, initialCol);
            process.stdout.write(red + e[iRow]);
        }
    }
}, 200);