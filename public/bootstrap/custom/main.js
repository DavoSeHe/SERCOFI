
let blogApiBaseUrl;

        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // En desarrollo local, la API está en localhost:3000
            blogApiBaseUrl = 'http://localhost:3000';
        } else {
            // En producción, la API estará en el mismo dominio que el front-end
            blogApiBaseUrl = window.location.protocol + '//' + window.location.host;
        }

        const blogApiUrl = `${blogApiBaseUrl}/api/blog-posts`;
        console.log("URL de la API del Blog utilizada:", blogApiUrl); // Para depuración

    // Función para cargar las entradas del blog
    function loadBlogPosts() {
      $.ajax({
        url: blogApiUrl,
        method: "GET",
        dataType: "json",
        success: function (data) {
          const $container = $("#blogPostsContainer");
          $container.empty(); // Limpiar contenedor antes de añadir nuevas entradas

          if (data && data.length > 0) {
            data.forEach(function (post) {
              const postHtml = `
                                <div class="col">
                                    <div class="card blog-card h-100" data-post-id="${post.id}">
                                        <img src="${post.imageUrl}" class="card-img-top blog-card-img-top" alt="${post.title}">
                                        <div class="card-body blog-card-body">
                                            <div>
                                                <h5 class="card-title blog-card-title">${post.title}</h5>
                                                <p class="blog-meta">Por ${post.author} el ${post.date}</p>
                                                <p class="card-text blog-card-text">${post.content}</p>
                                            </div>
                                            <button class="btn btn-primary mt-3 read-more-btn" data-bs-toggle="modal" data-bs-target="#blogPostModal" data-post-id="${post.id}">
                                                Leer más
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;
              $container.append(postHtml);
            });
          } else {
            $container.html(
              '<p class="text-center col-12">No hay entradas de blog disponibles en este momento.</p>'
            );
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error(
            "Error al cargar las entradas del blog:",
            textStatus,
            errorThrown
          );
          $("#blogPostsContainer").html(
            '<p class="text-center col-12 text-danger">Error al cargar las entradas del blog. Por favor, intenta de nuevo más tarde.</p>'
          );
        },
      });
    }

    

    // Manejar el evento de mostrar el modal (para cargar contenido completo)
    $("#blogPostModal").on("show.bs.modal", function (event) {
      const button = $(event.relatedTarget); // Botón que activó el modal
      const postId = button.data("post-id"); // Extraer el ID del post

      $.ajax({
        url: `${blogApiUrl}/${postId}`,
        method: "GET",
        dataType: "json",
        success: function (post) {
          if (post) {
            $("#blogPostModalLabel").text(post.title);
            $("#modalPostImage").attr("src", post.imageUrl);
            $("#modalPostAuthor").text(`Por ${post.author}`);
            $("#modalPostDate").text(`el ${post.date}`);
            $("#modalPostContent").html(`<p>${post.content}</p>`); // Usamos .html() para permitir HTML si el contenido lo tuviera
          } else {
            $("#blogPostModalLabel").text("Error");
            $("#modalPostContent").html(
              "<p>No se pudo cargar el contenido de la entrada.</p>"
            );
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error(
            "Error al cargar la entrada específica:",
            textStatus,
            errorThrown
          );
          $("#blogPostModalLabel").text("Error de Carga");
          $("#modalPostContent").html(
            "<p>Hubo un problema al cargar esta entrada del blog. Por favor, inténtalo de nuevo.</p>"
          );
        },
      });
    });
