document.addEventListener('DOMContentLoaded', function () {
    const like = document.getElementById('like');
    const dislike = document.getElementById('dislike');

    like.addEventListener("click", function (e) {
        e.preventDefault();
        $('.active').removeClass('active');
        $(this).addClass('active');
        console.log("like");
    });

    dislike.addEventListener("click", function (e) {
        e.preventDefault();
        $('.active').removeClass('active');
        $(this).addClass('active');
        console.log("dislike");
    });
});