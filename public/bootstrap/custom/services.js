


$(document).on("click", ".btn-toggle", function (evt) {
  
  const buttons = document.querySelectorAll('.btn-toggle');
  const contents = document.querySelectorAll('.text-content');
  buttons.forEach(btn => btn.classList.remove('active'));
  contents.forEach(cont => cont.classList.remove('active'));
  
  const button = this;
  button.classList.add('active');
  document.getElementById(button.dataset.target).classList.add('active');
  
});



