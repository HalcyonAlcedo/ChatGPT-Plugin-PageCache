(function ($) {
    'use strict';

    /*------------- preloader js --------------*/
	function loader() {
		$(window).on('load', function () {
			
		});
	}
	loader();

	var box = document.body
    box.ondragover = function(e) {
        let ev = window.event || e
        ev.preventDefault()
    }
    box.ondrop = function(e) {
        let ev = window.event || e
        ev.preventDefault()
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const dataUrl = event.target.result;
                const image = new Image();
                image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    const lastSlashIndex = code.data.lastIndexOf('/');
                    $(location).attr('href', `/${code.data.substr(lastSlashIndex + 1)}`);
                } else {
                    console.log('未能识别出二维码');
                }
                };
                image.src = dataUrl;
            };
        img.src = event.target.result;
        };
        reader.readAsDataURL(ev.dataTransfer.files[0])
    }
    $("#btn").click(function() {
        $("input").each(function () {
            // 判断值不为空
            event.preventDefault();
            if ($(this).val().length !== 0){
                $(location).attr('href', `/${$(this).val()}`);
            }
        });
	})
})(jQuery);

