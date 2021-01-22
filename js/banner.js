/* add a random image to the header */
// console.log("load banner");
window.addEventListener("load", function(event) {
    try {

        var imgDir = "/modules/custom/audiogrambase/images"; 
        var images = [
            "1.2.1_Akustik_im_Meer.jpeg", "1.3.2_Vielfalt_Meeresklang.jpg",
            "1.4.1_Welche_Bedeutung_haben_Geraeusche_fuer_Tiere_im_Meer.jpg",
            "1.3.17_Vielfalt_Meeresklang.jpg", "1.3.7_Vielfalt_Meeresklang.jpg",
            "1.3.1_Vielfalt_Meeresklang.jpg", "1.3.9_Vielfalt_Meeresklang.jpg"
        ];
        var selectedImage = images[Math.floor(Math.random() * images.length)];
        var path = imgDir + "/" + selectedImage;
        document.getElementById("header").style.backgroundImage='url(' + path + ')';
    }
    catch(err) {
        console.log(err);
        document.getElementById("messages").innerHTML += "Script error";
    }
});
