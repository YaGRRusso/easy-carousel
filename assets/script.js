document.querySelectorAll(".carousel-example").forEach((example) => {
  example.querySelector(".example-info div").addEventListener("click", () => {
    example.classList.toggle("active");
  });
});
