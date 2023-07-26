//values that dictate how the graph "looks"
const step_size = 0.1;
const min_x = -5;
const max_x = 5;
//data for the taylor series approx of sin(x)
let taylorx = [];
let taylory = [];
let siny = [];
let fntype = 0;
let orderNum = 3;
function fact(x){
    let ans = 1;
    for(let i = 2; i <= x; i++) ans *= i;
    return ans;
}
//fill from min to max, order refers to order of taylor series, stepsize is how fine the data is
function fillTaylor(order, stepSize, minX, maxX, fntype){
    taylorx = [];
    taylory = [];
    siny = [];
    for(let i = minX*100; i <= maxX*100; i+=stepSize*100){
        taylorx.push(i/100);
        if(fntype == 0){
            taylory.push(calcSin(i/100, order));
            siny.push(Math.sin(i/100));
        }else if(fntype ==1){
            taylory.push(calcCos(i/100, order));
            siny.push(Math.cos(i/100));
        }else if(fntype == 2){
            taylory.push(calcATan(i/100, order));
            siny.push(Math.atan(i/100));
        }else if(fntype == 3){
            taylory.push(calcExp(i/100, order) - 1.5);
            siny.push(Math.pow(Math.E, i/100) - 1.5)
        }
    }
}
//(2n+1)! term overflows, 7th order should be safe and not overflow
function calcSin(x, order){
    let ans = 0;
    for(let i = 0; i < order; i++){
        ans += Math.pow(-1, i)*Math.pow(x, 2*i + 1)/fact(2*i+1);
    }return ans;
}
function calcCos(x, order){
    let ans = 0;
    for(let i = 0; i < order; i++){
        ans += Math.pow(-1, i)*Math.pow(x, 2*i)/fact(2*i);
    }return ans;
}

function calcATan(x, order){
    let ans = 0;
    for(let i = 0; i < order; i++){
        ans += Math.pow(-1, i)*Math.pow(x, 2*i + 1)/(2*i+1);
    }return ans;
}

function calcExp(x, order){
    let ans = 0;
    for(let i = 0; i < order; i++){
        ans += Math.pow(x, i)/fact(i);
    }return ans;
}
fillTaylor(orderNum, step_size, min_x, max_x, fntype);
let ctx = document.getElementById("taylor");
let taylor = new Chart(ctx, {
    type: "line",
    data: {
        labels: taylorx,
        datasets: [{
            label: "taylor",
            data: taylory,
            backgroundColor: "rgba(187, 134, 252, .2)",
            borderColor: "rgba(187, 134, 252, .9)",
            borderWidth: 3,
            pointRadius : 0,
            tension : .4
        },{
            label: "sin",
            data: siny,
            backgroundColor: "rgba(3, 218, 198, .2)",
            borderColor: "rgba(3, 218, 198, .9)",
            borderWidth: 3,
            pointRadius : 0,
            tension : .4
        }
    ]
    },options: {
        plugins: {
            legend: {
                display: false
            },
        },scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              grid: {
                display: false,
              },min : -1.5,
              max : 1.5
            }
          }
    }
});
const expansionTerms = [["f(x) = x", "f(x)=x-\\frac{x^3}{3!}", "f(x)=x-\\frac{x^3}{3!}+\\frac{x^5}{5!}", 
    "f(x)=x-\\frac{x^3}{3!}+\\frac{x^5}{5!}-\\frac{x^7}{7!}", "f(x)=x-\\frac{x^3}{3!}+\\frac{x^5}{5!}-\\frac{x^7}{7!}+\\frac{x^9}{9!}",
    "f(x)=x-\\frac{x^3}{3!}+\\frac{x^5}{5!}-\\frac{x^7}{7!}+\\frac{x^9}{9!}-\\frac{x^{11}}{11!}"],
    ["f(x)=1", "f(x)=1-\\frac{x^2}{2!}", "f(x)=1-\\frac{x^2}{2!}+\\frac{x^4}{4!}", 
    "f(x)=1-\\frac{x^2}{2!}+\\frac{x^4}{4!}-\\frac{x^6}{6!}", "f(x)=1-\\frac{x^2}{2!}+\\frac{x^4}{4!}-\\frac{x^6}{6!}+\\frac{x^8}{8!}",
    "f(x)=1-\\frac{x^2}{2!}+\\frac{x^4}{4!}-\\frac{x^6}{6!}+\\frac{x^8}{8!}-\\frac{x^{10}}{10!}"],
    ["f(x) = x", "f(x)=x-\\frac{x^3}{3}", "f(x)=x-\\frac{x^3}{3}+\\frac{x^5}{5}", 
    "f(x)=x-\\frac{x^3}{3}+\\frac{x^5}{5}-\\frac{x^7}{7}", "f(x)=x-\\frac{x^3}{3}+\\frac{x^5}{5}-\\frac{x^7}{7}+\\frac{x^9}{9}",
    "f(x)=x-\\frac{x^3}{3}+\\frac{x^5}{5}-\\frac{x^7}{7}+\\frac{x^9}{9}-\\frac{x^{11}}{11}"],
    ["f(x)=1","f(x)=1+x","f(x)=1+x+\\frac{x^2}{2}","f(x)=1+x+\\frac{x^2}{2}+\\frac{x^3}{3!}",
    "f(x)=1+x+\\frac{x^2}{2}+\\frac{x^3}{3!}+\\frac{x^4}{4!}",
    "f(x)=1+x+\\frac{x^2}{2}+\\frac{x^3}{3!}+\\frac{x^4}{4!}+\\frac{x^5}{5!}"]]
    
const afuncText = ["g(x)=sin(x)","g(x)=cos(x)","g(x)=tan^{-1}(x)","g(x)=e^x"];
const orderSlider = document.querySelector("#order");
orderSlider.addEventListener("input", (event) => {
    orderNum = event.target.value;
    updateChart();
})

//checks for the sin/cos/atan radio buttons
function checkRadio(i){
    fntype = i;
    updateChart();
}
function updateChart(){
    fillTaylor(orderNum, step_size, min_x, max_x, fntype);
    taylor.data.datasets[0].data = taylory;
    taylor.data.datasets[1].data = siny;
    taylor.update();
    document.getElementById("expansionText").textContent = expansionTerms[fntype][orderNum - 1];
    document.getElementById("afuncText").textContent = afuncText[fntype];
}