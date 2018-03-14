$(document).ready(function() {
  function setHeight() {
    windowHeight = $(window).innerHeight();
    $('#map').css('min-height', windowHeight);
  };
  setHeight();

  // $(window).resize(function() {
  //   setHeight();
  // });
});
