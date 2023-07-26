//values that dictate how the graph "looks"
const step_size = 0.1;
const min_x = -5;
const max_x = 5;
//data for the taylor series approx of sin(x)
let taylorx = [];
let taylory = [];
let siny = [];

function fact(x){
    let ans = 1;
    for(let i = 2; i <= x; i++) ans *= i;
    return ans;
}
//fill from min to max, order refers to order of taylor series, stepsize is how fine the data is
function fillTaylor(order, stepSize, minX, maxX){
    taylorx = [];
    taylory = [];
    siny = [];
    for(let i = minX*100; i <= maxX*100; i+=stepSize*100){
        taylorx.push(i/100);
        taylory.push(calcTaylor(i/100, order));
        siny.push(Math.sin(i/100));
    }
}
//(2n+1)! term overflows, 7th order should be safe and not overflow
function calcTaylor(x, order){
    let ans = 0;
    for(let i = 0; i < order; i++){
        ans += Math.pow(-1, i)*Math.pow(x, 2*i + 1)/fact(2*i+1);
    }return ans;
}

fillTaylor(3, step_size, min_x, max_x);
let ctx = document.getElementById("taylor");
let taylor = new Chart(ctx, {
    type: "line",
    data: {
        labels: taylorx,
        datasets: [{
            label: "taylor",
            data: taylory,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            pointRadius : 0,
            tension : .5
        },{
            label: "sin",
            data: siny,
            backgroundColor: "rgba(186, 221, 243, 0.2)",
            borderColor: "rgba(186, 221, 243, 1)",
            borderWidth: 2,
            pointRadius : 0,
            tension : .5
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
const expansionTerms = ["f(x) = x", "f(x)=x-\\frac{x^3}{3!}", "f(x)=x-\\frac{x^3}{3!}+\\frac{x^5}{5!}", 
    "f(x)=x-\\frac{x^3}{3!}+\\frac{x^5}{5!}-\\frac{x^7}{7!}", "f(x)=x-\\frac{x^3}{3!}+\\frac{x^5}{5!}-\\frac{x^7}{7!}+\\frac{x^9}{9!}",
    "f(x)=x-\\frac{x^3}{3!}+\\frac{x^5}{5!}-\\frac{x^7}{7!}+\\frac{x^9}{9!}-\\frac{x^{11}}{11!}"]
const orderSlider = document.querySelector("#order");
orderSlider.addEventListener("input", (event) => {
    fillTaylor(event.target.value, step_size, min_x, max_x);
    taylor.data.datasets[0].data = taylory;
    taylor.data.datasets[1].data = siny;
    taylor.update();
    document.getElementById("expansionText").textContent = expansionTerms[event.target.value - 1];
})