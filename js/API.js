class API {

    obtenerDatos() {
        const url = 'js/comercios.json';
        const respuesta = fetch(url)
            .then(res =>
                res.json()
            );

        return respuesta;


    }


}