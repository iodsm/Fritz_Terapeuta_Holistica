$(document).ready(function() {
    var carrinho = [];
    var total = 0;
    var limiteMaximo = 4; // Limite máximo de itens no carrinho
    var desconto = 0.1; // Valor do desconto (10%)
  
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
  
        var li = $("<li></li>").text(`${nomeProduto} Sessões: ${quantidade} - R$${precoTotalItem.toFixed(2)}`);
        var removerBotao = $("<button class='remover-item'>Remover</button>");
        li.append(removerBotao);
        itensCarrinho.append(li);
      }
  
      if (carrinho.length === limiteMaximo) {
        // Aplicar desconto apenas quando o limite máximo de itens for atingido
        var descontoTotal = novoTotal * desconto;
        novoTotal -= descontoTotal;
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
      var options = $("#pacote option");
      options.each(function() {
        var option = $(this);
        var price = option.data("price");
        var text = option.text();
  
        var uppercaseText = text.toUpperCase();
  
        option.text(uppercaseText);
      });
    }
  
    function adicionarProdutoAoCarrinho(nome, preco) {
      if (carrinho.length >= limiteMaximo) {
        alert("Limite máximo de itens no carrinho alcançado.");
        return;
      }
  
      carrinho.push({ nome: nome, preco: preco });
      atualizarCarrinho();
      $("#pacote option:first").prop("selected", true);
    }
  
    $("#pacote").change(function() {
      var produtoSelecionado = $("#pacote option:selected");
      var nome = produtoSelecionado.val().toUpperCase();
      var preco = parseFloat(produtoSelecionado.data("price"));
  
      adicionarProdutoAoCarrinho(nome, preco);
    });
  
    $("#itens-carrinho").on("click", ".remover-item", function() {
      var li = $(this).closest("li");
      var nomeProduto = li.text().split(" Sessões: ")[0];
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
      var observacao = $("#observacao").val();
      var dataPedido = $("#data_pedido").val();
      var dataFormatada = dataPedido.split("-").reverse().join("/");
  
      if (nome && celular && endereco && dataPedido && carrinho.length > 0) {
        var mensagem = "*Olá, Fritz! Quero fechar este pacote de serviços e agendar uma data.*%0A%0A";
        mensagem += "Nome: " + nome + "%0A";
        mensagem += "Número de Celular: " + celular + "%0A";
        mensagem += "Endereço: " + endereco + "%0A";
        mensagem += "Observação: " + observacao + "%0A";
        mensagem += "Verificar data à partir de: " + dataFormatada + "%0A";
        mensagem += "%0AServiços:%0A";
  
        var produtosEnviados = [];
        carrinho.forEach(function(item) {
          if (!produtosEnviados.includes(item.nome)) {
            var quantidade = carrinho.filter(function(i) {
              return i.nome === item.nome;
            }).length;
            var precoTotalItem = item.preco * quantidade;
            mensagem += `- ${item.nome} Sessões: ${quantidade} (R$${precoTotalItem.toFixed(2)})%0A`;
            produtosEnviados.push(item.nome);
          }
        });
  
        mensagem += "%0A";
        mensagem += "*Valor Total -10%:* R$" + total.toFixed(2) + "%0A";
  
        var url = 'https://wa.me/5531987000656/?text=' + mensagem;
        window.open(url);
      } else {
        alert("Por favor, preencha todos os campos e adicione serviços do pacote ao carrinho antes de fazer o agendamento.");
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
  
    var dataInicio = null;
  var dataFim = null;

  $("#data_pedido").on("click", function() {
    if (dataInicio === null) {
      dataInicio = new Date($(this).val());
      $(this).val(formatarData(dataInicio));
    } else if (dataFim === null) {
      dataFim = new Date($(this).val());
      $(this).val(formatarData(dataInicio) + " - " + formatarData(dataFim));
    } else {
      dataInicio = null;
      dataFim = null;
      $(this).val("");
    }
  });

  function formatarData(data) {
    var dia = data.getDate().toString().padStart(2, "0");
    var mes = (data.getMonth() + 1).toString().padStart(2, "0");
    var ano = data.getFullYear();
    return dia + "/" + mes + "/" + ano;
  }
});
  