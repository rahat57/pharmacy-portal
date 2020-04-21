if (localStorage.hasOwnProperty('isLoggedin')) {
    if (localStorage.hasOwnProperty('isLoggedin') && localStorage.getItem('isLoggedin') == "true") {
        console.log('redirection will happen');
        window.location.href = '/heatmap-clustring-js-api/?api_key=$2a$10$FIC4ZAY4wHH3a75k4QuukuPuoU8gYloZcHXeDxb0E3fCVAYD6fSfy'
    } else {
        // window.location.href = '/heatmap-clustring-js-api/login.html'
        console.log('no redirection');

        // alert("please provide a valid email and password to login!")

    }
}


$(document).ready(function() {
    // console.log("ready!");

    $(".form-control").on('input', function() {

        // console.log('key pressed')

        if ($("#username").val() && $("#password").val()) {
            $("#submitLogin").attr("disabled", false)
        } else {
            $("#submitLogin").attr("disabled", true)

        }
    });

    $("#submitLogin").on("click", function(e) {

        if ($("#username").val()) {

            let data = {
                "email": $("#username").val(),
                "password": $("#password").val()
            };
            // let data = {
            //     "email": "admin@tplmaps.com",
            //     "password": "admin123"
            // };

            $.ajax({
                url: 'http://backend.tplmaps.com:8182/admin/user/login',
                type: 'GET',
                data: data,
                dataType: 'json',
                async: true,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa($("#username").val() + ":" + $("#password").val()));
                },
                success: function(data) {
                    // console.log(data)
                    // alert("success")
                        // user = this.data
                    localStorage.setItem('user', JSON.stringify(data))
                    localStorage.setItem('isLoggedin', true)

                    if (localStorage.hasOwnProperty('isLoggedin') && localStorage.getItem('isLoggedin') == "true") {
                        console.log('redirection will happen');
                        window.location.href = '/heatmap-clustring-js-api/?api_key=$2a$10$FIC4ZAY4wHH3a75k4QuukuPuoU8gYloZcHXeDxb0E3fCVAYD6fSfy'
                    } else {
                        // window.location.href = '/heatmap-clustring-js-api/login.html'
                        console.log('no redirection');

                        // alert("please provide a valid email and password to login!")

                    }
                },
                error: function(error) {
                    // console.log('status', error.status)
                    console.log('message', error.responseText)
                    alert("Please enter valid credentials!")
                    $("#username").val('')
                    $("#password").val('')

                }

            });

        } else {
            localStorage.clear()
            localStorage.setItem('isLoggedin', false)
        }
    });
});