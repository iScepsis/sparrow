/**
 * Показываем модальное окно с переданной информацией
 * @param content - тело сообщения
 * @param headText - заголовок окна
 * @param headStyle (default: primary) - тип сообщения, одноименный bootstrap классам (success, warning, info и т.д)
 */
function showModal(content, headText, headStyle){
    headText = headText || 'Сообщение';
    headStyle = headStyle || 'primary';
    headStyle = 'modal-header bg-' + headStyle;

    var modal = $('#messageModal');
    modal.find('.modal-body').html(content);
    modal.find('.modal-title').html(headText);
    modal.find('.modal-header').attr('class', headStyle);
    modal.modal('show');
}