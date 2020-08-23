console.log("test2");

async function start() {
    return await Promise.resolve('working!');
}


start().then(console.log);