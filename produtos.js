$(document).ready(function() {
    var carrinho = [];
    var total = 0;
  
    function atualizarCarrinho() {
      var itensCarrinho = $("#itens-carrinho");
      itensCarrinho.empty();
      var novoTotal = 0;
  
      var contadorItens = {};
  
      carrinho.forEach(function(item) {
        if (contadorItens[item.nome]) {
          contadorItens[item.nome]++;
        } else {
          contadorItens[item.nome] = 1;
        }
      });
  
      for (var nomeProduto in contadorItens) {
        var quantidade = contadorItens[nomeProduto];
        var itemCarrinho = carrinho.find(item => item.nome === nomeProduto);
        var precoTotalItem = itemCarrinho.preco * quantidade;
        novoTotal += precoTotalItem;
  
        var li = $("<li></li>").text(`${nomeProduto} Qtd: ${quantidade} - R$${precoTotalItem.toFixed(2)}`);
        var removerBotao = $("<button class='remover-item'>Remover</button>");
        li.append(removerBotao);
        itensCarrinho.append(li);
      }
  
      // Animação do valor total do carrinho
      $("#total-carrinho")
        .animate({ opacity: 0 }, 400, function() {
          $(this).text("Total: R$ " + novoTotal.toFixed(2))
        })
        .animate({ opacity: 1 }, 400);
  
      total = novoTotal;
    }
  
    function transformarTextoMaiusculas() {
      var options = $("#itens option");
      options.each(function() {
        var option = $(this);
        var price = option.data("price");
        var text = option.text();
  
        var uppercaseText = text.toUpperCase();
  
        option.text(uppercaseText);
      });
    }
  
    $("#itens").change(function() {
      var produtoSelecionado = $("#itens option:selected");
      var nome = produtoSelecionado.val().toUpperCase(); 
      var preco = parseFloat(produtoSelecionado.data("price"));
  
      carrinho.push({ nome: nome, preco: preco });
      atualizarCarrinho();
      $("#itens option:first").prop("selected", true);
    });
  
    $("#itens-carrinho").on("click", ".remover-item", function() {
      var li = $(this).closest("li");
      var nomeProduto = li.text().split(" Qtd: ")[0];
      var indice = carrinho.findIndex(item => item.nome === nomeProduto);
  
      if (indice !== -1) {
        carrinho.splice(indice, 1);
        li.remove();
        atualizarCarrinho();
      }
    });
  
    $("#encomendar").click(function() {
      var nome = $("#nome").val();
      var celular = $("#numero_de_celular").val().replace(/\D/g, "");
      var endereco = $("#endereco").val();
      var dataPedido = $("#data_pedido").val();
      var dataFormatada = dataPedido.split("-").reverse().join("/");
  
      
      if (nome && celular && endereco && dataPedido && carrinho.length > 0) {
        var mensagem = "*Olá, Fritz! Quero encomendar estes produtos.*%0A%0A";
        mensagem += "Nome: " + nome + "%0A";
        mensagem += "Número de Celular: " + celular + "%0A";
        mensagem += "Endereço: " + endereco + "%0A";
        mensagem += "Data da Encomenda: " + dataFormatada + "%0A";
        mensagem += "%0AProdutos:%0A";
  
        var produtosEnviados = [];
        carrinho.forEach(function(item) {
          if (!produtosEnviados.includes(item.nome)) {
            var quantidade = carrinho.filter(function(i) {
              return i.nome === item.nome;
            }).length;
            var precoTotalItem = item.preco * quantidade;
            mensagem += `- ${item.nome} Qtd: ${quantidade} (R$${precoTotalItem.toFixed(2)})%0A`;
            produtosEnviados.push(item.nome);
          }
        });
  
        mensagem += "%0A";
        mensagem += "*Valor Total:* R$" + total.toFixed(2) + "%0A";
  
        var url = 'https://wa.me/5531987000656/?text=' + mensagem;
        window.open(url);
      } else {
        alert("Por favor, preencha todos os campos e adicione itens ao carrinho antes de fazer a encomenda.");
      }
    });
  
    transformarTextoMaiusculas();
  
    var uppercaseFields = $("input[type='text'], input[type='email']");
    uppercaseFields.on("input", function() {
      var input = $(this);
      var originalValue = input.val();
      var uppercaseValue = originalValue.toUpperCase();
      input.val(uppercaseValue);
    });
  
   
    var dataAtual = new Date().toISOString().split('T')[0];
  $("#data_pedido").attr("min", dataAtual);
  $("#data_pedido").attr("max", dataAtual);
  });
  