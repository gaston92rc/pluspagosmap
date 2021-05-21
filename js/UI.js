const titulo = document.getElementById('titulo');
class UI {
    constructor() {

        this.api = new API();

        this.markers = new L.LayerGroup();

        // Iniciar el mapa
        this.mapa = this.inicializarMapa();

    }

    inicializarMapa() {
        // Inicializar y obtener la propiedad del mapa
        const map = L.map('mapa').setView([-32.9468193, -60.6393204], 12);
        const enlaceMapa = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + enlaceMapa + ' Contributors',
                maxZoom: 18,
            }).addTo(map);
        return map;

    }

    mostrarEstablecimientos() {
        this.api.obtenerDatos()
            .then(datos => {
                const resultado = datos.comercios;
                console.log(resultado[0])
                this.mostrarPines(resultado);
                const locales = new Set();
                resultado.forEach(res => locales.add(res.nombre_fantasia))
                titulo.innerHTML = `Busca en <b>${locales.size}</b> locales registrados`;
            })
    }

    mostrarPines(datos) {
        this.markers.clearLayers();
        datos.forEach(dato => {
            const { nombre_fantasia, id, longitud, latitud, direccion_calle, direccion_nro, rubro_asj, dias_aplica_promo = "No especificado", vigencia } = dato;

            const opcionesPopUp = L.popup()
                .setContent(`<div key=${id}><p><b>${nombre_fantasia}</b></p>
                <p>Dirección: ${direccion_calle} ${direccion_nro}</p>
                <p>Rubro: ${rubro_asj}</p>
                <p>Dias que aplica la promo: ${dias_aplica_promo}</p>
                <p>Vigencia: ${vigencia}</p></div>
                `)
            const marker = new L.marker([
                parseFloat(latitud/100000000),
                parseFloat(longitud/100000000)
            ]).bindPopup(opcionesPopUp);
            this.markers.addLayer(marker);
        });


        this.markers.
        addTo(this.mapa);
    }
    obtenerSugerencias(busqueda) {
        this.api.obtenerDatos()
            .then(datos => {
                this.filtrarSugerencias(datos.comercios, busqueda)
            })
    }

    filtrarSugerencias(resultado, busqueda) {

        // const filtro = resultado.filter(filtro => filtro.properties.Rubro.toLowerCase().indexOf(busqueda.toLowerCase()) !== -1);
        const filtro = resultado.filter(filtro => this.filtros(filtro, busqueda));
        this.mostrarPines(filtro)
    }
    filtros(properties, busqueda) {
        return this.filtroRubro(properties, busqueda) ||
            this.filtroDireccion(properties, busqueda) ||
            this.filtroNombre(properties, busqueda);
    }



    filtroDireccion(properties, busqueda) {
        return properties.direccion_calle.toLowerCase().indexOf(busqueda.toLowerCase()) !== -1;
    }

    filtroRubro(properties, busqueda) {
        return properties.rubro_asj.toLowerCase().indexOf(busqueda.toLowerCase()) !== -1;
    }
    filtroNombre(properties, busqueda) {
        return properties.nombre_fantasia.toLowerCase().indexOf(busqueda.toLowerCase()) !== -1;
    }
}