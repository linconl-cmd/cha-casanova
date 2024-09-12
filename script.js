// Defina a base URL para o backend
const BASE_URL = 'https://api-chacasa.vercel.app'; // URL do backend em produção

// Função para alternar a visibilidade das seções
function toggleSection(id) {
    const section = document.getElementById(id);
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// Função para selecionar um item
function selectItem(item) {
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

// Função para salvar a seleção no backend
async function saveSelection() {
    const selections = Array.from(document.querySelectorAll('li.selected')).map(li => ({
        name: li.querySelector('.chosen-name') ? li.querySelector('.chosen-name').innerText.replace('- Escolhido por ', '') : 'Desconhecido',
        item: li.textContent.replace(li.querySelector('.chosen-name') ? li.querySelector('.chosen-name').innerText : '', '').trim()
    }));

    // Verifique o formato dos dados antes de enviar
    console.log('Enviando seleção:', selections);

    try {
        const response = await fetch(`${BASE_URL}/save-selection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selections),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Resposta do servidor:', result);
    } catch (error) {
        console.error('Erro ao salvar a seleção:', error);
    }
}

// Função para carregar a seleção do servidor
async function loadSelection() {
    try {
        const response = await fetch(`${BASE_URL}/get-selection`);
        const selections = await response.json();

        // Limpar itens selecionados anteriores
        document.querySelectorAll('li.selected').forEach(li => li.classList.remove('selected'));

        // Adicionar os itens carregados
        selections.forEach(selection => {
            const items = Array.from(document.querySelectorAll('li'));
            items.forEach(item => {
                if (item.textContent.includes(selection.item)) {
                    item.classList.add('selected');
                    const nameSpan = document.createElement('span');
                    nameSpan.classList.add('chosen-name');
                    nameSpan.innerText = `- Escolhido por ${selection.name}`;
                    item.appendChild(nameSpan);
                }
            });
        });
    } catch (error) {
        console.error('Erro ao carregar a seleção:', error);
    }
}

// Carregar seleção ao iniciar a página
window.onload = loadSelection;
