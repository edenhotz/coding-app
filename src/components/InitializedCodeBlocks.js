const Blocks = [
        {
          id: "1",
          title: "Code Block 1",
          content: `// Using async/await in JavaScript
// Youer code goes here
async function fetchData() {
}`, 
          solution: `// Using async/await in JavaScript
async function fetchData() {
  try {
    let response = await fetch("https://api.example.com/data");
    let data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
fetchData();`,
          hint: `What happens when you use setTimeout inside a loop?`,
        },
        {
          id: "2",
          title: "Code Block 2",
          content: `// Understanding Closures
function createCounter() {
}` ,
          solution: `// Understanding Closures
function createCounter() {
  let count = 0;
  return function () {
    count++;
    console.log("Count:", count);
  };
}

const counter = createCounter();
counter(); // Count: 1
counter(); // Count: 2`,
          hint: `What does it mean when a function remembers its outer scope?`,
        },
        {
          id: "3",
          title: "Code Block 3",
          content: `// Handling Promises in JavaScript
const fetchData = () => {
};`,
          solution: `// Handling Promises in JavaScript
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Data loaded successfully!");
    }, 2000);
  });
};

fetchData().then((message) => console.log(message));`,
          hint: `What’s the difference between .then() and .catch()?`,
        },
        {
          id: "4",
          title: "Code Block 4",
          content: `// JavaScript Array Methods
    const numbers = [1, 2, 3, 4, 5];`,
          solution: `// JavaScript Array Methods
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

const filtered = numbers.filter(num => num > 2);
console.log(filtered); // [3, 4, 5]`,
          hint: `JavaScript arrays have built-in methods like .map(), .filter(), and .reduce().`,
        },
      ]

export default Blocks;