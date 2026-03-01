const minSize = 530;
const maxSize = 700;

const minScreenWidth = 1200;
const maxScreenWidth = 1440;

const growthRate = ((maxSize - minSize) / (maxScreenWidth - minScreenWidth))*100;
const baseSize = minSize - (growthRate / 100 * minScreenWidth)

// console.log(growthRate);
// console.log(baseFontSize)

// 4. Update the string formatting to use 'rem' instead of 'px'
console.log(`clamp(${minSize/10}rem, ${(baseSize/10).toFixed(2)}rem + ${(growthRate.toFixed(2))}vw, ${maxSize/10}rem);`)



/*

When Decrease should happen as view port bigger

Example #1
const minSize = -400;
const maxSize = -450;

const minScreenWidth = 768;
const maxScreenWidth = 1024;

Ruth@Davids-Mac-Studio ruth_website_developer % node "/Users/Ruth/Documents/Development/customers/ruth_website_developer/clamp_calc.js"
clamp(-40rem, -25.00rem + -19.53vw, -45rem);

in css convert to 
clamp(-45rem, -25.00rem + -19.53vw, -40rem);

But if something like that comes up : clamp(-4rem, 11.00rem + -12.50vw, -7rem);
The following should be done:

const minSize = -450;
const maxSize = -400;

clamp(-45rem, -70.00rem + 20.83vw, -40rem);

and use it as it is.
===============================================


Example #2
const minSize = 150;
const maxSize = 100;

const minScreenWidth = 768;
const maxScreenWidth = 1024;

clamp(15rem, 30.00rem + -19.53vw, 10rem);

padding-top: clamp(10rem, 30.00rem - 19.53vw, 15rem);

*/