const popbox = document.querySelector('.pop_create');

const closeBtn = document.querySelector('.closeBtn');
const createBtn = document.querySelector('.createBtn');


function openUpload(){
    popbox.style.right = '0';
    popbox.style.opacity = '1';
    popbox.style.visibility = 'visible';
}

function closeUpload(){
    popbox.style.right = '-50%';
    popbox.style.opacity = '0';
    popbox.style.visibility = 'hidden';

}


function init(){
    createBtn.addEventListener('click',openUpload);
    closeBtn.addEventListener('click',closeUpload);
}

init();


$(document).ready(function(){
    var fileTarget = $('#selectFile');
    fileTarget.on('change', function(){ // 값이 변경되면
        if(window.FileReader){ // modern browser
            var filename = $(this)[0].files[0].name;
        }
        else { // old IE
            var filename = $(this).val().split('/').pop().split('\\').pop(); // 파일명만 추출
        } // 추출한 파일명 삽입
        $(this).siblings('.selectFilebox').val(filename);
    });
});
