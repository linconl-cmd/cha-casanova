// Defina a base URL para o backend
const BASE_URL = 'https://api-chacasa.vercel.app'; // URL do backend em produção

// Função para alternar a visibilidade das seções e alterar a cor do h2
function toggleSection(id, headerId) {
    const section = document.getElementById(id);
    const header = document.getElementById(headerId);

    if (section.style.display === 'none' || section.style.display === '') {
        section.style.display = 'block';
        header.classList.add('active-header'); // Adiciona a classe para mudar a cor
    } else {
        section.style.display = 'none';
        header.classList.remove('active-header'); // Remove a classe quando oculto
    }
}

// Função para selecionar um item
function selectItem(item) {
    if (!item.classList.contains('selected')) {
        const person = prompt("Qual o seu nome?");
        if (person) {
            const confirmation = confirm("Tem certeza da sua escolha? Não será possível desfazer essa ação.");
            if (confirmation) {
                item.classList.add('selected');
                const nameSpan = document.createElement('span');
                nameSpan.classList.add('chosen-name');
                nameSpan.innerText = `- Escolhido por ${person}`;
                item.appendChild(nameSpan);
            
            // Salvar a seleção no servidor
            saveSelection();
          }
        }
    } else {
        console.log('Item já selecionado');
    }
}

// Função para salvar a seleção no backend
async function saveSelection() {
    const selections = Array.from(document.querySelectorAll('li.selected')).map(li => ({
        name: li.querySelector('.chosen-name') ? li.querySelector('.chosen-name').innerText.replace('- Escolhido por ', '') : 'Desconhecido',
        item: li.textContent.replace(li.querySelector('.chosen-name') ? li.querySelector('.chosen-name').innerText : '', '').trim()
    }));

    console.log('Dados a serem enviados para o backend:', selections);

    try {
        await fetch(`${BASE_URL}/save-selection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selections),
        });

        
    } catch (error) {
        console.error('Erro ao salvar a seleção:', error);
    }
}

// Função para copiar o e-mail para a área de transferência
function copyEmail() {
    const email = document.getElementById('email').innerText;
    navigator.clipboard.writeText(email).then(() => {
        alert('E-mail copiado para a área de transferência!');
    }).catch(err => {
        console.error('Falha ao copiar o e-mail: ', err);
    });
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
