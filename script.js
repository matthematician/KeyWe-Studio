const color1Input = document.getElementById('color1');
const color2Input = document.getElementById('color2');
const balloon1 = document.getElementById('balloon1');
const balloon2 = document.getElementById('balloon2');
const logoImage = document.getElementById('logo');
const logoUpload = document.getElementById('logoUpload');

// Update balloon colors
color1Input.addEventListener('input', () => {
  balloon1.setAttribute('fill', color1Input.value);
});

color2Input.addEventListener('input', () => {
  balloon2.setAttribute('fill', color2Input.value);
});

// Handle logo uploads
logoUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function (event) {
      logoImage.setAttribute('href', event.target.result);
    };
    reader.readAsDataURL(file);
  }
});
