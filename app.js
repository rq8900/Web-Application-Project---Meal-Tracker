const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// EJS view engine
app.set('view engine', 'ejs');

// =========================
// In-memory array (MAIN DATA)
// =========================
let mealsList = [
    {
        name: "Chicken Rice",
        location: "School Canteen",
        calories: 650,
        rating: 4,
        comment: "Filling and cheap"
    },
    {
        name: "Salad Bowl",
        location: "Cafe",
        calories: 350,
        rating: 5,
        comment: "Very healthy"
    }
];


// =========================
// HOME PAGE
// =========================
app.get('/', (req, res) => {
    res.render('home');
});
// =========================
// LIST PAGE
// =========================
app.get('/meals', (req, res) => {
    res.render('meals', { mealsList });
});


// =========================
// ADD PAGE
// =========================
app.get('/meals/add', (req, res) => {
    res.render('addMeal');
});

// =========================
// ADD NEW MEAL
// =========================
app.post('/meals/add', (req, res) => {

    const newMeal = {
        name: req.body.name,
        location: req.body.location,
        calories: Number(req.body.calories),
        rating: Number(req.body.rating),
        comment: req.body.comment
    };

    mealsList.push(newMeal);
    res.redirect('/meals');
});


// =========================
// SEARCH MEALS
// =========================
app.get('/search', (req, res) => {

    const keyword = (req.query.search || "").toLowerCase().trim();

    if (!keyword) {
        return res.redirect('/meals');
    }

    const filteredMeals = mealsList.filter(meal =>
        meal.name.toLowerCase().includes(keyword) ||
        meal.location.toLowerCase().includes(keyword)
    );

    res.render('meals', { mealsList: filteredMeals });
});
// DETAILS PAGE
// =========================
app.get('/meals/:index', (req, res) => {
    const meal = mealsList[req.params.index];
    res.render('mealDetails', { meal, index: req.params.index });
});

// =========================
// EDIT PAGE
// =========================
app.get('/meals/edit/:index', (req, res) => {
    const meal = mealsList[req.params.index];
    res.render('editMeal', { meal, index: req.params.index });
});

app.post('/meals/edit/:index', (req, res) => {
    mealsList[req.params.index] = {
        name: req.body.name,
        location: req.body.location,
        calories: Number(req.body.calories),
        rating: Number(req.body.rating),
        comment: req.body.comment
    };

    res.redirect('/meals');
});
// =========================
// DELETE MEAL (simple version using index)
// =========================
app.post('/meals/delete/:index', (req, res) => {
    mealsList.splice(req.params.index, 1);
    res.redirect('/meals');
});
// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});