//Função para esconder ou mostrar as seções
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
    if (item.classList.contains('selected')) {
        return;
    }

    // Perguntar o nome da pessoa
    var person = prompt("Qual o seu nome?");
    if (person) {
        item.classList.add('selected');
        var nameSpan = document.createElement('span');
        nameSpan.classList.add('chosen-name');
        nameSpan.innerText = `- Escolhido por ${person}`;
        item.appendChild(nameSpan);

        // Salvar a seleção no servidor
        saveSelection();
    }
}

    // Função para salvar a seleção dos itens no backend
    async function saveSelection() {
        var items = document.querySelectorAll('ul li.selected');
        var selection = Array.from(items).map(item => {
            return {
                text: item.textContent.replace(/- Escolhido por .*/, '').trim(),
                chosenBy: item.querySelector('.chosen-name') ? item.querySelector('.chosen-name').textContent.replace('- Escolhido por ', '').trim() : ''
            };
        });

        try {
            const response = await fetch(`${apiBaseUrl}/api/save-selection`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selection),
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar a seleção');
            }

            const data = await response.json();
            console.log('Seleção salva:', data);
        } catch (error) {
            console.error(error);
        }
    }

    // Função para carregar a seleção dos itens do backend
    async function loadSelection() {
        try {
            const response = await fetch(`${apiBaseUrl}/api/save-selection`);

            if (!response.ok) {
                throw new Error('Erro ao carregar a seleção');
            }

            const selection = await response.json();

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
        } catch (error) {
            console.error(error);
        }
    }

    // Carregar a seleção ao carregar a página
    window.onload = loadSelection;