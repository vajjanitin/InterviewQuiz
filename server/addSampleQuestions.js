const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

const sampleQuestions = [
  {
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
    answer: "O(log n)",
    subject: "dsa",
    branch: "CSE",
    difficulty: "Easy" // difficulty field added for mode filtering
  },
  {
    question: "Which data structure uses LIFO principle?",
    options: ["Queue", "Stack", "Tree", "Graph"],
    answer: "Stack",
    subject: "dsa",
    branch: "CSE",
    difficulty: "Easy"
  },
  {
    question: "What is the worst-case time complexity of Quick Sort?",
    options: ["O(n)", "O(n log n)", "O(n^2)", "O(log n)"],
    answer: "O(n^2)",
    subject: "dsa",
    branch: "CSE",
    difficulty: "Medium"
  },
  {
    question: "Which traversal uses a queue?",
    options: ["Inorder", "Preorder", "Postorder", "Level Order"],
    answer: "Level Order",
    subject: "dsa",
    branch: "CSE",
    difficulty: "Medium"
  },
  {
    question: "What is a linked list?",
    options: ["Array", "Linear data structure", "Tree", "Graph"],
    answer: "Linear data structure",
    subject: "dsa",
    branch: "CSE",
    difficulty: "Hard"
  },
  {
    question: "What does DBMS stand for?",
    options: ["Data Base Management System", "Data Binary Management", "Data Backup Management", "None"],
    answer: "Data Base Management System",
    subject: "dbms",
    branch: "CSE",
    difficulty: "Easy"
  },
  {
    question: "Which normal form eliminates transitive dependency?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    answer: "3NF",
    subject: "dbms",
    branch: "CSE",
    difficulty: "Medium"
  },
  {
    question: "What is a primary key?",
    options: ["Unique identifier", "Foreign reference", "Index", "Constraint"],
    answer: "Unique identifier",
    subject: "dbms",
    branch: "CSE",
    difficulty: "Easy"
  },
  {
    question: "Which command retrieves data?",
    options: ["GET", "SELECT", "FETCH", "RETRIEVE"],
    answer: "SELECT",
    subject: "dbms",
    branch: "CSE",
    difficulty: "Medium"
  },
  {
    question: "What is normalization?",
    options: ["Database design", "Query optimization", "Data encryption", "Backup"],
    answer: "Database design",
    subject: "dbms",
    branch: "CSE",
    difficulty: "Hard"
  },
  {
    question: "What does OS stand for?",
    options: ["Operating System", "Open System", "Optical System", "None"],
    answer: "Operating System",
    subject: "os",
    branch: "CSE",
    difficulty: "Easy"
  },
  {
    question: "Which scheduling algorithm is non-preemptive?",
    options: ["Round Robin", "FCFS", "Priority", "Multilevel Queue"],
    answer: "FCFS",
    subject: "os",
    branch: "CSE",
    difficulty: "Medium"
  },
  {
    question: "What is deadlock?",
    options: ["Process waiting indefinitely", "CPU idle", "Memory full", "Disk error"],
    answer: "Process waiting indefinitely",
    subject: "os",
    branch: "CSE",
    difficulty: "Medium"
  },
  {
    question: "What is paging?",
    options: ["Memory management", "CPU scheduling", "File system", "I/O management"],
    answer: "Memory management",
    subject: "os",
    branch: "CSE",
    difficulty: "Hard"
  },
  {
    question: "What is thrashing?",
    options: ["Excessive paging", "CPU overload", "Disk failure", "Network error"],
    answer: "Excessive paging",
    subject: "os",
    branch: "CSE",
    difficulty: "Hard"
  },
  {
    question: "What does OOP stand for?",
    options: ["Object Oriented Programming", "Object Oriented Process", "Operator Oriented", "None"],
    answer: "Object Oriented Programming",
    subject: "oops",
    branch: "CSE",
    difficulty: "Easy"
  },
  {
    question: "Which pillar provides data hiding?",
    options: ["Inheritance", "Polymorphism", "Encapsulation", "Abstraction"],
    answer: "Encapsulation",
    subject: "oops",
    branch: "CSE",
    difficulty: "Medium"
  },
  {
    question: "What is method overriding?",
    options: ["Same method in same class", "Same method different class", "Same method parent and child", "None"],
    answer: "Same method parent and child",
    subject: "oops",
    branch: "CSE",
    difficulty: "Medium"
  },
  {
    question: "Which keyword for inheritance in Java?",
    options: ["extends", "implements", "inherits", "super"],
    answer: "extends",
    subject: "oops",
    branch: "CSE",
    difficulty: "Easy"
  },
  {
    question: "What is polymorphism?",
    options: ["Many forms", "Data hiding", "Code reuse", "Object creation"],
    answer: "Many forms",
    subject: "oops",
    branch: "CSE",
    difficulty: "Hard"
  },
  {
    question: "What does CN stand for?",
    options: ["Computer Network", "Communication Network", "Central Network", "None"],
    answer: "Computer Network",
    subject: "cn",
    branch: "CSE",
    difficulty: "Easy"
  },
  {
    question: "Which layer does routing?",
    options: ["Physical", "Data Link", "Network", "Transport"],
    answer: "Network",
    subject: "cn",
    branch: "CSE",
    difficulty: "Medium"
  },
  {
    question: "What is TCP?",
    options: ["Transmission Control Protocol", "Transfer Control", "Transport Control", "None"],
    answer: "Transmission Control Protocol",
    subject: "cn",
    branch: "CSE",
    difficulty: "Medium"
  },
  {
    question: "Which protocol is connection-oriented?",
    options: ["UDP", "TCP", "IP", "ICMP"],
    answer: "TCP",
    subject: "cn",
    branch: "CSE",
    difficulty: "Hard"
  },
  {
    question: "What is IP address?",
    options: ["Logical address", "Physical address", "MAC address", "Port number"],
    answer: "Logical address",
    subject: "cn",
    branch: "CSE",
    difficulty: "Advanced"
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await Question.insertMany(sampleQuestions);
    console.log('✅ Added 25 sample questions with difficulty levels!');
    console.log('   - DSA: 5 questions (1x Easy, 2x Medium, 2x Hard)');
    console.log('   - DBMS: 5 questions (2x Easy, 2x Medium, 1x Hard)');
    console.log('   - OS: 5 questions (1x Easy, 2x Medium, 2x Hard)');
    console.log('   - OOPs: 5 questions (2x Easy, 2x Medium, 1x Hard)');
    console.log('   - CN: 5 questions (1x Easy, 2x Medium, 1x Hard, 1x Advanced)');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });