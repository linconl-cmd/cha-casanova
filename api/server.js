const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    if (req.method === 'POST') {
        const selection = req.body;

        // Caminho para salvar o arquivo JSON no diretório
        const filePath = path.join(process.cwd(), 'db.json');

        // Salvar a seleção em um arquivo db.json
        fs.writeFile(filePath, JSON.stringify(selection, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao salvar a seleção' });
            }
            res.json({ message: 'Seleção salva com sucesso' });
        });
    } else if (req.method === 'GET') {
        const filePath = path.join(process.cwd(), 'db.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao carregar a seleção' });
            }
            res.json(JSON.parse(data));
        });
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}
