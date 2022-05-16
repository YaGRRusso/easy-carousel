# Easy Carousel
Carrossel simples, funcional, editável e automático, sem que você precise perder horas estudando como funciona tudo, basta seguir os poucos passos abaixo e tudo estará funcionando.

## Funcionalidades
- Não precisa de configuração JS.
- Gestos (Swipe com o dedo, arrastar o mouse e setas do teclado)
- Responsivo (Se o DEV configurar pelo CSS)

## Como utilizar
1. Copie todo o bloco **"CAROUSEL-CONTAINER"** e tudo o que estiver nele.
2. Altere apenas o que estiver dentro da tag **"CAROUSEL-SLIDE"**, você pode repeti-lá quantas vezes quiser e colocar o que quiser dentro, desde que siga o padrão abaixo:

```html
<div class="carousel-slider">

    <div class="carousel-slide">
        <!-- LIVRE PARA CODAR -->
    </div>
    <div class="carousel-slide">
        <!-- O CARROSSEL SE ADAPTA AO TAMANHO DO CONTEUDO -->
    </div>
    <div class="carousel-slide">
        <!-- COLOQUE O QUE VOCÊ QUISER -->
    </div>

</div>
```

3. Declare (sempre com **"MIN_WIDTH"**), no arquvio CSS, a porcentagem do tamanho da classe **".CAROUSEL_SLIDE"** de acordo com quantas DIVS devem ser exibidas.

> ### 4 slides desktop e 1 slide no mobile:
```css
.carousel-slide{
    /* 100/4= 25 */
    min-width: 25%;
}

@media (max-width: 425px) {
    .carousel-slide {
        /* 100/1= 100 */
        min-width: 100%;
    }
}
```

> ### 6 slides desktop e 3 slides no mobile:
```css
.carousel-slide{
    /* 100/6= 16.66... */
    min-width: 16.66%;
}

@media (max-width: 425px) {
    .carousel-slide {
        /* 100/3= 33.33... */
        min-width: 33.33%;
    }
}
```

4. Não é preciso nenhuma configuração JS, o script é responsável por calcular a quantidade de slides em tela e gerar os dots automaticamente.