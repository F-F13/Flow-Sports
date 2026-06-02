// ===================================
// FLOW SPORTS
// ===================================

const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDu2eGycA6LEDZ9pfxVkYZUSPfXbJnChi_4bR_T7f1FJR97hdyTopGacbcd5V6k1bSIcBbiSjWlvj9/pub?output=csv";

const imagens = {
    "Camisa Seleção Amarela": "camisa-amarela.jpeg",
    "Camisa Seleção Azul": "camisa-azul.jpeg",
    "Canelito": "canelito.jpeg",
    "Mini-Caneleira": "mini-caneleira.jpeg",
    "Meia Antiderrapante": "meia-antiderrapante.jpeg",
    "Bolsa Necessaire Esportiva": "bolsa-necessaire.jpeg"
};

let produtos = [];
let carrinho = [];

const container = document.getElementById("produtos-container");
const pesquisa = document.getElementById("pesquisa");

// ===================================
// CARREGAR PRODUTOS
// ===================================

async function carregarProdutos() {

    try {

        const resposta = await fetch(CSV_URL);
        const texto = await resposta.text();

        const linhas = texto
            .split("\n")
            .map(linha => linha.trim())
            .filter(linha => linha !== "");

        produtos = [];

        for (let i = 0; i < linhas.length; i++) {

            const colunas = linhas[i]
                .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

            const nome = colunas[0]
                ?.replace(/"/g, "")
                .trim();

            // Ignora cabeçalho e linhas vazias
            if (
                !nome ||
                nome === "Nome"
            ) {
                continue;
            }

            const preco = colunas[1]
                ?.replace(/"/g, "")
                .trim();

            const categoria = colunas[2]
                ?.replace(/"/g, "")
                .trim();

            const estoque = Number(
                colunas[3]
                    ?.replace(/"/g, "")
                    .trim()
            ) || 0;

            produtos.push({
                nome,
                preco,
                categoria,
                estoque,
                imagem:
                    imagens[nome] ||
                    "produto.jpg"
            });

        }

        renderizarProdutos(produtos);

    } catch (erro) {

        console.error(
            "Erro ao carregar planilha:",
            erro
        );

    }

}

// ===================================
// RENDERIZAR PRODUTOS
// ===================================

function renderizarProdutos(lista) {

    container.innerHTML = "";

    lista.forEach(produto => {

        const disponivel =
            produto.estoque > 0;

        container.innerHTML += `

        <div class="produto-card">

            <img
                src="${produto.imagem}"
                alt="${produto.nome}"
            >

            <div class="produto-info">

                <h3>${produto.nome}</h3>

                <p>${produto.categoria}</p>

                <div class="preco">
                    R$ ${produto.preco}
                </div>

                <p class="estoque">
                    ${disponivel
                ? `Estoque: ${produto.estoque}`
                : "ESGOTADO"
            }
                </p>

                ${disponivel

                ? `

<div class="acoes-produto">

    <button
        class="btn-comprar"
        onclick="comprar('${produto.nome}')">

        Comprar no WhatsApp

    </button>

    <button
        class="btn-carrinho"
        onclick="adicionarCarrinho('${produto.nome}')">

        Adicionar ao Carrinho

    </button>

</div>

`

                : `

<button
    class="btn-comprar"
    disabled>

    Esgotado

</button>

`

            }

            </div>

        </div>

        `;

    });

}

// ===================================
// PESQUISA
// ===================================

pesquisa.addEventListener("input", () => {

    const termo =
        pesquisa.value.toLowerCase();

    const filtrados =
        produtos.filter(produto =>

            produto.nome
                .toLowerCase()
                .includes(termo)

        );

    renderizarProdutos(filtrados);

});

// ===================================
// WHATSAPP
// ===================================

function comprar(produto) {

    const nomeCliente = prompt(
        "Digite seu nome:"
    );

    if (!nomeCliente) {
        return;
    }

    let tamanho = "";

    if (
        produto.includes("Camisa")
    ) {

        tamanho = prompt(
            "Qual tamanho da camisa?\n\nP, M, G"
        );

        if (!tamanho) {
            return;
        }

    }

    const numero = "5586994962252"; // coloque o número da loja

    let mensagem = "";

    if (
        produto.includes("Camisa")
    ) {

        mensagem =

            `Olá!

Meu nome é ${nomeCliente}.

Tenho interesse em:

👕 ${produto}

📏 Tamanho: ${tamanho}

Gostaria de mais informações sobre o produto.`;

    } else {

        mensagem =

            `Olá!

Meu nome é ${nomeCliente}.

Tenho interesse em:

📦 ${produto}

Gostaria de mais informações sobre o produto.`;

    }

    const url =
        `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");

}

// ===================================
// CARRINHO
// ===================================

function adicionarCarrinho(nomeProduto) {

    let tamanho = "";

    if (nomeProduto.includes("Camisa")) {

        tamanho = prompt(
            "Escolha o tamanho da camisa:\n\nP, M, G"
        );

        if (!tamanho) {
            return;
        }

    }

    const produto = produtos.find(
        p => p.nome === nomeProduto
    );

    carrinho.push({

        nome: nomeProduto,
        preco: Number(produto.preco),
        tamanho: tamanho

    });

    atualizarCarrinho();

    alert(
        "Produto adicionado ao carrinho!"
    );

}

function atualizarCarrinho() {

    const cartItems =
        document.getElementById("cart-items");

    const cartCount =
        document.getElementById("cart-count");

    cartItems.innerHTML = "";

    if (carrinho.length === 0) {

        cartItems.innerHTML = `
            <p class="cart-empty">
                Seu carrinho está vazio.
            </p>
        `;

    } else {

        let total = 0;

        carrinho.forEach((item, index) => {

            total += Number(item.preco);

            cartItems.innerHTML += `

            <div class="cart-item">

                <div class="cart-item-top">

                    <h4>${item.nome}</h4>

                    <span
                        class="remove-item"
                        onclick="removerCarrinho(${index})">

                        ✖

                    </span>

                </div>

                <p class="cart-price">
                    R$ ${item.preco}
                </p>

                ${item.tamanho
                    ?
                    `<p>Tamanho: ${item.tamanho}</p>`
                    :
                    ""
                }

            </div>

            `;

        });

        cartItems.innerHTML += `

            <div class="cart-total">

                <strong>
                    Total: R$ ${total.toFixed(2)}
                </strong>

            </div>

        `;

    }

    cartCount.textContent =
        carrinho.length;

}

function removerCarrinho(index) {

    carrinho.splice(index, 1);

    atualizarCarrinho();

}

const cartButton =
    document.getElementById("cart-button");

const cartPanel =
    document.getElementById("cart-panel");

const closeCart =
    document.getElementById("close-cart");

cartButton.addEventListener("click", () => {

    cartPanel.classList.toggle(
        "active"
    );

});

closeCart.addEventListener("click", () => {

    cartPanel.classList.remove(
        "active"
    );

});

document
    .getElementById("checkout-btn")
    .addEventListener("click", () => {

        if (carrinho.length === 0) {

            alert(
                "Seu carrinho está vazio."
            );

            return;

        }

        const nomeCliente = prompt(
            "Digite seu nome:"
        );

        if (!nomeCliente) {
            return;
        }

        let mensagem =

            `Olá!

Meu nome é ${nomeCliente}.

Gostaria de comprar:

`;

        carrinho.forEach(item => {

            mensagem +=

                `• ${item.nome}

`;

            if (item.tamanho) {

                mensagem +=
                    `Tamanho: ${item.tamanho}

`;

            }

        });

        mensagem +=
            `Obrigado!`;

        const numero =
            "5586994962252";

        const url =

            `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

        window.open(
            url,
            "_blank"
        );

    });
// ===================================
// INICIAR
// ===================================

carregarProdutos();