let star_reviews = [];

document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('button3');

    btn.addEventListener("click", addStarReview);

    console.log(btn);

    function addStarReview() {
        console.log(star_reviews);
        star_reviews.push("5");
    }
});