$(function() {
  $('.toggle').click(function() {
    $(this).toggleClass('active');
    $('.menu').toggleClass('open');
  });
});