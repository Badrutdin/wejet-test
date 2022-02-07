let block_1 = document.querySelector('.block_1')
let astronaut = document.querySelector('.astronaut')
block_1.addEventListener("mousemove", function(e){
    const paralaxWidth = block_1.offsetWidth
    const paralaxHeight = block_1.offsetHeight
    const coordX = e.pageX;
    const coordY = e.pageY;
    const coordXprocent = coordX / paralaxWidth * 100;
    const coordYprocent = coordY / paralaxHeight * 100;
    const speed = 50;
    block_1.style.cssText = `background-position: ${-coordXprocent / speed * 10 }px ${-coordYprocent / speed * 10}px;`
    astronaut.style.cssText = `transform: translate(${(-coordXprocent +50) / speed * 20}%, ${(-coordYprocent +50) / speed * 20}%);`
})


$('button.form-btn').on('click', function(){
    $('.form_layer').css({'display':'block'})
})

$('.form_layer').find('svg').on('click', function(){
    $('.form_layer').css({'display':'none'})
})