/**
 * Показываем модальное окно с переданной информацией
 * @param content - тело сообщения
 * @param header - заголовок окна
 * @param type (default: primary) - тип сообщения, одноименный bootstrap классам (success, warning, info и т.д)
 */
function showModal(content, header, type){
    header = header || 'Сообщение';
    type = type || 'primary';
    var header = 'modal-header background-' + type;

    var modal = $('#messageModal');
    modal.find('.modal-body').html(content);
    model.find('.modal-title').html(header);
    model.find('.modal-header').attr('class', header);
    modal.modal('show');
}