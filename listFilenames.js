const ul = document.getElementById('file-list')
files.forEach(element => {
  let li = document.createElement('li')
  li.innerHTML = `
      <a href="list.html?list=${element}">
        ${element}
      </a>
    `
  ul.appendChild(li)
});