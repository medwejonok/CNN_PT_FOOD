const dropArea = document.querySelector(".drag-area"),
dragText = dropArea.querySelector("header"),
button = dropArea.querySelector("button"),
input = dropArea.querySelector("input");
let file; 

button.onclick = () => {
  input.click();
}

input.addEventListener("change", function () {
  file = this.files[0];
  dropArea.classList.add("active");

  document.getElementById('db').classList.add("hide");
  document.getElementById('df').classList.add("hide");
  document.getElementById('ds').classList.add("hide");
  document.getElementById('dh').classList.add("hide");

  document.getElementById('close').style.display = 'block';

  showFile(); 
});

const close = () => {
  document.getElementById('db').classList.remove("hide");
  document.getElementById('df').classList.remove("hide");
  document.getElementById('ds').classList.remove("hide");
  document.getElementById('dh').classList.remove("hide");
  document.getElementById('close').style.display = 'none';
  dropArea.classList.remove("active");

  document.getElementById('response_result').innerText = '......'

  const img = dropArea.querySelector("img");
  if (img) {
    img.remove();
  }
  dragText.classList.remove("hide");
  button.classList.remove("hide");
}

const closeButton = document.getElementById("close");

closeButton.addEventListener("click", close);


dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});


dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});


dropArea.addEventListener("drop", (event) => {
  event.preventDefault(); 
  
  file = event.dataTransfer.files[0];

  document.getElementById('db').classList.add("hide");
  document.getElementById('df').classList.add("hide");
  document.getElementById('ds').classList.add("hide");
  document.getElementById('dh').classList.add("hide");

  document.getElementById('close').style.display = 'block';

  showFile(); 
});

function showFile() {
  let fileType = file.type; 
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"]; 
  if (validExtensions.includes(fileType)) { 
    let fileReader = new FileReader(); 
    fileReader.onload = () => {
      let fileURL = fileReader.result; 
      let imgTag = document.createElement("img"); 
      imgTag.src = fileURL; 
      dropArea.appendChild(imgTag); 
      dragText.classList.add("hide");
      button.classList.add("hide");
    }
    fileReader.readAsDataURL(file);
    uploadFile(file);
  } else {
    alert("This is not an Image File!");
    dropArea.classList.remove("active");
    dragText.textContent = "Перетащите, чтобы загрузить файл";
  }
}
function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  fetch('http://localhost:5000/api', { 
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    let res = document.getElementById('response_result')

    if(data['response'] == '0'){
      res.innerText = 'Пицца'
    }else{
      res.innerText = 'Хот-дог'
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
