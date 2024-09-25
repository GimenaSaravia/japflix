document.addEventListener("DOMContentLoaded", async () => {
    let moviesData = [];

    // Cargar datos de la API al cargar la página
    try {
        const response = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
        moviesData = await response.json();
        console.log('Películas cargadas:', moviesData);
    } catch (error) {
        console.error('Error al cargar las películas:', error);
        return;
    }

    // Referencias a los elementos del DOM
    const inputBuscar = document.getElementById('inputBuscar');
    const btnBuscar = document.getElementById('btnBuscar');
    const lista = document.getElementById('lista');

    // Referencias a los elementos del contenedor de detalles de la película
    const movieDetail = document.getElementById('movieDetail');
    const movieTitle = document.getElementById('movieTitle');
    const movieOverview = document.getElementById('movieOverview');
    const movieGenres = document.getElementById('movieGenres');

    // Manejar el evento de buscar películas
    btnBuscar.addEventListener('click', () => {
        const query = inputBuscar.value.toLowerCase().trim();
        console.log('Query ingresado:', query);

        // Limpiar lista anterior
        lista.innerHTML = '';
        movieDetail.classList.remove('active'); // Ocultar detalles anteriores

        if (query) {
            const peliculasFiltradas = moviesData.filter(movie =>
                movie.title.toLowerCase().includes(query) ||
                movie.genres.some(g => typeof g === 'string' && g.toLowerCase().includes(query)) ||
                (movie.tagline && movie.tagline.toLowerCase().includes(query)) ||
                (movie.overview && movie.overview.toLowerCase().includes(query))
            );

            if (peliculasFiltradas.length > 0) {
                peliculasFiltradas.forEach(movie => {
                    const li = document.createElement('li');
                    li.classList.add('list-group-item', 'bg-light', 'mb-2');
                    li.innerHTML = `
                        <h5>${movie.title}</h5>
                        <p>${movie.tagline || 'Sin descripción'}</p>
                        <p>${renderStars(movie.vote_average)}</p>
                    `;
                    lista.appendChild(li);

                    // Evento para mostrar los detalles de la película al hacer clic
                    li.addEventListener('click', () => {
                        mostrarDetallesPelicula(movie);
                    });
                });
            } else {
                lista.innerHTML = '<li class="list-group-item bg-light mb-2">No se encontraron películas</li>';
            }
        }
    });

        // Función para mostrar detalles de la película
    function mostrarDetallesPelicula(movie) {
        movieTitle.textContent = movie.title;
        movieOverview.textContent = movie.overview;

        // Limpiar géneros anteriores
        movieGenres.innerHTML = '';

        // Recorrer los géneros y obtener su propiedad 'name'
        movie.genres.forEach(genre => {
            const span = document.createElement('span');
            span.textContent = genre.name; // Acceder a la propiedad 'name' de cada objeto 'genre'
            movieGenres.appendChild(span);
        });

        // Mostrar la información adicional
        document.getElementById('releaseYear').textContent = `Año de lanzamiento: ${new Date(movie.release_date).getFullYear()}`;
        document.getElementById('runtime').textContent = `Duración: ${movie.runtime} minutos`;
        document.getElementById('budget').textContent = `Presupuesto: $${movie.budget.toLocaleString()}`;
        document.getElementById('revenue').textContent = `Ganancias: $${movie.revenue.toLocaleString()}`;

        // Mostrar el contenedor de detalles
        movieDetail.classList.add('active');
    }

    // Función para alternar el desplegable
    document.getElementById('moreInfoButton').addEventListener('click', function () {
        const extraInfo = document.getElementById('extraInfo');
        if (extraInfo.style.display === 'none') {
            extraInfo.style.display = 'block';
        } else {
            extraInfo.style.display = 'none';
        }
    });


    // Función para calificar con estrellas según el voto promedio
    function renderStars(vote) {
        const stars = Math.round(vote / 2);
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            starsHtml += `<span class="fa fa-star ${i < stars ? 'checked' : ''}"></span>`;
        }
        return starsHtml;
    }
});
