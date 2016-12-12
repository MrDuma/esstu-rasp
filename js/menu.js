var kebab = document.querySelector('.kebab'),
    middle = document.querySelector('.middle'),
    cross = document.querySelector('.cross'),
    dropdown = document.querySelector('.m-dropdown');

kebab.addEventListener('click', function() {
  middle.classList.toggle('active');
  cross.classList.toggle('active');
  dropdown.classList.toggle('active');
})