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

      var li = $("<li></li>").text(`${nomeProduto} Sessões: ${quantidade} - R$${precoTotalItem.toFixed(2)}`);
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
    var options = $("#produtos option");
    options.each(function() {
      var option = $(this);
      var price = option.data("price");
      var text = option.text();

      var uppercaseText = text.toUpperCase();

      option.text(uppercaseText);
    });
  }

  $("#produtos").change(function() {
    var produtoSelecionado = $("#produtos option:selected");
    var nome = produtoSelecionado.val().toUpperCase(); 
    var preco = parseFloat(produtoSelecionado.data("price"));

    carrinho.push({ nome: nome, preco: preco });
    atualizarCarrinho();
    $("#produtos option:first").prop("selected", true);
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
      var mensagem = "*Olá, Fritz! Gostaria de agendar a data destes serviços.*%0A%0A";
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

function toggleAudio() {
  var audio = document.getElementById("feedback-audio");
  var video = document.querySelector(".video-feedback video");
  var iconActive = document.querySelector(".icon-active");
  var iconMuted = document.querySelector(".icon-muted");

  if (audio.paused) {
    audio.play();
    iconActive.style.display = "inline"; // Mostra o ícone de alto-falante ativo
    iconMuted.style.display = "none"; // Oculta o ícone de áudio cortado
  } else {
    audio.pause();
    iconActive.style.display = "none"; // Oculta o ícone de alto-falante ativo
    iconMuted.style.display = "inline"; // Mostra o ícone de áudio cortado
  }
}