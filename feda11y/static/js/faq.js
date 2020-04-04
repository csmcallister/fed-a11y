$(function() {
  const navSelector = "#toc";
  const $myNav = $(navSelector);
  Toc.init({
    $nav: $myNav,
  });
  $("body").scrollspy({
      target: navSelector
  });
  
});
