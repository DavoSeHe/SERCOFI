
function cargarModulo(archivo) {
    fetch(archivo)
        .then((res) => res.text())
        .then((html) => {
            document.getElementById("contenido-dinamico").innerHTML = html;
        })
        .catch((error) => console.log("Error al cargar el módulo:", error));

    // console.log("Se esta cargando", archivo)
    $("body")[0].classList.remove("bg-dark")
    if (archivo.includes("blog.html")) {

        $("body")[0].classList.add("bg-dark")
        loadBlogPosts();
    }
}

function cargarModuloYScroll(archivo, ancla) {
    fetch(archivo)
        .then((res) => res.text())
        .then((html) => {
            document.getElementById("contenido-dinamico").innerHTML = html;
            setTimeout(() => {
                const target = document.getElementById(ancla);
                if (target) target.scrollIntoView({ behavior: "smooth" });
            }, 100); // da tiempo a que se cargue el contenido
        });
}

function cargaCard(idCard) {
    fetch("modules/aboutUs.html")
        .then((res) => res.text())
        .then((html) => {
            // Crear un contenedor temporal
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Obtener el div con id bioEdith
            const bioEdith = doc.querySelector(idCard);
            console.log(bioEdith);
            document.getElementById("modalContent").innerHTML =
                bioEdith.outerHTML;
        });
    $("#modalCustom").modal("show");
}

cargarModulo("modules/home.html");


//INICIO SERVICIOS

$(document).on("click", ".btn-toggle", function (evt) {

    const buttons = document.querySelectorAll('.btn-toggle');
    const contents = document.querySelectorAll('.text-content');
    buttons.forEach(btn => btn.classList.remove('active'));
    contents.forEach(cont => cont.classList.remove('active'));

    const button = this;
    button.classList.add('active');
    document.getElementById(button.dataset.target).classList.add('active');

});

//FIN SERVICIOS





// INICIO BLOG
let blogApiBaseUrl;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // En desarrollo local, la API está en localhost:3000
    blogApiBaseUrl = 'http://localhost:3000';
} else {
    // En producción, la API estará en el mismo dominio que el front-end
    blogApiBaseUrl = window.location.protocol + '//' + window.location.host;
}

const blogApiUrl = `${blogApiBaseUrl}/api/blog-posts`;
//console.log("URL de la API del Blog utilizada:", blogApiUrl); // Para depuración

// Función para cargar las entradas del blog
function loadBlogPosts() {

  showLoader();

    setTimeout(()=>{


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
                                <div class="col col-card ">
                                    <div class="card blog-card h-100" data-post-id="${post.id}">
                                        <img src="${post.imageUrl}" class="card-img-top blog-card-img-top" alt="${post.title}">
                                        <div class="card-body blog-card-body">
                                            <div>
                                                <h5 class="card-title blog-card-title">${post.title}</h5>
                                                <p class="blog-meta">Por ${post.author} el ${post.date}</p>
                                                <p class="card-text blog-card-text">${post.content}</p>
                                            </div>
                                            <button class="btn bg-mexican-pink mt-3 read-more-btn" data-post-id="${post.id}" onclick="fn_AbreModal(${post.id})">
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
    console.log("termino")
    hideLoader();

    },1000);
   
}

function fn_AbreModal(btn) {
    

    $.ajax({
        url: `${blogApiUrl}`,
        method: "GET",
        dataType: "json",
        success: function (data) {

            const post = data.find(item => item.id == btn);

            if (post) {
                $("#blogPostModalLabel").text(post.title);
                $("#modalPostImage").attr("src", post.imageUrl);
                $("#modalPostAuthor").text(`Por ${post.author}`);
                $("#modalPostDate").text(`Publicado: ${post.date}`);
                $("#modalPostContent").html(`<p>${post.content}</p>`); // Usamos .html() pa1ra permitir HTML si el contenido lo tuviera

                $("#modalPostLink")[0].style.display = "block"
                post.linkUrl != "" ? $("#modalPostLink").attr("href", `${post.linkUrl}`): $("#modalPostLink")[0].style.display = "none";
            } else {
                $("#blogPostModalLabel").text("Error");
                $("#modalPostContent").html(
                    "<p>No se pudo cargar el contenido de la entrada.</p>"
                );
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // console.error(
            //     "Error al cargar la entrada específica:",
            //     textStatus,
            //     errorThrown
            // );
            $("#blogPostModalLabel").text("Error de Carga");
            $("#modalPostContent").html(
                "<p>Hubo un problema al cargar esta entrada del blog. Por favor, inténtalo de nuevo.</p>"
            );
        },
    });

    $("#blogPostModal").modal('show');
}




// LOADING


  // Útil cuando haces fetch/axios y quieres mostrar el loader manualmente
  function showLoader(){
    let loader = document.getElementById('loader');
    if (!loader){
      // Si lo quitaste del DOM, vuelve a crearlo rápidamente:
      loader = document.createElement('div');
      loader.id = 'loader';
      loader.innerHTML = `
        <div class="loader-wrap" aria-label="Cargando contenido">
          <div class="ring" aria-hidden="true"></div>
          <div class="dot" aria-hidden="true"></div>
          <p class="loader-text"><span class="shine">Cargando</span><span class="ellipsis"></span></p>
        </div>`;
      document.body.appendChild(loader);
    }
    loader.classList.remove('hide');
    document.body.classList.add('is-loading');
  }
function hideLoader(){
    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.classList.add('hide');
    document.body.classList.remove('is-loading');
    // Remueve del DOM al terminar la transición
    loader.addEventListener('transitionend', () => loader.remove(), { once:true });
  }

  hideLoader();