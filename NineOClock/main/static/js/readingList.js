// Agregar los escuchadores de eventos después de que el DOM se haya cargado
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.add-to-reading-list').forEach(button => {
        button.addEventListener('click', addToReadingList);
    });

    document.querySelectorAll('.remove-from-reading-list').forEach(button => {
        button.addEventListener('click', removeFromReadingList);
    });

    function addToReadingList(event) {
        var articleElement = event.target.closest('li');
        var articleTitle = articleElement.dataset.articleTitle;

        $.ajax({
            type: "POST",
            url: addToReadingListUrl,
            data: {
                csrfmiddlewaretoken: csrfToken,
                article_title: articleTitle,
            },
            success: function(response) {
                alert(response.message);
                if (response.status === 'success') {
                    // Agregar el artículo a la lista de lectura en la interfaz
                    var readingList = document.getElementById('reading-list');
                    var noArticlesMessage = document.getElementById('no-articles-message');

                    // Eliminar el mensaje "No hay artículos en tu lista de lectura" si está presente
                    if (noArticlesMessage) {
                        noArticlesMessage.remove();
                    }

                    var newListItem = document.createElement('li');
                    newListItem.setAttribute('data-article-title', articleTitle);
                    newListItem.innerHTML = articleTitle + ' <button class="remove-from-reading-list">Eliminar</button>';
                    readingList.appendChild(newListItem);

                    // Agregar el escuchador de evento para el botón de eliminación
                    newListItem.querySelector('.remove-from-reading-list').addEventListener('click', removeFromReadingList);
                }
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    }

    function removeFromReadingList(event) {
        var articleElement = event.target.closest('li');
        var articleTitle = articleElement.dataset.articleTitle;

        $.ajax({
            type: "POST",
            url: removeFromReadingListUrl,
            data: {
                csrfmiddlewaretoken: csrfToken,
                article_title: articleTitle,
            },
            success: function(response) {
                alert(response.message);
                if (response.status === 'success') {
                    articleElement.remove();

                    // Si la lista está vacía, mostrar el mensaje "No hay artículos en tu lista de lectura"
                    var readingList = document.getElementById('reading-list');
                    if (readingList.children.length === 0) {
                        var noArticlesMessage = document.createElement('li');
                        noArticlesMessage.id = 'no-articles-message';
                        noArticlesMessage.textContent = 'No hay artículos en tu lista de lectura.';
                        readingList.appendChild(noArticlesMessage);
                    }
                }
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    }
});
