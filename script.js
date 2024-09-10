function toggleSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (section.style.display === "none" || section.style.display === "") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
}

// Função para selecionar o item, riscar e adicionar o nome da pessoa
function selectItem(item) {
    // Se o item já estiver selecionado, não faz nada
    if (item.classList.contains('selected')) {
        return;
    }

    // Perguntar o nome da pessoa
    var person = prompt("Qual o seu nome?");
    if (person) {
        // Marcar o item como selecionado e riscar
        item.classList.add('selected');
        // Adicionar o nome da pessoa ao lado do item
        var nameSpan = document.createElement('span');
        nameSpan.classList.add('chosen-name');
        nameSpan.innerText = `- Escolhido por ${person}`;
        item.appendChild(nameSpan);

        // Salvar a seleção no Local Storage
        saveSelection(item.innerText, person);
    }
}

function saveSelection() {
    var items = document.querySelectorAll('ul li.selected');
    var selection = Array.from(items).map(item => {
        return {
            text: item.textContent.replace(/- Escolhido por .*/, '').trim(),
            chosenBy: item.querySelector('.chosen-name') ? item.querySelector('.chosen-name').textContent.replace('- Escolhido por ', '').trim() : ''
        };
    });
    document.cookie = 'itemSelection=' + encodeURIComponent(JSON.stringify(selection)) + ';path=/';
}

// Função para carregar a seleção dos itens dos cookies
function loadSelection() {
    var cookie = document.cookie.split('; ').find(row => row.startsWith('itemSelection='));
    if (cookie) {
        var selection = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
        selection.forEach(item => {
            var li = Array.from(document.querySelectorAll('ul li')).find(li => li.textContent.includes(item.text));
            if (li) {
                li.classList.add('selected');
                if (item.chosenBy) {
                    var nameSpan = document.createElement('span');
                    nameSpan.classList.add('chosen-name');
                    nameSpan.innerText = `- Escolhido por ${item.chosenBy}`;
                    li.appendChild(nameSpan);
                }
            }
        });
    }
}

// Carregar a seleção ao carregar a página
window.onload = loadSelection;